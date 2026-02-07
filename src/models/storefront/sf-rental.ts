import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFRentalSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identification
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        title: 'Rental ID',
        transform: ['random-string::10', 'uppercase'],
        group: 'id',
      },
      status: {
        type: 'string',
        enum: [
          'pending',
          'confirmed',
          'ready',
          'picked_up',
          'delivered',
          'active',
          'overdue',
          'returned',
          'completed',
          'cancelled',
        ],
        default: 'pending',
        group: 'id',
      },

      // Rental Item Reference
      rentalItem: {
        type: 'object',
        properties: {
          sku: {
            type: 'string',
            group: 'item',
          },
          name: {
            type: 'string',
            group: 'item',
          },
          image: {
            type: 'string',
          },
        },
      },
      quantity: {
        type: 'number',
        default: 1,
        group: 'item',
      },

      // Customer
      customer: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            inputRequired: true,
            group: 'customer-name',
          },
          lastName: {
            type: 'string',
            inputRequired: true,
            group: 'customer-name',
          },
          email: {
            type: 'string',
            format: 'email',
            inputRequired: true,
            group: 'customer-contact',
          },
          phone: {
            type: 'string',
            inputRequired: true,
            group: 'customer-contact',
          },
        },
      },

      // Rental Period
      startDate: {
        type: 'string',
        format: 'date-time',
        'x-control': ControlType.date,
        group: 'period',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        'x-control': ControlType.date,
        group: 'period',
      },
      timezone: {
        type: 'string',
        group: 'period',
      },
      rentalPeriod: {
        type: 'string',
        enum: ['hourly', 'daily', 'weekly', 'monthly'],
        group: 'period',
      },
      duration: {
        type: 'number',
        description: 'Number of periods',
        group: 'period',
      },

      // Fulfillment
      fulfillment: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['pickup', 'delivery'],
            group: 'fulfillment',
          },
          scheduledDate: {
            type: 'string',
            format: 'date-time',
            'x-control': ControlType.date,
            group: 'fulfillment',
          },
          completedDate: {
            type: 'string',
            format: 'date-time',
            'x-control': ControlType.date,
            group: 'fulfillment',
          },
          address: AddressSchema(),
          instructions: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
        },
      },

      // Return
      return: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['dropoff', 'pickup'],
            group: 'return',
          },
          scheduledDate: {
            type: 'string',
            format: 'date-time',
            'x-control': ControlType.date,
            group: 'return',
          },
          actualDate: {
            type: 'string',
            format: 'date-time',
            'x-control': ControlType.date,
            group: 'return',
          },
          address: AddressSchema(),
          instructions: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
        },
      },

      // Condition Tracking
      checkOut: {
        type: 'object',
        title: 'Check-Out Condition',
        collapsible: true,
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
            group: 'checkout',
          },
          condition: {
            type: 'string',
            enum: ['excellent', 'good', 'fair', 'poor'],
            group: 'checkout',
          },
          notes: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          photos: {
            type: 'array',
            items: { type: 'string' },
          },
          checkedBy: {
            type: 'string',
          },
        },
      },
      checkIn: {
        type: 'object',
        title: 'Check-In Condition',
        collapsible: true,
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
            group: 'checkin',
          },
          condition: {
            type: 'string',
            enum: ['excellent', 'good', 'fair', 'poor'],
            group: 'checkin',
          },
          notes: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          photos: {
            type: 'array',
            items: { type: 'string' },
          },
          damages: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          checkedBy: {
            type: 'string',
          },
        },
      },

      // Pricing
      pricing: {
        type: 'object',
        title: 'Pricing',
        collapsible: true,
        properties: {
          currency: {
            type: 'string',
            default: 'USD',
            group: 'currency',
          },
          baseRate: {
            type: 'number',
            description: 'Rate per period',
            group: 'base',
          },
          basePeriod: {
            type: 'string',
            enum: ['hourly', 'daily', 'weekly', 'monthly'],
            group: 'base',
          },
          subtotal: {
            type: 'number',
            description: 'Base rate x duration',
            group: 'totals',
          },
          fees: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  group: 'fee',
                },
                amount: {
                  type: 'number',
                  group: 'fee',
                },
              },
            },
          },
          feesTotal: {
            type: 'number',
            group: 'totals',
          },
          tax: {
            type: 'number',
            group: 'totals',
          },
          total: {
            type: 'number',
            group: 'totals',
          },
        },
      },

      // Deposit
      deposit: {
        type: 'object',
        title: 'Deposit',
        collapsible: true,
        properties: {
          amount: {
            type: 'number',
            group: 'deposit',
          },
          status: {
            type: 'string',
            enum: ['pending', 'held', 'partially_refunded', 'refunded', 'forfeited'],
            default: 'pending',
            group: 'deposit',
          },
          heldDate: {
            type: 'string',
            format: 'date-time',
          },
          refundedAmount: {
            type: 'number',
          },
          refundedDate: {
            type: 'string',
            format: 'date-time',
          },
          deductions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                reason: {
                  type: 'string',
                  group: 'deduction',
                },
                amount: {
                  type: 'number',
                  group: 'deduction',
                },
                date: {
                  type: 'string',
                  format: 'date-time',
                },
              },
            },
          },
        },
      },

      // Late Fees
      lateFees: {
        type: 'object',
        title: 'Late Fees',
        collapsible: true,
        properties: {
          isLate: {
            type: 'boolean',
            default: false,
            group: 'late',
          },
          daysLate: {
            type: 'number',
            group: 'late',
          },
          hoursLate: {
            type: 'number',
            group: 'late',
          },
          feeApplied: {
            type: 'number',
          },
          feeHistory: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'date-time',
                  group: 'fee-hist',
                },
                amount: {
                  type: 'number',
                  group: 'fee-hist',
                },
                reason: {
                  type: 'string',
                },
              },
            },
          },
        },
      },

      // Payment
      payment: {
        type: 'object',
        title: 'Payment',
        collapsible: true,
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'partial', 'paid', 'refunded'],
            default: 'pending',
            group: 'payment',
          },
          method: {
            type: 'string',
            group: 'payment',
          },
          transactionId: {
            type: 'string',
          },
          paidAmount: {
            type: 'number',
          },
          paidDate: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // Agreement
      agreement: {
        type: 'object',
        title: 'Rental Agreement',
        collapsible: true,
        properties: {
          signed: {
            type: 'boolean',
            default: false,
            group: 'agreement',
          },
          signedDate: {
            type: 'string',
            format: 'date-time',
            group: 'agreement',
          },
          signatureUrl: {
            type: 'string',
          },
          agreementUrl: {
            type: 'string',
          },
          ipAddress: {
            type: 'string',
          },
        },
      },

      // Notes
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
      customerNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Customer Notes',
      },
    },
    required: ['name'],
  } as const;
};

const sc = SFRentalSchema();
export type SFRentalModel = FromSchema<typeof sc>;

registerCollection('Rental', DataType.sf_rental, SFRentalSchema());
