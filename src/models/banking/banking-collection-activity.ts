import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * One thing a collector did on a past-due loan: a call, a letter, a text, a visit, a promise to
 * pay or a payment arrangement. Calls are what the contact limits count (7 in 7 days per debt,
 * 8am–9pm in the borrower's time, Reg F), so the server keeps the borrower's local time with it.
 */
export const BankingCollectionActivitySchema = () => {
  return {
    type: 'object',
    properties: {
      loan: bankingRef(DataType.banking_loan, 'number'),
      customer: bankingRef(DataType.customer, 'email'),
      kind: { type: 'string', enum: ['call', 'letter', 'sms', 'email', 'visit', 'promise', 'arrangement', 'note'] },
      direction: { type: 'string', enum: ['outbound', 'inbound'], default: 'outbound' },
      outcome: {
        type: 'string',
        enum: ['right_party_contact', 'wrong_party', 'no_answer', 'left_message', 'refused', 'promise_made', 'payment_made', 'disputed', 'bankruptcy_reported', 'deceased_reported', 'cease_requested'],
      },
      rightPartyContact: { type: 'boolean', readOnly: true },
      at: { type: 'string', format: 'date-time', readOnly: true },
      by: { type: 'string', readOnly: true, description: 'Email of the collector.' },
      localTime: { type: 'string', readOnly: true, description: 'The borrower’s local time when it happened (HH:mm).' },
      timezone: { type: 'string', readOnly: true },
      note: { type: 'string', 'x-control-variant': 'textarea' },
      promise: {
        type: 'object',
        title: 'Promise to pay',
        properties: {
          amount: cents('Promised.', { minimum: 1 }),
          dueDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['pending', 'kept', 'broken'], default: 'pending' },
          keptBy: bankingRef(DataType.banking_transaction, 'reference', 'The payment that kept it.'),
        },
      },
      arrangement: {
        type: 'object',
        title: 'Payment arrangement',
        properties: {
          installments: {
            type: 'array',
            items: { type: 'object', properties: { dueDate: { type: 'string', format: 'date' }, amount: cents('Due.', { minimum: 1 }) } },
          },
          status: { type: 'string', enum: ['active', 'completed', 'broken'], default: 'active' },
        },
      },
      nextActionAt: { type: 'string', format: 'date-time' },
    },
    required: ['loan', 'kind'],
  } as const;
};

const s = BankingCollectionActivitySchema();
export type BankingCollectionActivityModel = FromSchema<typeof s>;

registerCollection('Banking Collection Activity', DataType.banking_collection_activity, BankingCollectionActivitySchema());
