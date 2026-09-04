import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const LedgerEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      // Entry Identification
      entryId: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 12,
        maxLength: 16,
        unique: true,
        transform: ['random-string::12'],
        group: 'identification',
      },

      // Journal Entry Link
      journalEntryId: {
        type: 'string',
        description: 'Links to parent journal entry',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.journal_entry,
          value: 'sk',
          label: ['entryNumber', 'description'],
        },
        group: 'journal',
      },

      // Ledger Account
      ledgerAccountId: {
        type: 'string',
        description: 'The ledger account affected',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.ledger_account,
          value: 'sk',
          label: ['accountCode', 'accountName'],
        },
        group: 'account',
      },
      ledgerAccountCode: {
        type: 'string',
        description: 'Account code for display',
        group: 'account',
      },
      ledgerAccountName: {
        type: 'string',
        description: 'Account name for display',
        group: 'account',
      },
      ledgerAccountType: {
        type: 'string',
        enum: ['asset', 'liability', 'equity', 'revenue', 'expense'],
        group: 'account',
      },

      // Debit/Credit (only one should be non-zero)
      debit: {
        type: 'number',
        default: 0,
        minimum: 0,
        description: 'Debit amount in cents',
        group: 'amount',
      },
      credit: {
        type: 'number',
        default: 0,
        minimum: 0,
        description: 'Credit amount in cents',
        group: 'amount',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },

      // Running Balance
      balanceBefore: {
        type: 'number',
        description: 'Account balance before this entry',
        group: 'balance',
      },
      balanceAfter: {
        type: 'number',
        description: 'Account balance after this entry',
        group: 'balance',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'posted', 'reversed'],
        default: 'pending',
        group: 'status',
      },

      // Line description
      description: {
        type: 'string',
        description: 'Line item description',
        group: 'info',
      },

      // Reference
      referenceType: {
        type: 'string',
        enum: ['bank_transfer', 'card_transaction', 'fee', 'interest', 'adjustment', 'manual'],
        group: 'reference',
      },
      referenceId: {
        type: 'string',
        description: 'ID of related entity',
        group: 'reference',
      },

      // Metadata
      postedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      reversedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      reversalEntryId: {
        type: 'string',
        description: 'ID of reversal entry if reversed',
        group: 'dates',
      },
    },
    required: ['journalEntryId', 'ledgerAccountId'],
  } as const;
};

const sc = LedgerEntrySchema();
export type LedgerEntryModel = FromSchema<typeof sc>;

registerCollection('Ledger Entry', DataType.ledger_entry, LedgerEntrySchema());
