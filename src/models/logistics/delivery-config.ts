import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const DeliveryConfigSchema = () => {
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
        exclusive: true,
        group: 'status',
      },

      // Agent Requirements
      agentRequirements: {
        type: 'object',
        title: 'Agent Requirements',
        collapsible: true,
        properties: {
          human: {
            type: 'object',
            title: 'Human Driver Requirements',
            properties: {
              kycLevel: {
                type: 'string',
                enum: ['none', 'basic', 'standard', 'enhanced', 'full'],
                default: 'basic',
                group: 'kyc',
              },
              minAge: {
                type: 'number',
                default: 18,
                group: 'kyc',
              },
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['drivers_license', 'insurance', 'vehicle_registration', 'background_check', 'profile_photo'],
                },
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
          drone: {
            type: 'object',
            title: 'Drone Requirements',
            properties: {
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['faa_registration', 'airworthiness_certificate', 'remote_pilot_certificate'],
                },
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
          robot: {
            type: 'object',
            title: 'Robot Requirements',
            properties: {
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['operating_permit', 'insurance', 'safety_certification'],
                },
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
        },
      },

      // Vehicle Requirements
      vehicleRequirements: {
        type: 'object',
        title: 'Vehicle Requirements',
        collapsible: true,
        properties: {
          car: {
            type: 'object',
            properties: {
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['registration', 'insurance', 'inspection'],
                },
              },
              maxAge: {
                type: 'number',
                description: 'Maximum vehicle age in years',
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
          motorcycle: {
            type: 'object',
            properties: {
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['registration', 'insurance'],
                },
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
          bicycle: {
            type: 'object',
            properties: {
              documents: {
                type: 'array',
                items: { type: 'string' },
              },
              approvalRequired: {
                type: 'boolean',
                default: false,
              },
            },
          },
          van: {
            type: 'object',
            properties: {
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['registration', 'insurance', 'inspection', 'commercial_license'],
                },
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
          truck: {
            type: 'object',
            properties: {
              documents: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                items: { type: 'string' },
                dataSource: {
                  source: 'json',
                  json: ['registration', 'insurance', 'inspection', 'cdl', 'dot_number'],
                },
              },
              approvalRequired: {
                type: 'boolean',
                default: true,
              },
            },
          },
        },
      },

      // Pricing Configuration
      pricing: {
        type: 'object',
        title: 'Pricing',
        collapsible: true,
        properties: {
          currency: {
            type: 'string',
            group: 'general',
          },
          minimumFee: {
            type: 'number',
            default: 15,
            description: 'Minimum delivery fee',
            group: 'general',
          },
          // Tiered pricing array
          tiers: {
            type: 'array',
            title: 'Distance Pricing Tiers',
            description: 'Price tiers based on distance. First matching tier is used.',
            items: {
              type: 'object',
              properties: {
                maxMiles: {
                  type: 'number',
                  description: 'Max miles for this tier (leave empty for unlimited)',
                  group: 'tier',
                },
                flatRate: {
                  type: 'number',
                  description: 'Flat rate for this tier (0 if per-mile)',
                  default: 0,
                  group: 'tier',
                },
                perMile: {
                  type: 'number',
                  description: 'Per mile rate (0 if flat rate)',
                  default: 0,
                  group: 'tier',
                },
              },
            },
          },
          platformFeePercent: {
            type: 'number',
            description: 'Platform fee percentage',
            group: 'platform',
          },
          platformFeeFixed: {
            type: 'number',
            description: 'Fixed platform fee',
            group: 'platform',
          },
        },
      },

      // Package Limits
      packageLimits: {
        type: 'object',
        title: 'Package Limits',
        collapsible: true,
        description: 'Maximum package size and weight allowed',
        properties: {
          maxWeight: {
            type: 'number',
            description: 'Maximum weight in lbs',
            group: 'weight',
          },
          maxLength: {
            type: 'number',
            description: 'Maximum length in inches',
            group: 'dimensions',
          },
          maxWidth: {
            type: 'number',
            description: 'Maximum width in inches',
            group: 'dimensions',
          },
          maxHeight: {
            type: 'number',
            description: 'Maximum height in inches',
            group: 'dimensions',
          },
        },
      },

      // Driver Payout Configuration
      driverPayout: {
        type: 'object',
        title: 'Driver Payout',
        collapsible: true,
        description: 'How drivers are paid',
        properties: {
          percentage: {
            type: 'number',
            default: 75,
            description: 'Percentage of customer price driver receives',
            group: 'payout',
          },
          minimumPay: {
            type: 'number',
            default: 10,
            description: 'Minimum pay per delivery',
            group: 'payout',
          },
          tipShare: {
            type: 'number',
            default: 100,
            description: 'Percentage of tips driver keeps',
            group: 'payout',
          },
        },
      },

      // Bonuses
      bonuses: {
        type: 'array',
        title: 'Bonuses & Incentives',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              group: 'bonus',
            },
            type: {
              type: 'string',
              enum: ['streak', 'peak_hours', 'completion_rate', 'rating', 'referral', 'quest', 'custom'],
              group: 'bonus',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'bonus',
            },
            amount: {
              type: 'number',
              group: 'amount',
            },
            // Conditions
            streakCount: {
              type: 'number',
              description: 'Deliveries in a row',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'streak', action: 'hide' },
              ],
            },
            peakHours: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  days: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  startTime: {
                    type: 'string',
                    group: 'peak-time',
                  },
                  endTime: {
                    type: 'string',
                    group: 'peak-time',
                  },
                },
              },
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'peak_hours', action: 'hide' },
              ],
            },
            completionThreshold: {
              type: 'number',
              description: 'Minimum completion rate %',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'completion_rate', action: 'hide' },
              ],
            },
            ratingThreshold: {
              type: 'number',
              description: 'Minimum rating',
              rules: [
                { operation: 'notEqual', valueA: '{{type}}', valueB: 'rating', action: 'hide' },
              ],
            },
          },
        },
      },

      // Surge Rules
      surgeRules: {
        type: 'array',
        title: 'Surge Pricing Rules',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              group: 'surge',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'surge',
            },
            multiplier: {
              type: 'number',
              description: 'Price multiplier (e.g., 1.5 = 50% increase)',
              group: 'surge',
            },
            conditions: {
              type: 'object',
              properties: {
                demandRatio: {
                  type: 'number',
                  description: 'Jobs / available drivers ratio threshold',
                },
                timeWindows: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      days: {
                        type: 'array',
                        items: { type: 'string' },
                        group: 'window',
                      },
                      startTime: {
                        type: 'string',
                        group: 'window',
                      },
                      endTime: {
                        type: 'string',
                        group: 'window',
                      },
                    },
                  },
                },
                zones: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Apply to specific zones only',
                },
              },
            },
          },
        },
      },

      // What a rider or sender picks from: ride types, package sizes and food delivery.
      // Each is priced from the route price above (times its multiplier, never below its minimum).
      serviceOptions: {
        type: 'array',
        title: 'Ride Types and Package Sizes',
        description: 'The choices customers see when they book. Each one is priced from the route price.',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', title: 'Name', description: 'What customers see, e.g. Comfort or Medium', group: 'name' },
            id: {
              type: 'string',
              title: 'Code',
              description: 'Short code, lower case (e.g. comfort). Do not change it once in use.',
              pattern: '^[a-z0-9_\\-]*$',
              group: 'name',
            },
            kind: {
              type: 'string',
              title: 'Used for',
              enum: ['ride', 'package', 'food'],
              'x-control': ControlType.selectSingle,
              dataSource: {
                source: 'json',
                json: [
                  { label: 'Ride', value: 'ride' },
                  { label: 'Package', value: 'package' },
                  { label: 'Food delivery', value: 'food' },
                ],
              },
              default: 'ride',
              group: 'kind',
            },
            icon: {
              type: 'string',
              enum: ['car', 'seat', 'user', 'box', 'bag'],
              'x-control': ControlType.selectSingle,
              dataSource: {
                source: 'json',
                json: [
                  { label: 'Car', value: 'car' },
                  { label: 'Seat', value: 'seat' },
                  { label: 'People', value: 'user' },
                  { label: 'Box', value: 'box' },
                  { label: 'Bag', value: 'bag' },
                ],
              },
              group: 'kind',
            },
            description: { type: 'string', description: 'One line under the name, e.g. Newer cars with extra legroom' },
            multiplier: {
              type: 'number',
              title: 'Price multiplier',
              description: '1 = the route price, 1.3 = 30% more, 0.6 = 40% less',
              default: 1,
              minimum: 0.1,
              maximum: 10,
              group: 'price',
            },
            minimumFee: { type: 'number', title: 'Minimum price', minimum: 0, group: 'price' },
            seats: {
              type: 'number',
              title: 'Seats',
              description: 'Riders it takes',
              minimum: 1,
              maximum: 15,
              group: 'size',
              rules: [{ operation: 'notEqual', valueA: '{{kind}}', valueB: 'ride', action: 'hide' }],
            },
            maxWeight: {
              type: 'number',
              title: 'Heaviest package (lb)',
              minimum: 0,
              group: 'size',
              rules: [{ operation: 'notEqual', valueA: '{{kind}}', valueB: 'package', action: 'hide' }],
            },
            vehicleTypes: {
              type: 'array',
              title: 'Vehicles that can take it',
              description: 'Leave empty for any vehicle',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              items: { type: 'string' },
              dataSource: {
                source: 'json',
                json: ['car', 'suv', 'van', 'truck', 'motorcycle', 'scooter', 'bicycle'],
              },
            },
            sort: { type: 'number', title: 'Order', description: 'Lower shows first', group: 'show' },
            enabled: { type: 'boolean', title: 'Offered', default: true, group: 'show' },
          },
        },
      },
      cancellationPolicy: {
        type: 'object',
        title: 'Cancellation',
        collapsible: true,
        properties: {
          graceMinutes: { type: 'number', title: 'Free for (minutes)', description: 'Free to cancel for this long after a driver is on the way', default: 2, minimum: 0, group: 'fee' },
          fee: { type: 'number', title: 'Fee after that', default: 5, minimum: 0, group: 'fee' },
          driverShare: { type: 'number', title: 'Driver share of the fee (%)', default: 100, minimum: 0, maximum: 100, group: 'fee' },
        },
      },
      verification: {
        type: 'object',
        title: 'Trip PINs',
        collapsible: true,
        properties: {
          ridePin: { type: 'boolean', title: 'Rides: rider gives the driver a PIN at pickup', default: false, group: 'pin' },
          deliveryPin: { type: 'boolean', title: 'Packages: recipient gives the driver a PIN at drop-off', default: true, group: 'pin' },
        },
      },
      scheduling: {
        type: 'object',
        title: 'Scheduled Trips',
        collapsible: true,
        properties: {
          leadMinutes: { type: 'number', title: 'Earliest (minutes ahead)', default: 30, minimum: 0, group: 'window' },
          maxDaysAhead: { type: 'number', title: 'Latest (days ahead)', default: 30, minimum: 1, group: 'window' },
        },
      },
      paymentMethodTypes: {
        type: 'array',
        title: 'Payment methods',
        description: 'How customers can pay for trips. Card includes Apple Pay and Google Pay.',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: { type: 'string' },
        default: ['card'],
        dataSource: { source: 'json', json: ['card', 'link', 'cashapp', 'us_bank_account', 'klarna', 'afterpay_clearpay', 'affirm'] },
      },

      // Assignment Rules
      assignmentRules: {
        type: 'object',
        title: 'Assignment Rules',
        collapsible: true,
        properties: {
          defaultMode: {
            type: 'string',
            enum: ['auto', 'broadcast', 'pool', 'manual'],
            default: 'broadcast',
            group: 'mode',
          },
          autoAssignStrategy: {
            type: 'string',
            enum: ['nearest', 'best_rated', 'least_busy', 'round_robin'],
            default: 'nearest',
            rules: [
              { operation: 'notEqual', valueA: '{{defaultMode}}', valueB: 'auto', action: 'hide' },
            ],
            group: 'mode',
          },
          broadcastRadius: {
            type: 'number',
            description: 'Miles radius for broadcast',
            default: 5,
            group: 'broadcast',
          },
          broadcastTimeout: {
            type: 'number',
            description: 'Seconds to wait for acceptance',
            default: 60,
            group: 'broadcast',
          },
          maxOffersPerJob: {
            type: 'number',
            description: 'Max drivers to offer to before escalating',
            default: 10,
          },
          offerExpirySeconds: {
            type: 'number',
            description: 'Seconds before offer expires',
            default: 30,
          },
        },
      },

      // Operating Settings
      operations: {
        type: 'object',
        title: 'Operating Settings',
        collapsible: true,
        properties: {
          maxActiveJobsPerAgent: {
            type: 'number',
            default: 1,
            group: 'limits',
          },
          maxDistance: {
            type: 'number',
            description: 'Maximum delivery distance (miles)',
            group: 'limits',
          },
          clearingPeriodDays: {
            type: 'number',
            description: 'Days before earnings are available for payout',
            default: 1,
            group: 'payout',
          },
          minimumPayout: {
            type: 'number',
            description: 'Minimum balance for payout',
            default: 25,
            group: 'payout',
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
                'job_created',
                'job_assigned',
                'job_accepted',
                'job_rejected',
                'driver_en_route_pickup',
                'driver_arrived_pickup',
                'job_picked_up',
                'driver_en_route_dropoff',
                'driver_arrived_dropoff',
                'job_delivered',
                'job_completed',
                'job_cancelled',
                'job_failed',
                'payout_processed',
                'agent_approved',
                'agent_suspended',
              ],
              group: 'trigger',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'trigger',
            },
            recipient: {
              type: 'string',
              enum: ['customer', 'sender', 'recipient', 'agent', 'admin'],
              group: 'recipient',
            },
            channels: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              items: { type: 'string' },
              dataSource: {
                source: 'json',
                json: ['email', 'sms', 'push', 'whatsapp'],
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
          },
        },
      },

      // Zone Configuration
      zones: {
        type: 'array',
        title: 'Zone-Specific Settings',
        description: 'Override pricing/settings for specific zones',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            zone: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.delivery_zone,
                value: 'name',
                label: 'title',
              },
              group: 'zone',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'zone',
            },
            pricingOverride: {
              type: 'object',
              title: 'Pricing Override',
              description: 'Leave empty to use default pricing',
              properties: {
                minimumFee: { type: 'number', group: 'override' },
                tiers: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      maxMiles: { type: 'number', group: 'tier' },
                      flatRate: { type: 'number', group: 'tier' },
                      perMile: { type: 'number', group: 'tier' },
                    },
                  },
                },
                surgeMultiplier: { type: 'number', description: 'Zone-specific surge' },
              },
            },
            driverPayOverride: {
              type: 'object',
              title: 'Driver Pay Override',
              properties: {
                percentage: { type: 'number', group: 'pay' },
                minimumPay: { type: 'number', group: 'pay' },
              },
            },
          },
        },
      },

      // Merchant Account Settings (for business customers with invoicing)
      merchantAccounts: {
        type: 'object',
        title: 'Merchant Account Settings',
        description: 'Settings for business customers who get invoiced instead of paying per job',
        collapsible: true,
        properties: {
          enabled: {
            type: 'boolean',
            default: true,
            description: 'Allow merchant/business accounts',
          },
          defaultSpendingLimit: {
            type: 'number',
            description: 'Default spending limit for new merchant accounts',
            default: 5000,
          },
          defaultPaymentPeriodDays: {
            type: 'number',
            description: 'Default NET payment terms (days)',
            default: 30,
          },
          invoiceTrigger: {
            type: 'string',
            enum: ['limit_or_period', 'limit_only', 'period_only', 'manual'],
            default: 'limit_or_period',
            description: 'What triggers invoice generation',
          },
          autoInvoice: {
            type: 'boolean',
            default: true,
            description: 'Automatically generate invoices when triggered',
          },
          requireApproval: {
            type: 'boolean',
            default: true,
            description: 'Require admin approval for new merchant accounts',
          },
          creditCheckRequired: {
            type: 'boolean',
            default: false,
            description: 'Require credit check for merchant accounts',
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const sc = DeliveryConfigSchema();
export type DeliveryConfigModel = FromSchema<typeof sc>;

registerCollection('Delivery Config', DataType.delivery_config, DeliveryConfigSchema());
