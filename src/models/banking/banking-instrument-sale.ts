import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BankingIdentifiedPersonField, bankingRef, cents, BankingEscheatAssignmentField } from './_banking-fields';

/**
 * An official check (cashier's check, teller's check, bank draft) or money order the bank sold.
 * It is also the Monetary Instrument Log (31 CFR 1010.415): bought with $3,000–$10,000 in
 * currency (same-day purchases together), the buyer's details and the serial numbers are
 * required before it is issued, and kept 5 years. An official check stays a liability of the
 * bank (the official_checks book) until it is paid.
 */
export const BankingInstrumentSaleSchema = () => {
  return {
    type: 'object',
    properties: {
      escheat: BankingEscheatAssignmentField(),
      kind: { type: 'string', enum: ['cashiers_check', 'teller_check', 'bank_draft', 'money_order', 'travelers_check'] },
      serialNumber: { type: 'string', unique: true },
      amount: { ...cents('Face amount.'), minimum: 1 },
      fee: cents('Fee charged for it.', { minimum: 0 }),
      payee: { type: 'string' },
      purchaser: BankingIdentifiedPersonField('Who bought it. A non-holder also gives address, SSN or alien ID and date of birth.'),
      accountHolder: { type: 'boolean', description: 'The purchaser holds an account here.' },
      paidWith: { type: 'string', enum: ['cash', 'account', 'mixed'] },
      cashAmount: cents('Of the amount and fee, how much was currency.', { minimum: 0 }),
      account: bankingRef(DataType.banking_account, 'accountNumber', 'The account it was paid from, when not all cash.'),
      transaction: bankingRef(DataType.banking_transaction, 'reference'),
      session: bankingRef(DataType.banking_teller_session, 'number'),
      drawer: bankingRef(DataType.banking_drawer, 'title'),
      location: bankingRef(DataType.location, 'name'),
      businessDate: { type: 'string', format: 'date' },
      logged: { type: 'boolean', readOnly: true, description: 'On the Monetary Instrument Log (currency $3,000–$10,000 that day).' },
      status: { type: 'string', enum: ['issued', 'paid', 'void', 'stopped'], default: 'issued' },
      paidAt: { type: 'string', format: 'date-time', readOnly: true },
      soldBy: { type: 'string', readOnly: true },
    },
    required: ['kind', 'amount'],
  } as const;
};

const s = BankingInstrumentSaleSchema();
export type BankingInstrumentSaleModel = FromSchema<typeof s>;

registerCollection('Banking Instrument Sale', DataType.banking_instrument_sale, BankingInstrumentSaleSchema());
