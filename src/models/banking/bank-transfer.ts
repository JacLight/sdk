import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const BankTransferSchema = () => {
  return {
    type: 'object',
    properties: {
      // Transfer Identification
      transferNumber: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 12,
        maxLength: 16,
        unique: true,
        transform: ['random-string::12'],
        group: 'identification',
      },

      // Transfer Type
      transferType: {
        type: 'string',
        enum: ['ach', 'wire', 'rtp', 'internal', 'book'],
        default: 'ach',
        description: 'Type of transfer',
        group: 'type',
      },
      direction: {
        type: 'string',
        enum: ['inbound', 'outbound', 'internal'],
        group: 'type',
      },

      // ACH Specific
      achClass: {
        type: 'string',
        enum: ['PPD', 'CCD', 'WEB', 'TEL', 'CTX'],
        description: 'ACH Standard Entry Class code',
        group: 'ach',
      },
      achBatchId: {
        type: 'string',
        description: 'ACH batch identifier',
        group: 'ach',
      },
      achTraceNumber: {
        type: 'string',
        description: 'ACH trace number for tracking',
        group: 'ach',
      },

      // Wire Specific
      wireReference: {
        type: 'string',
        description: 'IMAD/OMAD reference for wire',
        group: 'wire',
      },
      fedwireSequence: {
        type: 'string',
        group: 'wire',
      },

      // RTP Specific
      rtpInstructionId: {
        type: 'string',
        description: 'RTP instruction ID',
        group: 'rtp',
      },

      // Source Account
      sourceAccountId: {
        type: 'string',
        description: 'Source bank account ID',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.bank_account,
          value: 'sk',
          label: ['name', 'accountNumber'],
        },
        group: 'source',
      },
      sourceRoutingNumber: {
        type: 'string',
        group: 'source',
      },
      sourceAccountNumber: {
        type: 'string',
        group: 'source',
      },
      sourceAccountName: {
        type: 'string',
        group: 'source',
      },

      // Destination Account
      destinationAccountId: {
        type: 'string',
        description: 'Destination bank account ID (for internal)',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.bank_account,
          value: 'sk',
          label: ['name', 'accountNumber'],
        },
        group: 'destination',
      },
      destinationRoutingNumber: {
        type: 'string',
        group: 'destination',
      },
      destinationAccountNumber: {
        type: 'string',
        group: 'destination',
      },
      destinationAccountName: {
        type: 'string',
        group: 'destination',
      },
      destinationBankName: {
        type: 'string',
        group: 'destination',
      },

      // Amount
      amount: {
        type: 'number',
        minimum: 0,
        description: 'Amount in cents',
        group: 'amount',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },

      // Fees
      fees: {
        type: 'object',
        title: 'Transfer Fees',
        collapsible: true,
        properties: {
          transferFee: {
            type: 'number',
            default: 0,
            description: 'Fee for this transfer in cents',
            group: 'fees',
          },
          wireProcessingFee: {
            type: 'number',
            default: 0,
            group: 'fees',
          },
          expeditedFee: {
            type: 'number',
            default: 0,
            group: 'fees',
          },
          totalFees: {
            type: 'number',
            default: 0,
            group: 'fees',
          },
        },
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'processing', 'submitted', 'settled', 'completed', 'failed', 'returned', 'cancelled'],
        default: 'pending',
        group: 'status',
      },
      returnCode: {
        type: 'string',
        description: 'ACH return code if returned (e.g., R01, R02)',
        group: 'status',
      },
      returnReason: {
        type: 'string',
        description: 'Human-readable return reason',
        group: 'status',
      },
      failureReason: {
        type: 'string',
        group: 'status',
      },

      // Ledger Integration
      journalEntryId: {
        type: 'string',
        description: 'Links to double-entry journal entry',
        group: 'ledger',
      },

      // Description & Memo
      description: {
        type: 'string',
        maxLength: 140,
        description: 'Transfer description',
        group: 'info',
      },
      memo: {
        type: 'string',
        maxLength: 80,
        description: 'ACH/Wire memo field',
        group: 'info',
      },
      internalMemo: {
        type: 'string',
        description: 'Internal notes (not sent to other party)',
        group: 'info',
      },

      // Idempotency
      idempotencyKey: {
        type: 'string',
        description: 'Client-provided idempotency key',
        unique: true,
        group: 'idempotency',
      },

      // Timeline
      initiatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      submittedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      settledAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      completedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      expectedSettlementDate: {
        type: 'string',
        format: 'date',
        group: 'timeline',
      },

      // Provider Info
      provider: {
        type: 'string',
        enum: ['internal', 'sponsor_bank', 'fed_ach', 'fedwire', 'rtp_network'],
        group: 'provider',
      },
      providerTransferId: {
        type: 'string',
        description: 'External provider transfer ID',
        group: 'provider',
      },

      // Risk & Compliance
      riskScore: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'risk',
      },
      riskFlags: {
        type: 'array',
        items: { type: 'string' },
        group: 'risk',
      },
      requiresReview: {
        type: 'boolean',
        default: false,
        group: 'risk',
      },
      reviewedBy: {
        type: 'string',
        group: 'risk',
      },
      reviewedAt: {
        type: 'string',
        format: 'date-time',
        group: 'risk',
      },

      // Related References
      relatedTransferId: {
        type: 'string',
        description: 'For returns/reversals, links to original transfer',
        group: 'related',
      },

      // Metadata
      metadata: {
        type: 'object',
        additionalProperties: true,
        description: 'Custom metadata',
      },
    },
    required: ['transferType', 'direction', 'amount'],
  } as const;
};

const sc = BankTransferSchema();
export type BankTransferModel = FromSchema<typeof sc>;

registerCollection('Bank Transfer', DataType.bank_transfer, BankTransferSchema());
