import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * A booked loan. Its balance lives in the ledger on its own `banking_account` (kind loan,
 * debit-normal: what the borrower owes), so disbursements, payments, interest, fees and a
 * charge-off are ordinary postings. This record holds the terms it was booked on, the schedule,
 * the balance by component, and where it stands: days past due counted from the oldest unpaid
 * due date, the delinquency bucket, and accruing or nonaccrual (from 90 days past due).
 */
export const BankingLoanSchema = () => {
  return {
    type: 'object',
    properties: {
      // The currency the amounts are stored in; the server fills the org base currency when empty.
      currency: { type: 'string', title: 'Currency' },
      number: { type: 'string', unique: true, readOnly: true, transform: ['random-string::10', 'uppercase'] },
      application: bankingRef(DataType.banking_loan_application, 'number'),
      product: bankingRef(DataType.banking_loan_product, 'title'),
      account: bankingRef(DataType.banking_account, 'accountNumber', 'The loan’s ledger account (kind loan).'),
      linkedAccount: bankingRef(DataType.banking_account, 'accountNumber', 'The deposit account it pays out to and takes autopay from.'),
      borrowers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            customer: bankingRef(DataType.customer, 'email'),
            role: { type: 'string', enum: ['borrower', 'co_borrower', 'guarantor', 'cosigner'] },
          },
          required: ['customer', 'role'],
        },
      },
      status: {
        type: 'string',
        enum: ['booked', 'active', 'arrears', 'paid_off', 'charged_off', 'closed'],
        default: 'booked',
        description: 'booked: not yet disbursed. arrears: past due.',
      },
      terms: {
        type: 'object',
        title: 'Terms',
        readOnly: true,
        description: 'As approved and booked.',
        properties: {
          principal: cents('Amount lent.'),
          rateBps: { type: 'integer', minimum: 0 },
          aprBps: { type: 'integer', minimum: 0 },
          dayCount: { type: 'string', enum: ['actual_365', 'actual_360', '30_360'] },
          schedule: { type: 'string', enum: ['level_payment', 'equal_principal', 'interest_only', 'balloon'] },
          frequency: { type: 'string', enum: ['monthly', 'biweekly', 'weekly'] },
          termMonths: { type: 'integer', minimum: 1 },
          amortizationMonths: { type: 'integer', minimum: 1, description: 'Balloon total amortization term, including elapsed payments.' },
          paymentAmount: cents('Each regular payment.'),
          firstPaymentDate: { type: 'string', format: 'date' },
          maturityDate: { type: 'string', format: 'date' },
          graceDays: { type: 'integer', minimum: 0 },
          lateFee: {
            type: 'object',
            properties: { amount: cents('Flat late fee.', { minimum: 0 }), percentBps: { type: 'integer', minimum: 0 }, maximum: cents('Cap.', { minimum: 0 }) },
          },
          allocationOrder: { type: 'array', items: { type: 'string', enum: ['interest', 'principal', 'fees', 'penalties'] } },
          overpayment: { type: 'string', enum: ['principal', 'paid_ahead'] },
          originationFee: cents('Origination fee.', { minimum: 0 }),
        },
      },
      installments: {
        type: 'array',
        title: 'Schedule',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            number: { type: 'integer', minimum: 1 },
            dueDate: { type: 'string', format: 'date' },
            principal: cents('Principal due.'),
            interest: cents('Interest due.'),
            fees: cents('Fees due.'),
            paidPrincipal: cents('Principal paid.'),
            paidInterest: cents('Interest paid.'),
            paidFees: cents('Fees paid.'),
            paidAt: { type: 'string', format: 'date-time' },
            lateFeeCharged: { type: 'boolean' },
            lateFee: cents('Late fee charged on it.'),
            lateFeeWaived: { type: 'boolean' },
            status: { type: 'string', enum: ['due', 'partial', 'paid', 'late', 'waived'], default: 'due' },
          },
        },
      },
      balances: {
        type: 'object',
        readOnly: true,
        properties: {
          principal: cents('Principal owed.'),
          interest: cents('Accrued interest not yet paid.'),
          fees: cents('Fees owed.'),
          penalties: cents('Penalties owed.'),
          unapplied: cents('Paid in and not yet applied.'),
        },
      },
      accrual: {
        type: 'object',
        readOnly: true,
        properties: {
          accrued: { type: 'number', description: 'Interest accrued, in cents (may carry a fraction until it posts).' },
          accruedThrough: { type: 'string', format: 'date' },
          dayBoundaryVersion: { type: 'integer', enum: [2], readOnly: true, description: 'New-loan value-day accrual convention; absent on legacy loans.' },
          segmentStart: { type: 'string', format: 'date', readOnly: true },
          segmentBaseAccrued: { type: 'number', minimum: 0, readOnly: true },
          segmentPostedInterest: { type: 'integer', minimum: 0, readOnly: true },
        },
      },
      nextDue: {
        type: 'object',
        readOnly: true,
        properties: { date: { type: 'string', format: 'date' }, amount: cents('Due on that date.') },
      },
      dpd: { type: 'integer', minimum: 0, readOnly: true, default: 0, description: 'Days past due, from the oldest unpaid due date.' },
      bucket: { type: 'string', enum: ['current', '1_29', '30_59', '60_89', '90_119', '120_plus'], default: 'current', readOnly: true },
      accrualStatus: { type: 'string', enum: ['accruing', 'nonaccrual'], default: 'accruing', readOnly: true },
      nonaccrualAt: { type: 'string', format: 'date', readOnly: true },
      flags: {
        type: 'array',
        title: 'Flags',
        items: {
          type: 'object',
          properties: {
            flag: { type: 'string', enum: ['bankruptcy', 'scra', 'deceased', 'litigation', 'cease_contact', 'attorney_represented', 'fraud'] },
            since: { type: 'string', format: 'date' },
            note: { type: 'string' },
            by: { type: 'string' },
          },
          required: ['flag'],
        },
        description: 'bankruptcy stops all collection; scra caps the rate at 6% back to service start.',
      },
      officer: { type: 'string', description: 'Email of the loan officer.' },
      location: bankingRef(DataType.location, 'name'),
      riskGrade: { type: 'string' },
      autopay: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        properties: {
          enabled: { type: 'boolean', default: false }, account: bankingRef(DataType.banking_account, 'accountNumber'),
          id: { type: 'string' }, status: { type: 'string', enum: ['off', 'preparing', 'awaiting_agreement', 'review_preparing', 'consented', 'awaiting_review', 'active', 'paused', 'revoked', 'completed'] },
          snapshot: { type: 'object', hidden: true, properties: {
            instructionId: { type: 'string' }, loan: { type: 'string' }, customer: { type: 'string' }, email: { type: 'string' }, fundingAccount: { type: 'string' },
            policyHash: { type: 'string' }, policyVersion: { type: 'string' }, form: { type: 'string' }, formHash: { type: 'string' }, contractHash: { type: 'string' },
            amount: { type: 'string', enum: ['scheduled_remaining'] }, date: { type: 'string', enum: ['calendar_due_date'] }, failure: { type: 'string', enum: ['pause'] }, maximum: { type: 'integer', minimum: 1 }, startsOn: { type: 'string', format: 'date' },
          } }, snapshotHash: { type: 'string', hidden: true }, texts: { type: 'object', hidden: true, additionalProperties: { type: 'string' } },
          envelope: { type: 'string' }, signedHash: { type: 'string', hidden: true }, approvalId: { type: 'string' }, reason: { type: 'string' }, approvedBy: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' }, activatedAt: { type: 'string', format: 'date-time' }, revokedAt: { type: 'string', format: 'date-time' },
          attempt: { type: 'object', properties: { date: { type: 'string', format: 'date' }, amount: { type: 'integer', minimum: 1 }, key: { type: 'string', hidden: true }, status: { type: 'string' }, transaction: { type: 'string' } } },
        },
      },
      pledge: bankingRef(DataType.banking_hold, 'reason', 'Deposit-secured: the hold on the pledged account, released when it is paid off.'),
      scra: {
        type: 'object',
        title: 'SCRA',
        properties: {
          serviceStart: { type: 'string', format: 'date' },
          serviceEnd: { type: 'string', format: 'date' },
          requestedAt: { type: 'string', format: 'date' },
          rateBps: { type: 'integer', description: 'The capped rate while it applies.' },
          creditedInterest: cents('Interest above the cap given back.'),
        },
      },
      payoffQuotes: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            goodThrough: { type: 'string', format: 'date' },
            amount: cents('Payoff.'),
            perDiem: { type: 'number', description: 'Interest per day after the good-through date, in cents.' },
            issuedTo: { type: 'string' },
            issuedBy: { type: 'string' },
            issuedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      modifications: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            at: { type: 'string', format: 'date-time' },
            reason: { type: 'string' },
            financialDifficulty: { type: 'boolean' },
            before: { type: 'object' },
            after: { type: 'object' },
            approvedBy: { type: 'string' },
          },
        },
      },
      chargeOffCandidate: { type: 'boolean', readOnly: true, description: 'Past the charge-off days (FFIEC retail policy) — recommend it.' },
      recovered: { ...cents('Recovered after charge-off.'), readOnly: true },
      lastEndOfDay: { type: 'string', format: 'date', readOnly: true },
      appliedTxns: { type: 'array', items: { type: 'string' }, readOnly: true, hidden: true, description: 'Transactions already written onto this record (so a retry never applies one twice).' },
      bookedAt: { type: 'string', format: 'date-time', readOnly: true },
      disbursedAt: { type: 'string', format: 'date-time', readOnly: true },
      paidOffAt: { type: 'string', format: 'date-time', readOnly: true },
      chargedOffAt: { type: 'string', format: 'date-time', readOnly: true },
      chargeOffAmount: { ...cents('Balance charged off.'), readOnly: true },
      closedAt: { type: 'string', format: 'date-time', readOnly: true },
    },
  } as const;
};

const s = BankingLoanSchema();
export type BankingLoanModel = FromSchema<typeof s>;

registerCollection('Banking Loan', DataType.banking_loan, BankingLoanSchema());
