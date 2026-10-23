import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { BankingDenominationsField, bankingRef, cents } from './_banking-fields';

/**
 * A cash location at a branch: a teller's till or the branch vault. Its cash is a ledger book
 * (`book`, a bank account with systemCode teller_cash or vault_cash), so every buy, sell,
 * deposit and withdrawal moves it through the ledger; `denominations` is the count that goes
 * with it. A till is used by one teller at a time — the open `banking_teller_session`.
 */
export const BankingDrawerSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', pattern: '^[a-zA-Z_\\-0-9]*$', unique: true, transform: ['uri'], title: 'ID', group: 'name' },
      title: { type: 'string', description: 'What people call it ("Till 3", "Main vault").', group: 'name' },
      kind: { type: 'string', enum: ['till', 'vault'], default: 'till', group: 'name' },
      location: bankingRef(DataType.location, 'name', 'The branch it is at.'),
      assignee: { type: 'string', description: 'Email of the teller the till is assigned to (or the vault custodian).' },
      status: {
        type: 'string',
        enum: ['available', 'in_use', 'retired'],
        default: 'available',
        readOnly: true,
        description: 'in_use while a teller session is open on it.',
      },
      book: bankingRef(DataType.banking_account, 'accountNumber', 'The ledger book holding this drawer’s cash.'),
      denominations: BankingDenominationsField('What is in it now, by denomination.'),
      limits: {
        type: 'object',
        title: 'Limits',
        collapsible: true,
        description: 'Below the minimum the teller buys cash from the vault; above the maximum they sell it back. Empty: Banking Config’s drawer limits.',
        properties: {
          minimum: cents('Least cash it should hold.', { minimum: 0 }),
          maximum: cents('Most cash it may hold.', { minimum: 0 }),
        },
      },
      session: bankingRef(DataType.banking_teller_session, 'number', 'The open session, while in use.'),
      stock: {
        type: 'array',
        title: 'Official check and money order stock',
        collapsible: true,
        description: 'Blank instruments loaded into this drawer, as serial ranges. A sale takes the next serial of its kind.',
        items: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['cashiers_check', 'teller_check', 'bank_draft', 'money_order', 'travelers_check'] },
            prefix: { type: 'string', description: 'Letters printed before the number, if any.' },
            next: { type: 'integer', minimum: 0, description: 'The next serial to issue.' },
            last: { type: 'integer', minimum: 0, description: 'The last serial in the range.' },
            loadedAt: { type: 'string', format: 'date-time', readOnly: true },
            loadedBy: { type: 'string', readOnly: true },
          },
          required: ['kind', 'next', 'last'],
        },
      },
      lastCountedAt: { type: 'string', format: 'date-time', readOnly: true },
      lastBalancedAt: { type: 'string', format: 'date-time', readOnly: true },
    },
    required: ['name', 'kind'],
  } as const;
};

const s = BankingDrawerSchema();
export type BankingDrawerModel = FromSchema<typeof s>;

registerCollection('Banking Drawer', DataType.banking_drawer, BankingDrawerSchema());
