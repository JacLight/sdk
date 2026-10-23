import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';
import { FileInfoSchema } from '../file-info';

/** An account's statement for one period, written when the period closes. */
export const BankingStatementSchema = () => {
  return {
    type: 'object',
    properties: {
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      periodStart: { type: 'string', format: 'date' },
      periodEnd: { type: 'string', format: 'date' },
      openingBalance: cents('Posted balance when the period began.'),
      closingBalance: cents('Posted balance when it ended.'),
      credits: cents('Money in.'),
      debits: cents('Money out.'),
      creditCount: { type: 'integer' },
      debitCount: { type: 'integer' },
      interestPaid: cents('Interest paid in the period.'),
      feesCharged: cents('Fees charged in the period.'),
      averageDailyBalance: cents('Average of the end-of-day balances.'),
      file: FileInfoSchema(),
      status: { type: 'string', enum: ['ready', 'sent'], default: 'ready' },
      sentAt: { type: 'string', format: 'date-time' },
    },
    required: ['account', 'periodStart', 'periodEnd'],
  } as const;
};

const s = BankingStatementSchema();
export type BankingStatementModel = FromSchema<typeof s>;

registerCollection('Banking Statement', DataType.banking_statement, BankingStatementSchema());
