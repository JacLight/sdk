import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BankingLimitsField, bankingRef, cents, BankingEscheatAssignmentField } from './_banking-fields';

/**
 * A deposit account at the bank — or one of the bank's own books.
 *
 * Customer accounts (`holderType` individual or business) are held by CRM customers, each with
 * their own `customer_kyc`. A business account also names the company and the people who own
 * or control it. The bank's own books (`holderType: 'bank'`) are accounts too — ACH settlement,
 * fee income, interest expense, suspense — so every movement is two sides of one ledger.
 *
 * Balances move only through `banking_transaction` → `banking_entry`, as one conditional update
 * on this record keyed by the transaction (`appliedKeys`), so a retry never posts twice.
 *   posted     what has settled on the account
 *   held       what active holds keep back
 *   available  posted − held (+ the overdraft limit) — computed, never stored
 */
export const BankingAccountSchema = () => {
  return {
    type: 'object',
    properties: {
      holdEffects: {
        type: 'object', hidden: true, readOnly: true,
        additionalProperties: { type: 'object', properties: {
          hash: { type: 'string' }, amount: { type: 'integer' }, reservedAt: { type: 'string', format: 'date-time' },
          releasedAt: { type: 'string', format: 'date-time' }, releaseStatus: { type: 'string', enum: ['released', 'expired'] },
        }, required: ['hash', 'amount'] },
      },
      postingReceipts: {
        type: 'object', hidden: true, readOnly: true,
        description: 'Private untrimmed posting recovery proof, committed atomically with each account leg.',
        additionalProperties: { type: 'object', properties: {
          planHash: { type: 'string' }, legs: { type: 'object', additionalProperties: { type: 'object', properties: {
            key: { type: 'string' }, index: { type: 'integer', minimum: 0 }, account: { type: 'string' }, side: { type: 'string', enum: ['debit', 'credit'] },
            amount: { type: 'integer', minimum: 1 }, delta: { type: 'integer' }, heldDelta: { type: 'integer' }, balanceAfter: { type: 'integer' }, postedAt: { type: 'string', format: 'date-time' },
            captureHold: { type: 'string' }, state: { type: 'string', enum: ['applied', 'reverted'] }, revertedAt: { type: 'string', format: 'date-time' }, revertedBalanceAfter: { type: 'integer' },
          }, required: ['key', 'index', 'account', 'side', 'amount', 'delta', 'heldDelta', 'balanceAfter', 'postedAt', 'state'] } },
        }, required: ['planHash', 'legs'] },
      },
      initialHeldCredits: {
        type: 'object', hidden: true, readOnly: true,
        description: 'Private crash-recovery proof for atomic initial deposit credit and hold publication. Removed only after durable transaction proof and hold materialization.',
        additionalProperties: { type: 'object', properties: {
          planHash: { type: 'string' }, amount: { type: 'integer', minimum: 0 }, appliedKey: { type: 'string' }, creditedAt: { type: 'string', format: 'date-time' },
          receipts: { type: 'array', items: { type: 'object', properties: {
            key: { type: 'string' }, account: { type: 'string' }, side: { type: 'string', enum: ['debit', 'credit'] }, amount: { type: 'integer', minimum: 0 }, balanceAfter: { type: 'integer' },
          }, required: ['key', 'account', 'side', 'amount', 'balanceAfter'] } },
        }, required: ['planHash', 'amount', 'appliedKey', 'creditedAt', 'receipts'] },
      },
      checkStops: {
        type: 'array', title: 'Check stop instructions', readOnly: true,
        description: 'Bank-reviewed on-us check instructions; not a sponsor-network transmission.',
        items: { type: 'object', properties: {
          id: { type: 'string' }, checkNumber: { type: 'string' }, status: { type: 'string', enum: ['active', 'released'] },
          effectiveDate: { type: 'string', format: 'date' }, expiresOn: { type: 'string', format: 'date' }, reason: { type: 'string' },
          requestedBy: { type: 'string' }, createdAt: { type: 'string', format: 'date-time' }, approvalId: { type: 'string' },
          releasedAt: { type: 'string', format: 'date-time' }, releasedBy: { type: 'string' }, releaseReason: { type: 'string' },
        }, required: ['id', 'checkNumber', 'status', 'effectiveDate', 'expiresOn', 'reason', 'requestedBy', 'createdAt'] },
      },
      escheat: BankingEscheatAssignmentField(),
      accountNumber: {
        type: 'string',
        unique: true,
        readOnly: true,
        description: 'Set by the bank at opening. Shown in full only to the holders.',
        group: 'number',
      },
      nickname: { type: 'string', group: 'number' },
      product: bankingRef(DataType.banking_product, 'title'),
      kind: {
        type: 'string',
        enum: ['checking', 'savings', 'money_market', 'certificate', 'loan', 'internal'],
        readOnly: true,
        description: 'loan: a booked loan’s balance (`banking_loan`) — what the borrower owes, so a debit raises it.',
        group: 'kind',
      },
      holderType: {
        type: 'string',
        enum: ['individual', 'business', 'bank'],
        group: 'kind',
      },
      currency: { type: 'string', default: 'USD', group: 'kind' },
      status: {
        type: 'string',
        enum: ['pending', 'open', 'frozen', 'dormant', 'closed'],
        default: 'pending',
        description: 'pending until every holder’s KYC (and the business’s KYB) is verified and the opening deposit lands.',
        group: 'kind',
      },

      holders: {
        type: 'array',
        title: 'Holders',
        items: {
          type: 'object',
          properties: {
            customer: bankingRef(DataType.customer, 'email'),
            role: {
              type: 'string',
              enum: ['primary', 'joint', 'authorized_user', 'beneficial_owner', 'controller', 'beneficiary'],
              description: 'primary and joint own the money; authorized_user can use it; beneficial_owner and controller are the people behind a business; beneficiary is paid on death.',
            },
            ownershipPercent: { type: 'number', minimum: 0, maximum: 100 },
            addedAt: { type: 'string', format: 'date-time' },
          },
          required: ['customer', 'role'],
        },
      },

      business: {
        type: 'object',
        title: 'Business',
        collapsible: true,
        properties: {
          company: bankingRef(DataType.company, 'name'),
          legalName: { type: 'string' },
          dba: { type: 'string' },
          entityType: { type: 'string', enum: ['sole_proprietor', 'llc', 'corporation', 'partnership', 'nonprofit', 'trust', 'other'] },
          ein: { type: 'string', description: 'Employer Identification Number. Stored encrypted; responses show the last 4.' },
          formedIn: { type: 'string', description: 'State or country of formation.' },
          industry: { type: 'string', description: 'NAICS code.' },
          kybStatus: { type: 'string', enum: ['pending', 'in_review', 'verified', 'rejected'], default: 'pending' },
          kybVerifiedAt: { type: 'string', format: 'date-time' },
          kybNote: { type: 'string', description: 'Why KYB was verified or rejected, as the reviewer wrote it.' },
          ownersCertifiedAt: { type: 'string', format: 'date-time', description: 'When the beneficial owners (25%+ owners and one control person) were certified (31 CFR 1010.230).' },
          ownersCertifiedBy: { type: 'string' },
        },
      },

      systemCode: {
        type: 'string',
        enum: [
          'settlement_ach',
          'settlement_wire',
          'settlement_rtp',
          'settlement_card',
          'settlement_check',
          'fee_income',
          'interest_expense',
          'suspense',
          'losses',
          'funding',
          'teller_cash',
          'vault_cash',
          'cash_over_short',
          'official_checks',
          'loans_receivable',
          'interest_income',
          'fee_income_loans',
          'charge_offs',
          'loan_suspense',
        ],
        description: 'Which of the bank’s own books this is (holderType bank only). One per code.',
        group: 'kind',
      },

      postedBalance: { ...cents('Settled balance.'), readOnly: true, default: 0, group: 'balance' },
      heldAmount: { ...cents('Kept back by active holds.'), readOnly: true, default: 0, group: 'balance' },
      appliedKeys: {
        type: 'array',
        items: { type: 'string' },
        hidden: true,
        readOnly: true,
        description: 'The last posting keys applied — the guard against posting twice.',
      },

      blocked: {
        type: 'array',
        title: 'Blocked',
        items: { type: 'string', enum: ['debits', 'credits', 'cards', 'external_out'] },
        description: 'What the account may not do right now, short of a freeze. Set by staff or a monitoring rule.',
      },
      freeze: {
        type: 'object',
        collapsible: true,
        properties: {
          reason: { type: 'string', enum: ['customer_request', 'compliance', 'legal_order', 'fraud', 'deceased', 'other'] },
          note: { type: 'string' },
          at: { type: 'string', format: 'date-time' },
          by: { type: 'string' },
        },
      },

      interest: {
        type: 'object',
        title: 'Interest',
        collapsible: true,
        properties: {
          rateBps: { type: 'integer', minimum: 0, description: 'This account’s rate, when it differs from the product.' },
          accrued: { type: 'number', readOnly: true, default: 0, description: 'Earned and not yet paid, in cents (may carry a fraction until paid).' },
          accruedThrough: { type: 'string', format: 'date', readOnly: true },
          paidYearToDate: { ...cents('Interest paid this calendar year (for the 1099-INT).'), readOnly: true },
        },
      },
      term: {
        type: 'object',
        title: 'Term',
        collapsible: true,
        properties: {
          startsOn: { type: 'string', format: 'date' },
          maturesOn: { type: 'string', format: 'date' },
        },
      },
      overdraft: {
        type: 'object',
        collapsible: true,
        properties: {
          limit: cents('This account’s overdraft limit, when it differs from the product.', { minimum: 0 }),
          optedIn: { type: 'boolean', default: false, description: 'The holder agreed to card and ATM overdrafts.' },
        },
      },
      limits: BankingLimitsField(),

      statementDay: { type: 'integer', minimum: 1, maximum: 28, default: 1, description: 'Day of the month the statement period ends.' },
      openedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'dates' },
      lastActivityAt: { type: 'string', format: 'date-time', readOnly: true, group: 'dates' },
      closedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'dates' },
      closeReason: { type: 'string', enum: ['customer_request', 'bank_decision', 'dormant_escheat', 'deceased', 'fraud', 'other'] },
    },
    required: ['holderType'],
  } as const;
};

const s = BankingAccountSchema();
export type BankingAccountModel = FromSchema<typeof s>;

registerCollection('Banking Account', DataType.banking_account, BankingAccountSchema());
