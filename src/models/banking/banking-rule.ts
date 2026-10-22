import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BANKING_RAILS, bankingRef, cents } from './_banking-fields';

/**
 * A monitoring rule: a pattern to watch for and what to do when money matches it.
 *
 * Each `check` is one parameterized test the monitoring service runs on every transaction (and,
 * for `dormant_reactivated` and the windows, on the account's recent history). Compliance staff
 * add, tune and pause rules; nothing about a rule is in code but the checks themselves.
 *   alert  record an alert; the money moves
 *   hold   the transaction waits (status in_review) until a person clears or rejects it
 *   block  the transaction is refused
 */
export const BankingRuleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['uri'],
        title: 'ID',
      },
      title: { type: 'string' },
      description: { type: 'string', 'x-control-variant': 'textarea', description: 'What this catches and why, for the reviewer.' },
      status: {
        type: 'string',
        enum: ['active', 'testing', 'paused'],
        default: 'testing',
        description: 'testing records alerts marked as tests and never holds or blocks — for tuning a rule before it acts.',
      },
      check: {
        type: 'string',
        enum: [
          'amount_over',
          'count_over',
          'total_over',
          'structuring',
          'rapid_movement',
          'new_counterparty_amount',
          'dormant_reactivated',
          'round_amounts',
          'country',
          'merchant_category',
          'sanctions',
        ],
        description:
          'amount_over: one transaction over `amount`. count_over / total_over: more than `count` transactions, or more than `amount` in total, within `windowHours`. structuring: `count` or more transactions each just under `amount` (within `percent` of it) within `windowHours`. rapid_movement: at least `percent` of money in goes out within `windowHours`. new_counterparty_amount: over `amount` to a payee added less than `days` ago. dormant_reactivated: over `amount` on an account with no activity for `days`. round_amounts: `count` or more whole-hundred amounts within `windowHours`. country / merchant_category: card or wire to one of `values`. sanctions: the other side matches the sanctions lists.',
      },
      params: {
        type: 'object',
        properties: {
          amount: cents('The amount the check compares against.', { minimum: 0 }),
          count: { type: 'integer', minimum: 1 },
          windowHours: { type: 'integer', minimum: 1 },
          percent: { type: 'number', minimum: 0, maximum: 100 },
          days: { type: 'integer', minimum: 1 },
          values: { type: 'array', items: { type: 'string' }, description: 'Country codes or merchant category codes.' },
        },
      },
      appliesTo: {
        type: 'object',
        description: 'Empty = every transaction.',
        properties: {
          rails: { type: 'array', items: { type: 'string', enum: [...BANKING_RAILS] } },
          directions: { type: 'array', items: { type: 'string', enum: ['in', 'out'] } },
          holderTypes: { type: 'array', items: { type: 'string', enum: ['individual', 'business'] } },
          products: { type: 'array', items: bankingRef(DataType.banking_product, 'title') },
        },
      },
      action: { type: 'string', enum: ['alert', 'hold', 'block'], default: 'alert' },
      severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
      score: { type: 'integer', minimum: 0, maximum: 100, default: 50, description: 'Added to the alert’s risk score.' },
    },
    required: ['name', 'title', 'check'],
  } as const;
};

const s = BankingRuleSchema();
export type BankingRuleModel = FromSchema<typeof s>;

registerCollection('Banking Rule', DataType.banking_rule, BankingRuleSchema());
