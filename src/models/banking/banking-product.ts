import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BankingLimitsField, cents } from './_banking-fields';

/**
 * An account product the bank offers — "Everyday Checking", "High-Yield Savings", "12-month CD".
 * It holds the terms every account opened on it starts from: interest, fees, overdraft, limits.
 * An account copies `kind` at opening and reads the rest from here, so a change to the product
 * reaches every account on it; an account carries its own value only where it differs.
 */
export const BankingProductSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['uri'],
        title: 'ID',
        group: 'name',
      },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      kind: {
        type: 'string',
        enum: ['checking', 'savings', 'money_market', 'certificate'],
        group: 'kind',
      },
      holderType: {
        type: 'string',
        enum: ['individual', 'business', 'any'],
        default: 'any',
        group: 'kind',
      },
      currency: { type: 'string', default: 'USD', group: 'kind' },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'retired'],
        default: 'draft',
        description: 'Only an active product can open new accounts. Retiring one leaves its accounts open.',
        group: 'kind',
      },

      interest: {
        type: 'object',
        title: 'Interest',
        collapsible: true,
        properties: {
          rateBps: { type: 'integer', minimum: 0, description: 'Annual rate in basis points (425 = 4.25%).' },
          tiers: {
            type: 'array',
            description: 'A different rate from a balance up. The highest tier the end-of-day balance reaches applies to all of it.',
            items: {
              type: 'object',
              properties: {
                fromBalance: cents('The balance this rate starts at.', { minimum: 0 }),
                rateBps: { type: 'integer', minimum: 0 },
              },
            },
          },
          accrual: { type: 'string', enum: ['daily'], default: 'daily' },
          payout: { type: 'string', enum: ['monthly', 'quarterly', 'at_maturity'], default: 'monthly' },
          dayCount: { type: 'string', enum: ['actual_365', 'actual_360'], default: 'actual_365' },
        },
      },

      term: {
        type: 'object',
        title: 'Term (certificates)',
        collapsible: true,
        properties: {
          months: { type: 'integer', minimum: 1 },
          earlyWithdrawalPenaltyDays: { type: 'integer', minimum: 0, description: 'Days of interest charged for taking money out before maturity.' },
          atMaturity: { type: 'string', enum: ['renew', 'hold'], default: 'renew', description: 'renew: a new term starts at the same product rate. hold: it stops earning and waits for the holder.' },
        },
      },

      minimumBalance: cents('Below this at day end, the below_minimum fee applies.', { minimum: 0 }),
      withdrawalsPerMonth: { type: 'integer', minimum: 0, description: 'Outgoing transactions allowed each statement month (savings). Empty = no limit.' },

      overdraft: {
        type: 'object',
        title: 'Overdraft',
        collapsible: true,
        properties: {
          allowed: { type: 'boolean', default: false },
          limit: cents('How far below zero the available balance may go.', { minimum: 0 }),
          optInRequired: { type: 'boolean', default: true, description: 'Card and ATM overdrafts need the holder to opt in (Reg E).' },
        },
      },

      fees: {
        type: 'array',
        title: 'Fees',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', pattern: '^[a-z_0-9]*$' },
            title: { type: 'string' },
            trigger: {
              type: 'string',
              enum: [
                'monthly',
                'below_minimum',
                'overdraft',
                'nsf',
                'wire_out',
                'wire_in',
                'ach_return',
                'rtp_out',
                'card_replacement',
                'foreign_transaction',
                'atm_out_of_network',
                'stop_payment',
                'paper_statement',
                'excess_withdrawal',
                'dormant',
              ],
            },
            amount: cents('Flat fee.', { minimum: 0 }),
            percentBps: { type: 'integer', minimum: 0, description: 'Share of the transaction, in basis points (foreign_transaction).' },
            waiveAtBalance: cents('No fee when the average daily balance for the month is at least this.', { minimum: 0 }),
            maxPerDay: { type: 'integer', minimum: 0, description: 'Most times this fee is charged in a day (overdraft, nsf).' },
          },
          required: ['code', 'trigger'],
        },
      },

      limits: BankingLimitsField(),

      cards: {
        type: 'object',
        title: 'Cards',
        collapsible: true,
        properties: {
          allowed: { type: 'boolean', default: true },
          network: { type: 'string', enum: ['visa', 'mastercard'], default: 'visa' },
          physical: { type: 'boolean', default: true },
          virtual: { type: 'boolean', default: true },
        },
      },

      disclosure: { type: 'string', description: 'Link to the account agreement and fee schedule the holder accepts at opening.' },
    },
    required: ['name', 'title', 'kind'],
  } as const;
};

const s = BankingProductSchema();
export type BankingProductModel = FromSchema<typeof s>;

registerCollection('Banking Product', DataType.banking_product, BankingProductSchema());
