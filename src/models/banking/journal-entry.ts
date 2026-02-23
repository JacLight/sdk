import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const JournalEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      // Entry Identification
      entryNumber: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 10,
        maxLength: 16,
        unique: true,
        transform: ['random-string::10'],
        description: 'Unique journal entry number',
        group: 'identification',
      },

      // Entry Date
      entryDate: {
        type: 'string',
        format: 'date',
        description: 'The date this entry is recorded for',
        group: 'date',
      },
      effectiveDate: {
        type: 'string',
        format: 'date',
        description: 'When this entry takes effect (may differ from entry date)',
        group: 'date',
      },

      // Type
      entryType: {
        type: 'string',
        enum: ['standard', 'adjusting', 'closing', 'reversing', 'opening'],
        default: 'standard',
        group: 'type',
      },
      source: {
        type: 'string',
        enum: ['transfer', 'card_transaction', 'fee', 'interest', 'manual', 'system', 'import'],
        default: 'system',
        description: 'Source of the journal entry',
        group: 'type',
      },

      // Description
      description: {
        type: 'string',
        description: 'Description of the transaction',
        group: 'info',
      },
      memo: {
        type: 'string',
        'x-control-variant': 'textarea',
        description: 'Detailed memo/notes',
        group: 'info',
      },

      // Totals (must balance)
      totalDebits: {
        type: 'number',
        default: 0,
        description: 'Sum of all debit entries (should equal credits)',
        group: 'totals',
      },
      totalCredits: {
        type: 'number',
        default: 0,
        description: 'Sum of all credit entries (should equal debits)',
        group: 'totals',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'totals',
      },
      isBalanced: {
        type: 'boolean',
        default: false,
        description: 'True if debits equal credits',
        readOnly: true,
        group: 'totals',
      },

      // Line Items (embedded for convenience, also stored as ledger_entry)
      lineItems: {
        type: 'array',
        title: 'Line Items',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            ledgerAccountId: { type: 'string', group: 'line' },
            ledgerAccountCode: { type: 'string', group: 'line' },
            ledgerAccountName: { type: 'string', group: 'line' },
            debit: { type: 'number', default: 0, group: 'amount' },
            credit: { type: 'number', default: 0, group: 'amount' },
            description: { type: 'string' },
          },
        },
      },

      // Status
      status: {
        type: 'string',
        enum: ['draft', 'pending', 'posted', 'reversed', 'voided'],
        default: 'draft',
        group: 'status',
      },

      // Reference to source transaction
      referenceType: {
        type: 'string',
        enum: ['bank_transfer', 'card_transaction', 'card_authorization', 'fee', 'interest', 'adjustment', 'reconciliation', 'manual'],
        group: 'reference',
      },
      referenceId: {
        type: 'string',
        description: 'ID of the source transaction',
        group: 'reference',
      },
      externalReference: {
        type: 'string',
        description: 'External reference number',
        group: 'reference',
      },

      // Approval
      requiresApproval: {
        type: 'boolean',
        default: false,
        group: 'approval',
      },
      approvedBy: {
        type: 'string',
        group: 'approval',
      },
      approvedAt: {
        type: 'string',
        format: 'date-time',
        group: 'approval',
      },

      // Audit
      createdBy: {
        type: 'string',
        group: 'audit',
      },
      postedBy: {
        type: 'string',
        group: 'audit',
      },
      postedAt: {
        type: 'string',
        format: 'date-time',
        group: 'audit',
      },
      reversedBy: {
        type: 'string',
        group: 'audit',
      },
      reversedAt: {
        type: 'string',
        format: 'date-time',
        group: 'audit',
      },
      reversalEntryId: {
        type: 'string',
        description: 'ID of the reversal journal entry',
        group: 'audit',
      },
      reversesEntryId: {
        type: 'string',
        description: 'ID of journal entry this reverses',
        group: 'audit',
      },

      // Period
      fiscalYear: {
        type: 'number',
        group: 'period',
      },
      fiscalPeriod: {
        type: 'number',
        description: 'Fiscal period (1-12 for monthly)',
        group: 'period',
      },
      periodClosed: {
        type: 'boolean',
        default: false,
        description: 'Whether the period is closed',
        group: 'period',
      },

      // Attachments
      attachments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileId: { type: 'string' },
            fileName: { type: 'string' },
            fileType: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    required: ['entryDate', 'description'],
  } as const;
};

const sc = JournalEntrySchema();
export type JournalEntryModel = FromSchema<typeof sc>;

registerCollection('Journal Entry', DataType.journal_entry, JournalEntrySchema());
