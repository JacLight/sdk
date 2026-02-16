import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { AddressSchema } from '../crm/crm-address';

export const SFRentalItemSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        group: 'name',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        default: '{{name}}',
        transform: ['uri', 'lowercase', 'suffix-', 'random-string'],
        textSearch: true,
        group: 'name',
      },
      sku: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        textSearch: true,
        group: 'name',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'maintenance'],
        default: 'active',
        group: 'status',
      },
      config: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_rental_config,
          value: 'name',
          label: 'title',
        },
        description: 'Rental config to apply (uses default if not set)',
        group: 'status',
      },
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
        textSearch: true,
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },
      quantity: {
        type: 'number',
        default: 1,
        description: 'Number of this item available for rent',
        group: 'quantity',
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
          hourly: {
            type: 'number',
            description: 'Rate per hour',
            group: 'rates',
          },
          daily: {
            type: 'number',
            description: 'Rate per day',
            group: 'rates',
          },
          weekly: {
            type: 'number',
            description: 'Rate per week',
            group: 'rates',
          },
          monthly: {
            type: 'number',
            description: 'Rate per month',
            group: 'rates',
          },
        },
      },

      // Deposit
      deposit: {
        type: 'object',
        title: 'Deposit',
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
            default: 'fixed',
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

      // Late Fee
      lateFee: {
        type: 'object',
        title: 'Late Fee',
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

      // Fees (add-on charges)
      fees: {
        type: 'array',
        title: 'Additional Fees',
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
              description: 'Customer can opt-in/out',
              group: 'fee',
            },
            description: {
              type: 'string',
            },
          },
        },
      },

      // Availability
      availability: {
        type: 'object',
        title: 'Availability',
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
            description: 'Business hours start',
            group: 'hours',
          },
          endTime: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            description: 'Business hours end',
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
          minDuration: {
            type: 'number',
            description: 'Minimum rental duration',
            group: 'duration',
          },
          minDurationUnit: {
            type: 'string',
            enum: ['hours', 'days', 'weeks', 'months'],
            default: 'days',
            group: 'duration',
          },
          maxDuration: {
            type: 'number',
            description: 'Maximum rental duration',
            group: 'duration-max',
          },
          maxDurationUnit: {
            type: 'string',
            enum: ['hours', 'days', 'weeks', 'months'],
            default: 'days',
            group: 'duration-max',
          },
          bufferTime: {
            type: 'number',
            description: 'Buffer time between rentals (for cleaning, prep)',
            group: 'buffer',
          },
          bufferTimeUnit: {
            type: 'string',
            enum: ['minutes', 'hours', 'days'],
            default: 'hours',
            group: 'buffer',
          },
          blockedDates: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                startDate: {
                  type: 'string',
                  format: 'date',
                  'x-control': ControlType.date,
                  group: 'blocked',
                },
                endDate: {
                  type: 'string',
                  format: 'date',
                  'x-control': ControlType.date,
                  group: 'blocked',
                },
                reason: {
                  type: 'string',
                },
              },
            },
          },
        },
      },

      // Pickup Location
      pickupLocation: {
        type: 'object',
        title: 'Pickup Location',
        collapsible: true,
        description: 'Where customers pick up the rental item',
        properties: {
          type: {
            type: 'string',
            enum: ['location', 'manual'],
            default: 'location',
            description: 'Use existing location or enter manually',
            group: 'loc-type',
          },
          locationRef: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.location,
              value: 'name',
              label: 'name',
            },
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'location', action: 'hide' },
            ],
            group: 'loc-type',
          },
          address: {
            ...AddressSchema(),
            title: 'Manual Address',
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'manual', action: 'hide' },
            ],
          },
        },
      },

      // Return/Dropoff Location
      returnLocation: {
        type: 'object',
        title: 'Return Location',
        collapsible: true,
        description: 'Where customers return/drop off the rental item',
        properties: {
          sameAsPickup: {
            type: 'boolean',
            default: true,
            description: 'Return location is same as pickup location',
          },
          type: {
            type: 'string',
            enum: ['location', 'manual'],
            default: 'location',
            description: 'Use existing location or enter manually',
            rules: [
              { operation: 'equal', valueA: '{{sameAsPickup}}', valueB: true, action: 'hide' },
            ],
            group: 'loc-type',
          },
          locationRef: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.location,
              value: 'name',
              label: 'name',
            },
            rules: [
              { operation: 'equal', valueA: '{{sameAsPickup}}', valueB: true, action: 'hide' },
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'location', action: 'hide' },
            ],
            group: 'loc-type',
          },
          address: {
            ...AddressSchema(),
            title: 'Manual Address',
            rules: [
              { operation: 'equal', valueA: '{{sameAsPickup}}', valueB: true, action: 'hide' },
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'manual', action: 'hide' },
            ],
          },
        },
      },

      // Fulfillment
      fulfillment: {
        type: 'object',
        title: 'Pickup & Delivery',
        collapsible: true,
        properties: {
          // Pickup options
          allowPickup: {
            type: 'boolean',
            default: true,
            group: 'pickup',
          },
          pickupInstructions: {
            type: 'string',
            'x-control-variant': 'textarea',
            rules: [
              { operation: 'notEqual', valueA: '{{allowPickup}}', valueB: true, action: 'hide' },
            ],
          },
          pickupLeadTime: {
            type: 'number',
            description: 'Minimum hours before rental start for pickup',
            rules: [
              { operation: 'notEqual', valueA: '{{allowPickup}}', valueB: true, action: 'hide' },
            ],
            group: 'pickup-time',
          },
          pickupLeadTimeUnit: {
            type: 'string',
            enum: ['minutes', 'hours', 'days'],
            default: 'hours',
            rules: [
              { operation: 'notEqual', valueA: '{{allowPickup}}', valueB: true, action: 'hide' },
            ],
            group: 'pickup-time',
          },

          // Delivery options
          allowDelivery: {
            type: 'boolean',
            default: false,
            group: 'delivery',
          },
          deliveryFee: {
            type: 'number',
            description: 'Base delivery fee',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
            group: 'delivery-fee',
          },
          deliveryFeeType: {
            type: 'string',
            enum: ['flat', 'per_mile', 'tiered'],
            default: 'flat',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
            group: 'delivery-fee',
          },
          deliveryFeePerMile: {
            type: 'number',
            description: 'Additional fee per mile (for per_mile type)',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
              { operation: 'notEqual', valueA: '{{deliveryFeeType}}', valueB: 'per_mile', action: 'hide' },
            ],
          },
          deliveryTiers: {
            type: 'array',
            description: 'Tiered delivery pricing (for tiered type)',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
              { operation: 'notEqual', valueA: '{{deliveryFeeType}}', valueB: 'tiered', action: 'hide' },
            ],
            items: {
              type: 'object',
              properties: {
                minDistance: {
                  type: 'number',
                  group: 'tier-dist',
                },
                maxDistance: {
                  type: 'number',
                  group: 'tier-dist',
                },
                fee: {
                  type: 'number',
                },
              },
            },
          },
          deliveryRadius: {
            type: 'number',
            description: 'Maximum delivery radius in miles',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
          },
          deliveryLeadTime: {
            type: 'number',
            description: 'Minimum hours before rental start for delivery',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
            group: 'delivery-time',
          },
          deliveryLeadTimeUnit: {
            type: 'string',
            enum: ['minutes', 'hours', 'days'],
            default: 'hours',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
            group: 'delivery-time',
          },
          deliveryDays: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: { type: 'string' },
            dataSource: {
              source: 'json',
              json: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            description: 'Days when delivery is available',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
          },
          deliveryInstructions: {
            type: 'string',
            'x-control-variant': 'textarea',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
          },

          // Return options
          allowDropoff: {
            type: 'boolean',
            default: true,
            description: 'Customer can drop off at location',
            group: 'return',
          },
          dropoffInstructions: {
            type: 'string',
            'x-control-variant': 'textarea',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDropoff}}', valueB: true, action: 'hide' },
            ],
          },
          allowReturnPickup: {
            type: 'boolean',
            default: false,
            description: 'We can pick up from customer',
            group: 'return',
          },
          returnPickupFee: {
            type: 'number',
            description: 'Fee for return pickup',
            rules: [
              { operation: 'notEqual', valueA: '{{allowReturnPickup}}', valueB: true, action: 'hide' },
            ],
            group: 'return-pickup',
          },
          returnPickupFeeType: {
            type: 'string',
            enum: ['flat', 'per_mile', 'same_as_delivery'],
            default: 'flat',
            rules: [
              { operation: 'notEqual', valueA: '{{allowReturnPickup}}', valueB: true, action: 'hide' },
            ],
            group: 'return-pickup',
          },
          returnPickupFeePerMile: {
            type: 'number',
            description: 'Additional fee per mile for return pickup',
            rules: [
              { operation: 'notEqual', valueA: '{{allowReturnPickup}}', valueB: true, action: 'hide' },
              { operation: 'notEqual', valueA: '{{returnPickupFeeType}}', valueB: 'per_mile', action: 'hide' },
            ],
          },
          returnPickupRadius: {
            type: 'number',
            description: 'Maximum return pickup radius in miles',
            rules: [
              { operation: 'notEqual', valueA: '{{allowReturnPickup}}', valueB: true, action: 'hide' },
            ],
          },
          returnPickupInstructions: {
            type: 'string',
            'x-control-variant': 'textarea',
            rules: [
              { operation: 'notEqual', valueA: '{{allowReturnPickup}}', valueB: true, action: 'hide' },
            ],
          },

          // Cutoff times
          sameDayPickupCutoff: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            description: 'Last time to book for same-day pickup',
            group: 'cutoff',
          },
          sameDayDeliveryCutoff: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            description: 'Last time to book for same-day delivery',
            rules: [
              { operation: 'notEqual', valueA: '{{allowDelivery}}', valueB: true, action: 'hide' },
            ],
            group: 'cutoff',
          },
        },
      },

      // Restrictions
      restrictions: {
        type: 'array',
        title: 'Rental Restrictions',
        collapsible: true,
        description: 'Item-specific restrictions (overrides/adds to global)',
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

      // Notifications (override global)
      notifications: {
        type: 'array',
        title: 'Notifications',
        collapsible: true,
        description: 'Override global notification settings',
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
              description: 'Email subject (if not using template)',
            },
            body: {
              type: 'string',
              'x-control-variant': 'textarea',
              description: 'Message body (if not using template)',
            },
          },
        },
      },

      // Terms
      terms: {
        type: 'string',
        title: 'Rental Terms & Conditions',
        'x-control': ControlType.richtext,
        collapsible: true,
      },
    },
    required: ['name', 'sku'],
  } as const;
};

const sc = SFRentalItemSchema();
export type SFRentalItemModel = FromSchema<typeof sc>;

registerCollection('Rental Item', DataType.sf_rental_item, SFRentalItemSchema());
