import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef } from './_banking-fields';

/** Bank-scoped USD money request. Access is through ownership-checked banking adapters only. */
export const BankingMoneyRequestSchema = () => ({
  type: 'object',
  properties: {
    requester: bankingRef(DataType.customer, 'email'), receivingAccount: bankingRef(DataType.banking_account, 'accountNumber'), receivingRevision: { type: 'string' }, payer: bankingRef(DataType.customer, 'email'),
    amount: { type: 'integer', minimum: 1 }, currency: { type: 'string', enum: ['USD'] }, memo: { type: 'string', maxLength: 200 },
    status: { type: 'string', enum: ['open', 'processing', 'paid', 'declined', 'cancelled'] }, expiresAt: { type: 'string', format: 'date-time' }, revision: { type: 'string' },
    shareTokenHash: { type: 'string', hidden: true, readOnly: true },
    payment: { type: 'object', hidden: true, readOnly: true, properties: { key: { type: 'string' }, payer: bankingRef(DataType.customer, 'email'), from: bankingRef(DataType.banking_account, 'accountNumber'), amount: { type: 'integer', minimum: 1 }, claimedAt: { type: 'string', format: 'date-time' }, transaction: bankingRef(DataType.banking_transaction, 'reference') } },
    paidAt: { type: 'string', format: 'date-time', readOnly: true },
  },
  required: ['requester', 'receivingAccount', 'receivingRevision', 'amount', 'currency', 'status', 'expiresAt', 'revision'],
} as const);
const s = BankingMoneyRequestSchema();
export type BankingMoneyRequestModel = FromSchema<typeof s>;
registerCollection('Banking Money Request', DataType.banking_money_request, BankingMoneyRequestSchema());
