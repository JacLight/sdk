import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const DeliveryZoneSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 2,
        maxLength: 100,
        unique: true,
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

      // Geography
      geography: {
        type: 'object',
        title: 'Zone Boundaries',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['polygon', 'radius', 'zipcodes', 'cities'],
            default: 'polygon',
            group: 'geo-type',
          },
          // Polygon - array of coordinates
          polygon: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                lat: { type: 'number', group: 'coord' },
                lng: { type: 'number', group: 'coord' },
              },
            },
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'polygon', action: 'hide' },
            ],
          },
          // Radius - center point + miles
          center: {
            type: 'object',
            properties: {
              lat: { type: 'number', group: 'center' },
              lng: { type: 'number', group: 'center' },
            },
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'radius', action: 'hide' },
            ],
          },
          radius: {
            type: 'number',
            description: 'Radius in miles',
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'radius', action: 'hide' },
            ],
          },
          // Zipcodes
          zipcodes: {
            type: 'array',
            items: { type: 'string' },
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'zipcodes', action: 'hide' },
            ],
          },
          // Cities
          cities: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                city: { type: 'string', group: 'city' },
                state: { type: 'string', group: 'city' },
                country: { type: 'string', group: 'city' },
              },
            },
            rules: [
              { operation: 'notEqual', valueA: '{{type}}', valueB: 'cities', action: 'hide' },
            ],
          },
        },
      },

      // Operating Hours
      operatingHours: {
        type: 'object',
        title: 'Operating Hours',
        collapsible: true,
        properties: {
          timezone: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'function',
              value: 'timezones',
            },
          },
          schedule: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                day: {
                  type: 'string',
                  enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
                  group: 'day',
                },
                enabled: {
                  type: 'boolean',
                  default: true,
                  group: 'day',
                },
                openTime: {
                  type: 'string',
                  'x-control-variant': 'time',
                  'x-control': ControlType.date,
                  group: 'hours',
                },
                closeTime: {
                  type: 'string',
                  'x-control-variant': 'time',
                  'x-control': ControlType.date,
                  group: 'hours',
                },
              },
            },
          },
          holidays: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'date',
                  'x-control': ControlType.date,
                  group: 'holiday',
                },
                name: {
                  type: 'string',
                  group: 'holiday',
                },
                closed: {
                  type: 'boolean',
                  default: true,
                },
              },
            },
          },
        },
      },

      // Zone-specific Pricing (overrides config)
      pricing: {
        type: 'object',
        title: 'Zone Pricing',
        collapsible: true,
        description: 'Override default pricing for this zone',
        properties: {
          baseFee: {
            type: 'number',
            group: 'base',
          },
          perMile: {
            type: 'number',
            group: 'base',
          },
          minimumFee: {
            type: 'number',
            group: 'min',
          },
        },
      },

      // Zone-specific Driver Payout (overrides config)
      payout: {
        type: 'object',
        title: 'Zone Payout',
        collapsible: true,
        description: 'Override default driver payout for this zone',
        properties: {
          basePay: {
            type: 'number',
            group: 'base',
          },
          perMile: {
            type: 'number',
            group: 'base',
          },
          minimumPay: {
            type: 'number',
          },
        },
      },

      // Current Surge
      surge: {
        type: 'object',
        title: 'Surge Status',
        properties: {
          active: {
            type: 'boolean',
            default: false,
            group: 'surge',
          },
          multiplier: {
            type: 'number',
            default: 1,
            description: 'Current surge multiplier',
            group: 'surge',
          },
          reason: {
            type: 'string',
            enum: ['demand', 'weather', 'event', 'manual'],
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
            'x-control': ControlType.date,
          },
        },
      },

      // Stats (read-only, updated by system)
      stats: {
        type: 'object',
        title: 'Zone Statistics',
        collapsible: true,
        readOnly: true,
        properties: {
          activeAgents: {
            type: 'number',
            default: 0,
            group: 'agents',
          },
          onlineAgents: {
            type: 'number',
            default: 0,
            group: 'agents',
          },
          pendingJobs: {
            type: 'number',
            default: 0,
            group: 'jobs',
          },
          activeJobs: {
            type: 'number',
            default: 0,
            group: 'jobs',
          },
          avgDeliveryTime: {
            type: 'number',
            description: 'Average delivery time in minutes',
          },
          demandRatio: {
            type: 'number',
            description: 'Jobs per available agent',
          },
        },
      },

      // Restrictions
      restrictions: {
        type: 'object',
        title: 'Zone Restrictions',
        collapsible: true,
        properties: {
          maxWeight: {
            type: 'number',
            description: 'Maximum item weight (lbs)',
            group: 'limits',
          },
          maxDimensions: {
            type: 'object',
            properties: {
              length: { type: 'number', group: 'dim' },
              width: { type: 'number', group: 'dim' },
              height: { type: 'number', group: 'dim' },
            },
          },
          allowedVehicles: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: { type: 'string' },
            dataSource: {
              source: 'json',
              json: ['car', 'motorcycle', 'bicycle', 'scooter', 'van', 'truck', 'drone', 'robot', 'walk'],
            },
          },
          blockedCategories: {
            type: 'array',
            items: { type: 'string' },
            description: 'Item categories not allowed in this zone',
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const sc = DeliveryZoneSchema();
export type DeliveryZoneModel = FromSchema<typeof sc>;

registerCollection('Delivery Zone', DataType.delivery_zone, DeliveryZoneSchema());
