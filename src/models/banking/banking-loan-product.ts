import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { cents } from './_banking-fields';
import { DataType } from '../../types';

/**
 * A loan product the bank offers — "Share-secured loan", "Personal loan", "Auto loan". It holds
 * the terms every application on it starts from: amounts and terms allowed, how the rate is set,
 * how interest is counted, the schedule, fees, how a payment is applied, and who may approve how
 * much. A booked loan copies the terms it was approved on, so a later change here doesn't move it.
 */
export const BankingLoanProductSchema = () => {
  return {
    type: 'object',
    properties: {
      // The currency the amounts are stored in; the server fills the org base currency when empty.
      currency: { type: 'string', title: 'Currency' },
      name: { type: 'string', pattern: '^[a-zA-Z_\\-0-9]*$', unique: true, transform: ['uri'], title: 'ID', group: 'name' },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      type: { type: 'string', enum: ['installment', 'line_of_credit'], default: 'installment', group: 'kind' },
      category: { type: 'string', enum: ['deposit_secured', 'personal', 'auto', 'business', 'other'], group: 'kind' },
      holderType: { type: 'string', enum: ['individual', 'business', 'any'], default: 'individual', group: 'kind' },
      consumer: { type: 'boolean', default: true, description: 'Consumer credit: Reg Z disclosures, Reg B adverse action, MLA check.', group: 'kind' },
      secured: { type: 'boolean', default: false, group: 'kind' },
      collateralTypes: { type: 'array', items: { type: 'string', enum: ['deposit', 'vehicle', 'real_estate', 'equipment', 'other'] } },
      status: { type: 'string', enum: ['draft', 'active', 'retired'], default: 'draft', description: 'Only an active product takes new applications.', group: 'kind' },

      amount: {
        type: 'object',
        title: 'Amounts and terms',
        properties: {
          minimum: cents('Smallest loan.', { minimum: 0 }),
          maximum: cents('Largest loan.', { minimum: 0 }),
          minTermMonths: { type: 'integer', minimum: 1 },
          maxTermMonths: { type: 'integer', minimum: 1 },
        },
      },
      rate: {
        type: 'object',
        title: 'Rate',
        collapsible: true,
        properties: {
          model: { type: 'string', enum: ['fixed', 'variable'], default: 'fixed' },
          rateBps: { type: 'integer', minimum: 0, description: 'Base annual rate in basis points.' },
          minRateBps: { type: 'integer', minimum: 0, description: 'Lowest rate pricing may set.' },
          maxRateBps: { type: 'integer', minimum: 0, description: 'Highest rate pricing may set (MLA caps consumer loans to covered borrowers at 3600 MAPR).' },
          index: { type: 'string', description: 'Variable: the index the rate follows (e.g. prime).' },
          marginBps: { type: 'integer', description: 'Variable: added to the index.' },
          floorBps: { type: 'integer', minimum: 0 },
          capBps: { type: 'integer', minimum: 0 },
        },
      },
      dayCount: { type: 'string', enum: ['actual_365', 'actual_360', '30_360'], default: 'actual_365' },
      schedule: { type: 'string', enum: ['level_payment', 'equal_principal', 'interest_only', 'balloon'], default: 'level_payment' },
      amortizationMonths: { type: 'integer', minimum: 1, description: 'Balloon only: explicit total amortization term in months, longer than the contractual loan term.' },
      frequency: { type: 'string', enum: ['monthly', 'biweekly', 'weekly'], default: 'monthly' },
      graceDays: { type: 'integer', minimum: 0, description: 'Days after a due date before the late fee. Empty: Banking Config lending.lateFeeGraceDays.' },
      fees: {
        type: 'array',
        title: 'Fees',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', pattern: '^[a-z_0-9]*$' },
            title: { type: 'string' },
            trigger: { type: 'string', enum: ['origination', 'late', 'nsf', 'documentation', 'payoff_letter', 'extension'] },
            amount: cents('Flat fee.', { minimum: 0 }),
            percentBps: { type: 'integer', minimum: 0, description: 'Share of the loan (origination) or of the installment (late), in basis points.' },
            maximum: cents('Most it can be (a late fee capped by state law).', { minimum: 0 }),
            financed: { type: 'boolean', default: false, description: 'Added to the amount borrowed rather than paid at closing.' },
          },
          required: ['code', 'trigger'],
        },
      },
      allocationOrder: {
        type: 'array',
        items: { type: 'string', enum: ['interest', 'principal', 'fees', 'penalties'] },
        default: ['interest', 'principal', 'fees', 'penalties'],
        description: 'The order a payment is applied in, as the note says. A late fee is never taken first if that leaves the installment short (no pyramiding).',
      },
      overpayment: { type: 'string', enum: ['principal', 'paid_ahead'], default: 'principal', description: 'Money beyond the installment: cuts principal, or pays the next installment ahead.' },
      eligibility: {
        type: 'object',
        title: 'Underwriting limits',
        collapsible: true,
        properties: {
          minScore: { type: 'integer', minimum: 300, maximum: 850 },
          maxDtiBps: { type: 'integer', minimum: 0, description: 'Most debt-to-income, in basis points (4300 = 43%).' },
          maxLtvBps: { type: 'integer', minimum: 0, description: 'Most loan-to-value, in basis points.' },
          minDscrX100: { type: 'integer', minimum: 0, description: 'Least debt service coverage, ×100 (125 = 1.25×).' },
        },
      },
      authority: {
        type: 'array',
        title: 'Approval authority',
        description: 'Who may approve how much. Above every limit, the loan committee (an Owner) decides.',
        items: {
          type: 'object',
          properties: {
            role: { type: 'string' },
            maxAmount: cents('Largest loan this role may approve.', { minimum: 0 }),
          },
          required: ['role'],
        },
      },
      disclosure: { type: 'string', description: 'Link to the note and disclosure templates.' },
    },
    required: ['name', 'title', 'type'],
  } as const;
};

const s = BankingLoanProductSchema();
export type BankingLoanProductModel = FromSchema<typeof s>;

registerCollection('Banking Loan Product', DataType.banking_loan_product, BankingLoanProductSchema());
