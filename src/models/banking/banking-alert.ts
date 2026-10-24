import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef } from './_banking-fields';

/**
 * Something monitoring found: a rule matched, or a customer's sanctions screening hit. A
 * reviewer works it to a disposition — closed as nothing, or escalated into a case.
 */
export const BankingAlertSchema = () => {
  return {
    type: 'object',
    properties: {
      rule: bankingRef(DataType.banking_rule, 'title'),
      check: { type: 'string', readOnly: true, description: 'The rule’s check when it fired, or sanctions for a screening hit.' },
      summary: { type: 'string', readOnly: true, description: 'What was found, with the numbers ("6 deposits of $9,500–$9,900 in 3 days").' },
      facts: { type: 'object', readOnly: true, description: 'The figures the check computed.' },
      severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
      score: { type: 'integer', minimum: 0, maximum: 100 },
      test: { type: 'boolean', readOnly: true, description: 'Raised by a rule in testing — for tuning, not for review.' },
      customer: bankingRef(DataType.customer, 'email'),
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      transactions: { type: 'array', items: bankingRef(DataType.banking_transaction, 'reference') },
      actionTaken: { type: 'string', enum: ['none', 'held', 'blocked'], readOnly: true },
      status: { type: 'string', enum: ['open', 'in_review', 'closed'], default: 'open' },
      disposition: { type: 'string', enum: ['no_issue', 'resolved', 'escalated'] },
      reason: {
        type: 'string',
        enum: ['false_positive', 'true_positive', 'expected_activity', 'duplicate', 'insufficient_information', 'other'],
        description: 'Why it was closed: false_positive (the rule was wrong), true_positive (real, handled without a case), expected_activity (matches what the customer told us), duplicate, insufficient_information.',
      },
      case: bankingRef(DataType.banking_case, 'number'),
      assignedTo: { type: 'string', description: 'The reviewer’s user sk.' },
      note: { type: 'string' },
      closedAt: { type: 'string', format: 'date-time', readOnly: true },
      closedBy: { type: 'string', readOnly: true },
    },
  } as const;
};

const s = BankingAlertSchema();
export type BankingAlertModel = FromSchema<typeof s>;

registerCollection('Banking Alert', DataType.banking_alert, BankingAlertSchema());
