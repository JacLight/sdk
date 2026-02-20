import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const WalletTransactionSchema = () => {
  return {
    type: 'object',
    properties: {
      // Transaction ID
      transactionNumber: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        title: 'Transaction #',
        transform: ['random-string::12', 'uppercase'],
        group: 'id',
      },

      // Wallet reference (owner field on BaseModel points to the wallet)
      wallet: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.wallet,
          value: 'sk',
          label: 'sk',
        },
        description: 'Wallet this transaction belongs to',
        group: 'wallet',
      },

      // Transaction type
      type: {
        type: 'string',
        enum: ['credit', 'debit', 'hold', 'release', 'transfer'],
        group: 'type',
      },
      category: {
        type: 'string',
        enum: [
          'earning',
          'tip',
          'bonus',
          'commission',
          'referral',
          'refund',
          'adjustment',
          'payout',
          'fee',
          'chargeback',
          'hold',
          'release',
          'transfer_in',
          'transfer_out',
        ],
        group: 'type',
      },

      // Amount
      amount: {
        type: 'number',
        description: 'Transaction amount (always positive)',
        group: 'amount',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },

      // Balance tracking
      balanceBefore: {
        type: 'number',
        description: 'Wallet balance before this transaction',
        group: 'balance',
      },
      balanceAfter: {
        type: 'number',
        description: 'Wallet balance after this transaction',
        group: 'balance',
      },

      // Reference
      reference: {
        type: 'string',
        description: 'Job ID, payout ID, order ID, etc.',
        group: 'ref',
      },
      referenceType: {
        type: 'string',
        enum: ['job', 'payout', 'order', 'adjustment', 'refund', 'other'],
        group: 'ref',
      },

      // Description
      description: {
        type: 'string',
        group: 'desc',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'completed', 'failed', 'reversed'],
        default: 'completed',
        group: 'status',
      },

      // Metadata
      metadata: {
        type: 'object',
        additionalProperties: true,
        description: 'Additional transaction data',
      },
    },
    required: ['wallet', 'type', 'amount'],
  } as const;
};

const sc = WalletTransactionSchema();
export type WalletTransactionModel = FromSchema<typeof sc>;

registerCollection('Wallet Transaction', DataType.wallet_transaction, WalletTransactionSchema());
