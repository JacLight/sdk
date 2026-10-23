import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * One line of the bank's ledger. Every posted `banking_transaction` writes two or more, and the
 * debits equal the credits. Deposit accounts are what the bank owes, so a credit raises their
 * balance and a debit lowers it. Lines are written once and never changed.
 */
export const BankingEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      transaction: bankingRef(DataType.banking_transaction, 'reference'),
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      side: { type: 'string', enum: ['debit', 'credit'] },
      amount: { ...cents('Always positive.'), minimum: 1 },
      currency: { type: 'string', default: 'USD' },
      balanceAfter: cents('The account’s posted balance once this line applied.'),
      effectiveDate: { type: 'string', format: 'date' },
      postedAt: { type: 'string', format: 'date-time' },
    },
    required: ['transaction', 'account', 'side', 'amount'],
  } as const;
};

const s = BankingEntrySchema();
export type BankingEntryModel = FromSchema<typeof s>;

registerCollection('Banking Entry', DataType.banking_entry, BankingEntrySchema());
