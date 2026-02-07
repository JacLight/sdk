import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFRentalConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        group: 'status',
      },
      isDefault: {
        type: 'boolean',
        default: false,
        description: 'Use as default rental configuration',
        group: 'status',
      },

      // Default Pricing
      defaultPricing: {
        type: 'object',
        title: 'Default Pricing',
        collapsible: true,
        properties: {
          currency: {
            type: 'string',
            default: 'USD',
            group: 'currency',
          },
          taxRate: {
            type: 'number',
            description: 'Default tax rate (%)',
            group: 'currency',
          },
        },
      },

      // Default Deposit
      defaultDeposit: {
        type: 'object',
        title: 'Default Deposit Settings',
        collapsible: true,
        properties: {
          required: {
            type: 'boolean',
            default: false,
            group: 'deposit',
          },
          type: {
            type: 'string',
            enum: ['fixed', 'percent'],
            default: 'percent',
            group: 'deposit',
          },
          amount: {
            type: 'number',
            description: 'Fixed amount or percentage of rental total',
            group: 'deposit',
          },
          refundable: {
            type: 'boolean',
            default: true,
            group: 'deposit',
          },
        },
      },

      // Default Late Fee
      defaultLateFee: {
        type: 'object',
        title: 'Default Late Fee Settings',
        collapsible: true,
        properties: {
          enabled: {
            type: 'boolean',
            default: false,
            group: 'late',
          },
          rate: {
            type: 'number',
            description: 'Late fee amount',
            group: 'late',
          },
          per: {
            type: 'string',
            enum: ['hourly', 'daily', 'weekly', 'monthly'],
            default: 'daily',
            group: 'late',
          },
          gracePeriod: {
            type: 'number',
            description: 'Grace period before late fee applies',
            group: 'grace',
          },
          gracePeriodUnit: {
            type: 'string',
            enum: ['minutes', 'hours', 'days'],
            default: 'hours',
            group: 'grace',
          },
          maxFee: {
            type: 'number',
            description: 'Maximum late fee cap',
          },
        },
      },

      // Default Fees
      defaultFees: {
        type: 'array',
        title: 'Default Additional Fees',
        collapsible: true,
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
            type: {
              type: 'string',
              enum: ['fixed', 'percent'],
              default: 'fixed',
              group: 'fee',
            },
            optional: {
              type: 'boolean',
              default: false,
              group: 'fee',
            },
            description: {
              type: 'string',
            },
          },
        },
      },

      // Cancellation Policy
      cancellation: {
        type: 'object',
        title: 'Cancellation Policy',
        collapsible: true,
        properties: {
          allowCancellation: {
            type: 'boolean',
            default: true,
            group: 'cancel',
          },
          freeCancellationHours: {
            type: 'number',
            description: 'Hours before start for free cancellation',
            group: 'cancel',
          },
          cancellationFee: {
            type: 'number',
            description: 'Fee for late cancellation',
            group: 'cancel-fee',
          },
          cancellationFeeType: {
            type: 'string',
            enum: ['fixed', 'percent'],
            default: 'percent',
            group: 'cancel-fee',
          },
          refundPolicy: {
            type: 'string',
            enum: ['full', 'partial', 'none'],
            default: 'partial',
          },
          policyText: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
        },
      },

      // Default Availability
      defaultAvailability: {
        type: 'object',
        title: 'Default Availability',
        collapsible: true,
        properties: {
          workDays: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: { type: 'string' },
            dataSource: {
              source: 'json',
              json: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
          },
          startTime: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            group: 'hours',
          },
          endTime: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            group: 'hours',
          },
          timezone: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'function',
              value: 'timezones',
            },
            default: '{{fn:Intl.DateTimeFormat().resolvedOptions().timeZone}}',
          },
          bufferTime: {
            type: 'number',
            description: 'Default buffer between rentals',
            group: 'buffer',
          },
          bufferTimeUnit: {
            type: 'string',
            enum: ['minutes', 'hours', 'days'],
            default: 'hours',
            group: 'buffer',
          },
        },
      },

      // Notifications
      notifications: {
        type: 'array',
        title: 'Notifications',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            trigger: {
              type: 'string',
              enum: [
                'booking_confirmed',
                'booking_cancelled',
                'payment_received',
                'ready_for_pickup',
                'out_for_delivery',
                'picked_up',
                'delivered',
                'return_reminder',
                'due_today',
                'overdue',
                'overdue_followup',
                'returned',
                'deposit_held',
                'late_fee_applied',
                'damage_charge',
                'deposit_refunded',
              ],
              group: 'trigger',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'trigger',
            },
            delay: {
              type: 'number',
              description: 'Delay/advance time (for reminders)',
              group: 'delay',
            },
            delayUnit: {
              type: 'string',
              enum: ['minutes', 'hours', 'days'],
              default: 'hours',
              group: 'delay',
            },
            channels: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              items: { type: 'string' },
              dataSource: {
                source: 'json',
                json: ['email', 'sms', 'whatsapp'],
              },
            },
            template: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'name',
                label: 'name',
              },
            },
            subject: {
              type: 'string',
              description: 'Email subject',
            },
            body: {
              type: 'string',
              'x-control-variant': 'textarea',
              description: 'Message body',
            },
          },
        },
      },

      // Restrictions
      restrictions: {
        type: 'array',
        title: 'Global Restrictions',
        collapsible: true,
        description: 'Default restrictions applied to all rentals',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['age', 'kyc', 'location', 'license', 'membership', 'custom'],
              group: 'type',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'type',
            },
            // Age restriction
            minAge: {
              type: 'number',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'age', action: 'hide' },
              ],
              group: 'age',
            },
            maxAge: {
              type: 'number',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'age', action: 'hide' },
              ],
              group: 'age',
            },
            // KYC restriction
            kycLevel: {
              type: 'string',
              enum: ['basic', 'standard', 'enhanced', 'full'],
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'kyc', action: 'hide' },
              ],
            },
            // Location restriction
            locationRule: {
              type: 'string',
              enum: ['allow', 'block'],
              default: 'allow',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'location', action: 'hide' },
              ],
              group: 'location',
            },
            countries: {
              type: 'array',
              items: { type: 'string' },
              description: 'Country codes (ISO 3166-1 alpha-2)',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'location', action: 'hide' },
              ],
            },
            states: {
              type: 'array',
              items: { type: 'string' },
              description: 'State/region codes',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'location', action: 'hide' },
              ],
            },
            // License restriction
            licenseType: {
              type: 'string',
              enum: ['drivers_license', 'commercial_license', 'professional_license', 'boating_license', 'pilot_license', 'other'],
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'license', action: 'hide' },
              ],
              group: 'license',
            },
            licenseClass: {
              type: 'string',
              description: 'Required license class (e.g., A, B, C, CDL)',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'license', action: 'hide' },
              ],
              group: 'license',
            },
            // Membership restriction
            membershipTier: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.sf_customer_tier,
                value: 'name',
                label: 'name',
              },
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'membership', action: 'hide' },
              ],
            },
            // Custom restriction
            customField: {
              type: 'string',
              description: 'Field to check on customer',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'custom', action: 'hide' },
              ],
              group: 'custom',
            },
            customOperator: {
              type: 'string',
              enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists'],
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'custom', action: 'hide' },
              ],
              group: 'custom',
            },
            customValue: {
              type: 'string',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'custom', action: 'hide' },
              ],
              group: 'custom',
            },
            // Common
            message: {
              type: 'string',
              description: 'Error message shown when restriction not met',
            },
          },
        },
      },

      // Terms & Conditions
      defaultTerms: {
        type: 'string',
        title: 'Default Terms & Conditions',
        'x-control': ControlType.richtext,
        collapsible: true,
      },

      // Agreement
      requireAgreement: {
        type: 'boolean',
        default: true,
        description: 'Require customer to sign rental agreement',
      },
      agreementTemplate: {
        type: 'string',
        'x-control': ControlType.richtext,
        title: 'Rental Agreement Template',
        collapsible: true,
      },
    },
    required: ['name'],
  } as const;
};

const sc = SFRentalConfigSchema();
export type SFRentalConfigModel = FromSchema<typeof sc>;

registerCollection('Rental Configuration', DataType.sf_rental_config, SFRentalConfigSchema());
