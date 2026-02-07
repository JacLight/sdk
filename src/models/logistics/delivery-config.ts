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

      // Default Pricing (for auto-calculation)
      defaultPricing: {
        type: 'object',
        title: 'Default Pricing',
        collapsible: true,
        description: 'Used for auto-calculating job prices',
        properties: {
          currency: {
            type: 'string',
            default: 'USD',
            group: 'currency',
          },
          baseFee: {
            type: 'number',
            description: 'Base delivery fee',
            group: 'base',
          },
          perMile: {
            type: 'number',
            description: 'Per mile charge',
            group: 'base',
          },
          perMinute: {
            type: 'number',
            description: 'Per minute wait time',
            group: 'time',
          },
          minimumFee: {
            type: 'number',
            description: 'Minimum delivery fee',
            group: 'time',
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

      // Default Driver Payout (for auto-calculation)
      defaultPayout: {
        type: 'object',
        title: 'Default Driver Payout',
        collapsible: true,
        description: 'Used for auto-calculating driver pay',
        properties: {
          basePay: {
            type: 'number',
            description: 'Base pay per delivery',
            group: 'base',
          },
          perMile: {
            type: 'number',
            description: 'Per mile pay',
            group: 'base',
          },
          perMinuteWait: {
            type: 'number',
            description: 'Wait time pay per minute',
            group: 'time',
          },
          minimumPay: {
            type: 'number',
            description: 'Minimum pay per delivery',
            group: 'time',
          },
          tipShare: {
            type: 'number',
            default: 100,
            description: 'Percentage of tips driver keeps',
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
    },
    required: ['name'],
  } as const;
};

const sc = DeliveryConfigSchema();
export type DeliveryConfigModel = FromSchema<typeof sc>;

registerCollection('Delivery Config', DataType.delivery_config, DeliveryConfigSchema());
