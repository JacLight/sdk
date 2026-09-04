import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * A bank account in Business Made's books — either linked through an aggregator
 * (source 'plaid', via a bm_bank_connection) or entered by hand ('manual').
 * Separate from the retired banking-as-a-service `bank_account`: no account
 * holder / KYC, and balances are in the account's currency units (dollars),
 * matching the rest of the Business Made ledger.
 */
export const BankAccountSchema = () => {
  return {
    type: 'object',
    properties: {
      // How it got here
      source: {
        type: 'string',
        enum: ['plaid', 'manual'],
        default: 'manual',
        description: 'Linked via an aggregator, or entered by hand.',
        group: 'source',
      },
      connectionId: {
        type: 'string',
        description: 'The bm_bank_connection this account came from (for linked accounts).',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.bank_connection, value: 'sk', label: ['institution.name'] },
        group: 'source',
      },
      providerAccountId: { type: 'string', description: 'Aggregator account id (Plaid account_id).', group: 'source' },

      // Identity
      name: { type: 'string', description: 'Official / display name.', group: 'identity' },
      accountName: { type: 'string', description: 'Short name (e.g. "Operating · Checking").', group: 'identity' },
      bankName: { type: 'string', group: 'identity' },
      institution: {
        type: 'object',
        title: 'Institution',
        properties: { id: { type: 'string' }, name: { type: 'string' }, logo: { type: 'string' } },
        group: 'identity',
      },
      type: {
        type: 'string',
        enum: ['depository', 'credit', 'loan', 'investment', 'other'],
        description: 'High-level kind, from the aggregator.',
        group: 'identity',
      },
      subtype: { type: 'string', description: 'checking / savings / credit card / …', group: 'identity' },
      accountType: {
        type: 'string',
        enum: ['checking', 'savings', 'money_market', 'credit_card', 'loan', 'other'],
        default: 'checking',
        description: 'For manually-entered accounts.',
        group: 'identity',
      },

      // Numbers (masked; verified via aggregator Auth)
      mask: { type: 'string', description: 'Last few digits from the aggregator.', group: 'numbers' },
      accountNumberMask: { type: 'string', description: 'Display mask, e.g. ••••0000.', group: 'numbers' },
      accountNumber: { type: 'string', description: 'Full number (manual entry only).', group: 'numbers' },
      routingNumber: { type: 'string', description: 'ABA routing (from Auth or manual).', group: 'numbers' },
      verified: { type: 'boolean', default: false, description: 'Account + routing verified via aggregator Auth.', group: 'numbers' },

      // Balances (in the account currency — dollars, not cents)
      currency: { type: 'string', default: 'USD', group: 'balance' },
      currentBalance: { type: 'number', default: 0, description: 'Current balance in currency units.', group: 'balance' },
      availableBalance: { type: 'number', description: 'Available balance in currency units.', group: 'balance' },
      balanceAsOf: { type: 'string', format: 'date-time', description: 'When the live balance was last pulled.', group: 'balance' },

      // Books
      ledgerAccountId: {
        type: 'string',
        description: 'Linked double-entry ledger (cash) account.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.ledger_account, value: 'sk', label: ['accountCode', 'accountName'] },
        group: 'books',
      },
      glAccountCode: { type: 'string', description: 'GL account code this feeds.', group: 'books' },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'disconnected', 'closed'],
        default: 'active',
        group: 'status',
      },
    },
    required: [],
  } as const;
};

const sc = BankAccountSchema();
export type BankAccountModel = FromSchema<typeof sc>;

registerCollection('Bank Account', DataType.bank_account, BankAccountSchema());
