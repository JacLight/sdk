import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BankingDenominationsField, bankingRef, cents } from './_banking-fields';

/**
 * A teller's day on one till: opened with a count, every cash transaction posted against it,
 * balanced with a blind count (the teller counts before seeing what the system expects), and
 * closed. A difference posts to the cash over/short book; one past the tolerance needs a head
 * teller's sign-off.
 */
export const BankingTellerSessionSchema = () => {
  return {
    type: 'object',
    properties: {
      number: { type: 'string', unique: true, readOnly: true, transform: ['random-string::8', 'uppercase'] },
      drawer: bankingRef(DataType.banking_drawer, 'title'),
      teller: { type: 'string', readOnly: true, description: 'Email of the teller.' },
      location: bankingRef(DataType.location, 'name'),
      businessDate: { type: 'string', format: 'date', readOnly: true },
      status: { type: 'string', enum: ['open', 'balancing', 'closed'], default: 'open', readOnly: true },
      openedAt: { type: 'string', format: 'date-time', readOnly: true },
      opening: {
        type: 'object',
        title: 'Opening count',
        properties: {
          counted: BankingDenominationsField(),
          total: { ...cents('Cash counted at opening.'), readOnly: true },
          expected: { ...cents('What the till held at its last close.'), readOnly: true },
          difference: { type: 'integer', readOnly: true, description: 'counted − expected, in cents.' },
          approval: bankingRef(DataType.banking_approval, 'summary', 'The supervisor’s override for an opening difference past the tolerance.'),
        },
      },
      totals: {
        type: 'object',
        readOnly: true,
        properties: {
          cashIn: cents('Currency taken in this session.'),
          cashOut: cents('Currency paid out this session.'),
          bought: cents('Bought from the vault.'),
          sold: cents('Sold to the vault.'),
          transactions: { type: 'integer', minimum: 0 },
        },
      },
      closing: {
        type: 'object',
        title: 'Balancing',
        properties: {
          counted: BankingDenominationsField(),
          total: { ...cents('Cash counted.'), readOnly: true },
          expected: { ...cents('What the ledger says the till holds.'), readOnly: true },
          difference: { type: 'integer', readOnly: true, description: 'counted − expected, in cents: above 0 is over, below 0 short.' },
          overShortTransaction: bankingRef(DataType.banking_transaction, 'reference'),
          signedOffBy: { type: 'string', description: 'Head teller who signed off a difference past the tolerance.' },
          approval: bankingRef(DataType.banking_approval, 'summary', 'The sign-off asked for, while the session waits on it.'),
          note: { type: 'string' },
        },
      },
      closedAt: { type: 'string', format: 'date-time', readOnly: true },
    },
    required: ['drawer'],
  } as const;
};

const s = BankingTellerSessionSchema();
export type BankingTellerSessionModel = FromSchema<typeof s>;

registerCollection('Banking Teller Session', DataType.banking_teller_session, BankingTellerSessionSchema());
