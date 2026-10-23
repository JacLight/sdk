import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BANKING_RAILS, BankingDenominationsField, BankingIdentifiedPersonField, bankingRef, cents } from './_banking-fields';

/**
 * One movement of money: a transfer, an ACH, a wire, a card purchase, a fee, interest.
 *
 * It is what the customer sees on their account and what monitoring reviews. Posting writes its
 * `banking_entry` rows — always two or more that net to zero, one side on the customer's account
 * and the other on another account or one of the bank's books — and moves the balances.
 * Nothing changes a posted transaction: a correction is a new one that `reverses` it.
 */
export const BankingTransactionSchema = () => {
  return {
    type: 'object',
    properties: {
      reference: {
        type: 'string',
        pattern: '^[A-Z0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::12', 'uppercase'],
        group: 'ref',
      },
      kind: {
        type: 'string',
        enum: [
          'transfer',
          'ach',
          'wire',
          'rtp',
          'card',
          'check_deposit',
          'fee',
          'interest',
          'adjustment',
          'reversal',
          'provisional_credit',
          'cash_deposit',
          'cash_withdrawal',
          'check_cashing',
          'instrument_sale',
          'cash_movement',
          'over_short',
          'loan_disbursement',
          'loan_payment',
          'loan_interest',
          'loan_fee',
          'charge_off',
          'recovery',
        ],
        description: 'cash_movement: till ↔ vault or a shipment in or out. over_short: what a balancing found.',
        group: 'ref',
      },
      rail: { type: 'string', enum: [...BANKING_RAILS], group: 'ref' },
      direction: {
        type: 'string',
        enum: ['in', 'out'],
        description: 'Into or out of `account`. A transfer between two accounts here is `out` on the account it leaves.',
        group: 'ref',
      },
      account: bankingRef(DataType.banking_account, 'accountNumber', 'The customer account this is on.'),
      toAccount: bankingRef(DataType.banking_account, 'accountNumber', 'The other account at this bank (transfers).'),
      counterparty: bankingRef(DataType.banking_counterparty, 'name', 'The outside account (ACH, wire, RTP).'),
      counterpartyName: { type: 'string', readOnly: true, description: 'Who the other side is, as shown to the customer.' },

      amount: { ...cents('Always positive; `direction` says which way.'), minimum: 1 },
      currency: { type: 'string', default: 'USD' },
      status: {
        type: 'string',
        enum: ['pending', 'in_review', 'posted', 'returned', 'failed', 'cancelled', 'reversed'],
        default: 'pending',
        description: 'in_review: monitoring held it for a person to clear. returned: the other bank sent it back after it posted.',
        group: 'status',
      },
      failureReason: { type: 'string', description: 'Why it did not go through, in words the customer can act on.' },

      description: { type: 'string', description: 'What the statement shows.' },
      toDescription: { type: 'string', description: 'What the receiving account’s statement shows (transfers between accounts here).' },
      memo: { type: 'string', description: 'The customer’s own note.' },
      idempotencyKey: {
        type: 'string',
        description: 'The caller’s key for this request. The same key again returns the same transaction.',
      },
      initiatedBy: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: ['customer', 'staff', 'system', 'network'] },
          id: { type: 'string' },
        },
      },
      effectiveDate: { type: 'string', format: 'date', description: 'The day it counts for (ACH effective date, interest date).' },
      postedAt: { type: 'string', format: 'date-time', readOnly: true },
      returnedAt: { type: 'string', format: 'date-time', readOnly: true },

      network: {
        type: 'object',
        title: 'Network',
        collapsible: true,
        description: 'What the rail carries and sends back.',
        properties: {
          secCode: { type: 'string', enum: ['PPD', 'CCD', 'WEB', 'TEL', 'CTX'] },
          sameDay: { type: 'boolean' },
          traceNumber: { type: 'string' },
          imad: { type: 'string' },
          omad: { type: 'string' },
          returnCode: { type: 'string', description: 'R01, R10… for ACH.' },
          returnReason: { type: 'string' },
          externalId: { type: 'string', description: 'The processor’s or sponsor bank’s id.' },
          batch: { type: 'string', description: 'The outgoing file or batch it went in.' },
        },
      },

      card: {
        type: 'object',
        title: 'Card',
        collapsible: true,
        properties: {
          card: bankingRef(DataType.banking_card, 'last4'),
          authorizationCode: { type: 'string' },
          merchantName: { type: 'string' },
          merchantCategoryCode: { type: 'string' },
          merchantCity: { type: 'string' },
          merchantCountry: { type: 'string' },
          entryMode: { type: 'string', enum: ['chip', 'contactless', 'swipe', 'online', 'manual', 'atm'] },
        },
      },

      cash: {
        type: 'object',
        title: 'Cash',
        collapsible: true,
        description: 'Currency over the counter (rail cash): where and for whom, so the day’s cash-in and cash-out per person can be totalled for the CTR.',
        properties: {
          businessDate: { type: 'string', format: 'date', description: 'The BSA business day it counts in.' },
          location: bankingRef(DataType.location, 'name'),
          drawer: bankingRef(DataType.banking_drawer, 'title'),
          session: bankingRef(DataType.banking_teller_session, 'number'),
          cashIn: cents('Currency taken in.', { minimum: 0 }),
          cashOut: cents('Currency paid out.', { minimum: 0 }),
          cashType: {
            type: 'string',
            enum: ['deposit', 'withdrawal', 'loan_payment', 'check_cashed', 'exchange', 'instrument_purchase', 'wire_funded', 'buy_sell', 'shipment'],
          },
          conductor: bankingRef(DataType.customer, 'email', 'The person at the counter.'),
          onBehalfOf: { type: 'array', items: bankingRef(DataType.customer, 'email'), description: 'The people the cash is for, when not the conductor.' },
          personKeys: {
            type: 'array',
            items: { type: 'string' },
            readOnly: true,
            description: 'Everyone the cash counts toward for the CTR: cust:<sk>, biz:<EIN or account>, id:<type>:<number> for a non-customer.',
          },
          identity: BankingIdentifiedPersonField('The ID examined at the window for someone who is not a customer (check cashing, an instrument bought with cash).'),
          exempt: { type: 'boolean', readOnly: true, description: 'On a CTR-exempt account for its exempt holder: left out of the day’s totals.' },
          denominations: BankingDenominationsField(),
          toDrawer: bankingRef(DataType.banking_drawer, 'title', 'The drawer the cash went to (buy, sell, teller to teller, a shipment into the vault).'),
          requestedBy: { type: 'string', readOnly: true, description: 'Who handed the cash over.' },
          verifiedBy: { type: 'string', readOnly: true, description: 'The second person who counted and took it (dual control).' },
          shipment: {
            type: 'object',
            description: 'Cash shipped between the vault and the Federal Reserve, a correspondent or an armored carrier.',
            properties: {
              direction: { type: 'string', enum: ['in', 'out'] },
              counterparty: { type: 'string', enum: ['federal_reserve', 'correspondent', 'armored_carrier'] },
              reference: { type: 'string', description: 'The carrier’s or the Fed’s manifest number.' },
            },
          },
          items: {
            type: 'array',
            description: 'The checks in a check deposit or cashed at the window, with when each is available.',
            items: {
              type: 'object',
              properties: {
                amount: cents('The check.', { minimum: 1 }),
                itemClass: { type: 'string', enum: ['on_us', 'treasury', 'postal_money_order', 'federal_reserve_fhlb', 'state_local_government', 'cashiers_certified_teller', 'other'] },
                checkNumber: { type: 'string' },
                drawnOn: bankingRef(DataType.banking_account, 'accountNumber', 'For a check on this bank: the account it is drawn on.'),
                redeposit: { type: 'boolean' },
                availableNow: cents('Of it, available at once.', { minimum: 0 }),
                holds: {
                  type: 'array',
                  items: { type: 'object', properties: { amount: cents('Held.', { minimum: 1 }), availableOn: { type: 'string', format: 'date' }, reason: { type: 'string' } } },
                },
              },
            },
          },
          fee: cents('A fee taken at the window (check cashing for a non-customer, an official check).', { minimum: 0 }),
          override: bankingRef(DataType.banking_approval, 'summary', 'The supervisor override it went through on.'),
        },
      },

      loan: {
        type: 'object',
        title: 'Loan',
        collapsible: true,
        properties: {
          loan: bankingRef(DataType.banking_loan, 'number'),
          allocation: {
            type: 'object',
            description: 'How a payment was applied.',
            properties: {
              principal: cents('To principal.', { minimum: 0 }),
              interest: cents('To interest.', { minimum: 0 }),
              fees: cents('To fees.', { minimum: 0 }),
              penalties: cents('To penalties.', { minimum: 0 }),
              unapplied: cents('Held until a full installment is reached.', { minimum: 0 }),
            },
          },
          installment: { type: 'integer', minimum: 1, description: 'The installment a fee or payment is for.' },
        },
      },

      hold: bankingRef(DataType.banking_hold, 'reason', 'The hold keeping the money back while this is pending.'),
      reverses: bankingRef(DataType.banking_transaction, 'reference', 'The transaction this one undoes.'),
      feeFor: bankingRef(DataType.banking_transaction, 'reference', 'The transaction this fee was charged for.'),
      dispute: bankingRef(DataType.banking_dispute, 'number'),

      review: {
        type: 'object',
        title: 'Monitoring review',
        collapsible: true,
        properties: {
          alerts: { type: 'array', items: bankingRef(DataType.banking_alert, 'summary') },
          decision: { type: 'string', enum: ['cleared', 'rejected'] },
          decidedBy: { type: 'string' },
          decidedAt: { type: 'string', format: 'date-time' },
          note: { type: 'string' },
        },
      },
      metadata: { type: 'object', description: 'The caller’s own keys and values.' },
    },
    required: ['kind', 'account', 'amount', 'direction'],
  } as const;
};

const s = BankingTransactionSchema();
export type BankingTransactionModel = FromSchema<typeof s>;

registerCollection('Banking Transaction', DataType.banking_transaction, BankingTransactionSchema());
