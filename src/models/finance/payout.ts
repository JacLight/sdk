import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const PayoutSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identification
      payoutNumber: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        title: 'Payout #',
        transform: ['random-string::12', 'uppercase'],
        group: 'id',
      },
      status: {
        type: 'string',
        enum: ['pending', 'approved', 'processing', 'completed', 'failed', 'cancelled'],
        default: 'pending',
        group: 'id',
      },

      // Recipient
      recipientType: {
        type: 'string',
        enum: ['delivery_agent', 'customer', 'vendor', 'affiliate', 'rental_owner', 'other'],
        group: 'recipient',
      },
      recipientId: {
        type: 'string',
        description: 'ID of the recipient entity',
        group: 'recipient',
      },
      recipientName: {
        type: 'string',
        group: 'recipient-info',
      },
      recipientEmail: {
        type: 'string',
        format: 'email',
        group: 'recipient-info',
      },

      // Amount
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },
      amount: {
        type: 'number',
        description: 'Gross payout amount',
        group: 'amount',
      },
      fees: {
        type: 'number',
        description: 'Processing fees',
        default: 0,
        group: 'fees',
      },
      netAmount: {
        type: 'number',
        description: 'Amount recipient receives (amount - fees)',
        group: 'fees',
      },

      // Sources of funds
      sources: {
        type: 'array',
        title: 'Earnings Sources',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [
                'delivery_earnings',
                'delivery_tips',
                'delivery_bonus',
                'rental_earnings',
                'order_commission',
                'affiliate_commission',
                'refund',
                'adjustment',
                'other',
              ],
              group: 'source',
            },
            reference: {
              type: 'string',
              description: 'Job ID, order ID, etc.',
              group: 'source',
            },
            amount: {
              type: 'number',
              group: 'source',
            },
            description: {
              type: 'string',
            },
          },
        },
      },

      // Payout Method
      method: {
        type: 'string',
        enum: ['bank_transfer', 'paypal', 'venmo', 'cashapp', 'check', 'wire', 'crypto', 'other'],
        group: 'method',
      },

      // Destination (where money goes)
      destination: {
        type: 'object',
        title: 'Destination',
        collapsible: true,
        properties: {
          // Bank
          bankName: {
            type: 'string',
            group: 'bank',
          },
          accountType: {
            type: 'string',
            enum: ['checking', 'savings'],
            group: 'bank',
          },
          routingNumber: {
            type: 'string',
            group: 'account',
          },
          accountNumber: {
            type: 'string',
            group: 'account',
          },
          accountHolderName: {
            type: 'string',
          },
          // PayPal
          paypalEmail: {
            type: 'string',
            format: 'email',
          },
          // Venmo/CashApp
          handle: {
            type: 'string',
          },
          // Check
          mailingAddress: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          // Wire
          swiftCode: {
            type: 'string',
          },
          iban: {
            type: 'string',
          },
          // Crypto
          walletAddress: {
            type: 'string',
          },
          cryptoCurrency: {
            type: 'string',
          },
        },
      },

      // Processing
      requestedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      processedAt: {
        type: 'string',
        format: 'date-time',
      },
      completedAt: {
        type: 'string',
        format: 'date-time',
      },
      expectedArrival: {
        type: 'string',
        format: 'date-time',
        description: 'Expected arrival date',
      },

      // External references
      externalReference: {
        type: 'string',
        description: 'Payment processor reference (Stripe, PayPal, etc.)',
      },
      externalBatchId: {
        type: 'string',
        description: 'Batch ID if part of batch payout',
      },

      // Failure handling
      failureReason: {
        type: 'string',
      },
      failureCode: {
        type: 'string',
      },
      retryCount: {
        type: 'number',
        default: 0,
      },
      lastRetryAt: {
        type: 'string',
        format: 'date-time',
      },

      // Approval (for large amounts or flagged payouts)
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
      },
      approvalNotes: {
        type: 'string',
      },

      // History
      history: {
        type: 'array',
        title: 'Status History',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              group: 'history',
            },
            status: {
              type: 'string',
              group: 'history',
            },
            notes: {
              type: 'string',
            },
            actor: {
              type: 'string',
            },
          },
        },
      },

      // Notes
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: ['recipientType', 'recipientId', 'amount'],
  } as const;
};

const sc = PayoutSchema();
export type PayoutModel = FromSchema<typeof sc>;

registerCollection('Payout', DataType.payout, PayoutSchema());
