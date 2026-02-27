import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';
import { getCountryDropDownOptions } from '../../data';

export const SFShippingConfigSchema = () => {
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
        description: 'Use as default shipping configuration',
        group: 'status',
      },
      method: {
        type: 'string',
        enum: ['free', 'flat', 'weight', 'zone', 'carrier'],
        default: 'flat',
        description: 'free=no cost, flat=single rate, weight=by weight tiers, zone=by region, carrier=real-time rates',
        group: 'method',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'method',
      },

      // Origin / Ship From Configuration
      origin: {
        type: 'object',
        title: 'Ship From',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['location', 'manual'],
            default: 'location',
            description: 'Use business location or enter address manually',
            group: 'origin-type',
          },
          location: {
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
            group: 'origin-type',
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

      // Flat Rate Configuration
      flatRate: {
        type: 'object',
        title: 'Flat Rate Settings',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{method}}', valueB: 'flat', action: 'hide' },
        ],
        properties: {
          rate: {
            type: 'number',
            description: 'Flat shipping rate',
            group: 'flat-rate',
          },
          perItem: {
            type: 'boolean',
            default: false,
            description: 'Charge per item instead of per order',
            group: 'flat-rate',
          },
        },
      },

      // Size & Weight Based Rate Configuration
      rates: {
        type: 'object',
        title: 'Size & Weight Based Rates',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{method}}', valueB: 'weight', action: 'hide' },
        ],
        properties: {
          weightUnit: {
            type: 'string',
            enum: ['lb', 'kg'],
            default: 'lb',
            group: 'units',
          },
          dimensionUnit: {
            type: 'string',
            enum: ['in', 'cm'],
            default: 'in',
            group: 'units',
          },
          tiers: {
            type: 'array',
            title: 'Rate Tiers',
            description: 'Rates are matched in order - first matching tier is used',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Tier name (e.g., Small, Medium, Large, Freight)',
                  group: 'tier-name',
                },
                maxWeight: {
                  type: 'number',
                  description: 'Maximum weight',
                  group: 'tier-weight',
                },
                maxLength: {
                  type: 'number',
                  description: 'Maximum length (longest side)',
                  group: 'tier-size',
                },
                maxWidth: {
                  type: 'number',
                  description: 'Maximum width',
                  group: 'tier-size',
                },
                maxHeight: {
                  type: 'number',
                  description: 'Maximum height',
                  group: 'tier-size',
                },
                maxGirth: {
                  type: 'number',
                  description: 'Maximum girth (L + 2*(W+H))',
                  group: 'tier-size',
                },
                rate: {
                  type: 'number',
                  description: 'Shipping cost',
                  group: 'tier-rate',
                },
              },
            },
          },
          defaultRate: {
            type: 'number',
            description: 'Rate for packages exceeding all tiers (oversized/freight)',
          },
        },
      },

      // Zone-Based Rate Configuration
      zoneRates: {
        type: 'object',
        title: 'Zone-Based Rates',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{method}}', valueB: 'zone', action: 'hide' },
        ],
        properties: {
          zones: {
            type: 'array',
            title: 'Shipping Zones',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  group: 'zone-def',
                },
                countries: {
                  type: 'array',
                  'x-control': ControlType.selectMany,
                  'x-control-variant': 'chip',
                  dataSource: {
                    source: 'json',
                    json: getCountryDropDownOptions(),
                  },
                  items: { type: 'string' },
                  group: 'zone-def',
                },
                states: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'State/province codes (e.g., TX, CA, NY)',
                },
                rate: {
                  type: 'number',
                  description: 'Shipping cost for this zone',
                  group: 'zone-rate',
                },
                freeThreshold: {
                  type: 'number',
                  description: 'Free shipping above this order amount (0 to disable)',
                  group: 'zone-rate',
                },
              },
            },
          },
          defaultRate: {
            type: 'number',
            description: 'Rate for destinations not in any zone',
          },
        },
      },

      // Carrier Integration Configuration
      carrier: {
        type: 'object',
        title: 'Carrier Settings',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{method}}', valueB: 'carrier', action: 'hide' },
        ],
        properties: {
          integration: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.config,
              filter: {
                property: 'useCases',
                operation: 'contains',
                value: 'Shipping',
              },
              value: 'name',
              label: 'name',
            },
            description: 'Shipping integration (EasyPost, Shippo, etc.)',
            group: 'carrier-config',
          },
          configId: {
            type: 'string',
            default: 'default',
            description: 'Integration config ID',
            group: 'carrier-config',
          },
          allowedServices: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: { type: 'string' },
            dataSource: {
              source: 'json',
              json: [
                // FedEx
                'FEDEX_GROUND',
                'FEDEX_HOME_DELIVERY',
                'FEDEX_EXPRESS_SAVER',
                'FEDEX_2_DAY',
                'FEDEX_2_DAY_AM',
                'FEDEX_PRIORITY_OVERNIGHT',
                'FEDEX_STANDARD_OVERNIGHT',
                'FEDEX_FIRST_OVERNIGHT',
                'FEDEX_FREIGHT_ECONOMY',
                'FEDEX_FREIGHT_PRIORITY',
                // UPS
                'UPS_GROUND',
                'UPS_3_DAY_SELECT',
                'UPS_2ND_DAY_AIR',
                'UPS_2ND_DAY_AIR_AM',
                'UPS_NEXT_DAY_AIR_SAVER',
                'UPS_NEXT_DAY_AIR',
                'UPS_NEXT_DAY_AIR_EARLY',
                // USPS
                'USPS_FIRST_CLASS',
                'USPS_PRIORITY',
                'USPS_EXPRESS',
                'USPS_PARCEL_SELECT',
                'USPS_MEDIA_MAIL',
                // DHL
                'DHL_EXPRESS_WORLDWIDE',
                'DHL_EXPRESS_12',
                'DHL_ECONOMY_SELECT',
              ],
            },
            description: 'Allowed carrier services to offer',
          },
          markup: {
            type: 'number',
            description: 'Add to carrier rate (fixed amount)',
            group: 'carrier-markup',
          },
          markupPercent: {
            type: 'number',
            description: 'Add to carrier rate (percentage)',
            group: 'carrier-markup',
          },
        },
      },

      // Free Shipping Rules
      freeShipping: {
        type: 'object',
        title: 'Free Shipping Rules',
        collapsible: true,
        properties: {
          enabled: {
            type: 'boolean',
            default: false,
            group: 'free-shipping',
          },
          threshold: {
            type: 'number',
            description: 'Order amount for free shipping',
            group: 'free-shipping',
          },
          countries: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: {
              source: 'json',
              json: getCountryDropDownOptions(),
            },
            items: { type: 'string' },
            description: 'Limit free shipping to these countries (empty = all)',
          },
        },
      },

      // Markup (applies to all methods to mark up shipping cost to customer)
      markup: {
        type: 'object',
        title: 'Shipping Markup',
        description: 'Add margin to shipping cost charged to customer',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['none', 'fixed', 'percentage', 'both'],
            default: 'none',
            description: 'How to apply markup to shipping cost',
            group: 'markup',
          },
          fixedAmount: {
            type: 'number',
            description: 'Fixed amount to add (e.g., $2.00)',
            group: 'markup',
            rules: [
              { operation: 'equal', valueA: '{{type}}', valueB: 'none', action: 'hide' },
              { operation: 'equal', valueA: '{{type}}', valueB: 'percentage', action: 'hide' },
            ],
          },
          percentage: {
            type: 'number',
            description: 'Percentage to add (e.g., 15 for 15%)',
            group: 'markup',
            rules: [
              { operation: 'equal', valueA: '{{type}}', valueB: 'none', action: 'hide' },
              { operation: 'equal', valueA: '{{type}}', valueB: 'fixed', action: 'hide' },
            ],
          },
          roundUp: {
            type: 'boolean',
            default: false,
            description: 'Round up to nearest dollar',
            group: 'markup',
            rules: [
              { operation: 'equal', valueA: '{{type}}', valueB: 'none', action: 'hide' },
            ],
          },
        },
      },

      // Default Parcel (fallback when product doesn't define parcel dimensions)
      defaultParcel: {
        type: 'object',
        title: 'Default Parcel Dimensions',
        description: 'Used when product does not have parcel dimensions defined',
        collapsible: true,
        properties: {
          weight: {
            type: 'number',
            description: 'Default weight',
            group: 'parcel-weight',
          },
          weightUnit: {
            type: 'string',
            enum: ['lb', 'kg', 'oz', 'g'],
            default: 'lb',
            group: 'parcel-weight',
          },
          length: {
            type: 'number',
            description: 'Default length (longest side)',
            group: 'parcel-dimensions',
          },
          width: {
            type: 'number',
            description: 'Default width',
            group: 'parcel-dimensions',
          },
          height: {
            type: 'number',
            description: 'Default height',
            group: 'parcel-dimensions',
          },
          dimensionUnit: {
            type: 'string',
            enum: ['in', 'cm'],
            default: 'in',
            group: 'parcel-dimensions',
          },
        },
      },

      // Box Sizes for bin-packing
      boxSizes: {
        type: 'object',
        title: 'Shipping Box Sizes',
        description: 'Define available box sizes. If empty, standard carrier boxes are used.',
        collapsible: true,
        properties: {
          source: {
            type: 'string',
            enum: ['custom', 'carrier'],
            default: 'carrier',
            description: 'custom = seller-defined boxes only, carrier = standard carrier boxes',
          },
          boxes: {
            type: 'array',
            title: 'Custom Box Sizes',
            rules: [{ operation: 'equal', valueA: '{{source}}', valueB: 'carrier', action: 'hide' }],
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', group: 'box-name' },
                length: { type: 'number', group: 'box-dims' },
                width: { type: 'number', group: 'box-dims' },
                height: { type: 'number', group: 'box-dims' },
                dimensionUnit: { type: 'string', enum: ['in', 'cm'], default: 'in', group: 'box-dims' },
                maxWeight: { type: 'number', description: 'Max weight capacity', group: 'box-weight' },
                weightUnit: { type: 'string', enum: ['lb', 'kg'], default: 'lb', group: 'box-weight' },
              },
            },
          },
        },
      },

      // Handling Fees
      handling: {
        type: 'object',
        title: 'Handling Fees',
        collapsible: true,
        properties: {
          feePerOrder: {
            type: 'number',
            description: 'Additional fee per order',
            group: 'handling',
          },
          feePerItem: {
            type: 'number',
            description: 'Additional fee per item',
            group: 'handling',
          },
        },
      },

      // Restrictions
      restrictions: {
        type: 'object',
        title: 'Shipping Restrictions',
        collapsible: true,
        properties: {
          excludeCountries: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: {
              source: 'json',
              json: getCountryDropDownOptions(),
            },
            items: { type: 'string' },
            description: 'Countries where shipping is not available',
          },
          excludeStates: {
            type: 'array',
            items: { type: 'string' },
            description: 'States/regions where shipping is not available',
          },
          maxWeight: {
            type: 'number',
            description: 'Maximum weight allowed for this method',
            group: 'restrictions',
          },
          maxWeightUnit: {
            type: 'string',
            enum: ['lb', 'kg', 'oz', 'g'],
            default: 'lb',
            group: 'restrictions',
          },
          requiresSignature: {
            type: 'boolean',
            default: false,
            group: 'requirements',
          },
          allowPOBox: {
            type: 'boolean',
            default: true,
            group: 'requirements',
          },
        },
      },

      // Delivery Estimates
      delivery: {
        type: 'object',
        title: 'Delivery Estimates',
        collapsible: true,
        properties: {
          minDays: {
            type: 'number',
            description: 'Minimum delivery days',
            group: 'delivery',
          },
          maxDays: {
            type: 'number',
            description: 'Maximum delivery days',
            group: 'delivery',
          },
          displayText: {
            type: 'string',
            description: 'Custom delivery text (e.g., "3-5 business days")',
          },
        },
      },
    },
    required: ['name', 'method'],
  } as const;
};

const sc = SFShippingConfigSchema();
export type SFShippingConfigModel = FromSchema<typeof sc>;

registerCollection(
  'Shipping Configuration',
  DataType.sf_shipping_config,
  SFShippingConfigSchema()
);
