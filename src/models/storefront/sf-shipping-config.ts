import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';
import { getCountryDropDownOptions } from '../../data';

// One list for both sides: a product declares one, an option carries them.
export const SHIPPING_CLASSES = ['freight', 'oversize', 'fragile', 'hazmat', 'refrigerated'] as const;

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
      options: {
        type: 'array',
        title: 'Shipping Options',
        collapsible: true,
        description: 'Local, regional, international, flat fee, freight, pickup — each with the criteria that select it.',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'What the customer sees — "Local delivery", "Standard", "International"', group: 'opt-id' },
            status: { type: 'string', enum: ['active', 'inactive'], default: 'active', group: 'opt-id' },
            priority: { type: 'number', default: 0, description: 'Breaks ties between equally specific options', group: 'opt-id' },

            countries: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              dataSource: { source: 'json', json: getCountryDropDownOptions() },
              items: { type: 'string' },
              description: 'Empty = anywhere',
              group: 'opt-where',
            },
            states: { type: 'array', items: { type: 'string' }, description: 'State / province codes', group: 'opt-where' },
            postcodes: { type: 'array', items: { type: 'string' }, description: 'Exact, prefix (750*) or range (75000-75999)', group: 'opt-where' },

            productClasses: {
              type: 'array',
              items: { type: 'string', enum: [...SHIPPING_CLASSES] },
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              description: 'Shipping classes this carries. Empty = ordinary goods.',
              notes: 'Must match what products declare in Ships As.',
              group: 'opt-class',
            },

            minWeight: { type: 'number', group: 'opt-size' },
            maxWeight: { type: 'number', group: 'opt-size' },
            weightUnit: { type: 'string', enum: ['lb', 'kg'], default: 'lb', group: 'opt-size' },
            minQuantity: { type: 'number', group: 'opt-size' },
            maxQuantity: { type: 'number', group: 'opt-size' },
            minOrderTotal: { type: 'number', group: 'opt-size' },
            maxOrderTotal: { type: 'number', group: 'opt-size' },

            method: { type: 'string', enum: ['free', 'flat', 'weight', 'carrier', 'pickup'], default: 'flat', group: 'opt-method' },
            rate: { type: 'number', description: 'The flat fee, when the method is flat', group: 'opt-method' },
            perItem: { type: 'boolean', default: false, description: 'Charge the fee per item', group: 'opt-method' },
            freeOver: { type: 'number', description: 'Free above this order value', group: 'opt-method' },
            currency: { type: 'string', description: 'Overrides the configuration currency', group: 'opt-method' },

            tiers: {
              type: 'array',
              description: 'Weight tiers, when the method is weight',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  maxWeight: { type: 'number' },
                  maxLength: { type: 'number' },
                  maxWidth: { type: 'number' },
                  maxHeight: { type: 'number' },
                  maxGirth: { type: 'number' },
                  rate: { type: 'number' },
                },
              },
              group: 'opt-tiers',
            },
            carrier: {
              type: 'object',
              description: 'Live rates, when the method is carrier',
              properties: {
                integration: { type: 'string', description: 'Shipping integration (EasyPost, Shippo…)' },
                allowedServices: {
                  type: 'array',
                  items: { type: 'string' },
                  'x-control': ControlType.selectMany,
                  'x-control-variant': 'chip',
                  description: 'Only these services — this is where "FedEx Ground but never USPS" lives',
                },
              },
              group: 'opt-carrier',
            },
            pickup: {
              type: 'object',
              description: 'Collection, when the method is pickup',
              properties: {
                locations: {
                  type: 'array',
                  items: { type: 'string' },
                  'x-control': ControlType.selectMany,
                  'x-control-variant': 'chip',
                  dataSource: { source: 'collection', collection: DataType.location, value: 'name', label: 'name' },
                },
                fee: { type: 'number', default: 0 },
                readyInHours: { type: 'number' },
                instructions: { type: 'string' },
              },
              group: 'opt-pickup',
            },

            minDays: { type: 'number', group: 'opt-eta' },
            maxDays: { type: 'number', group: 'opt-eta' },
          },
        },
      },

      applies: {
        type: 'object',
        title: 'Applies To',
        collapsible: true,
        group: 'applies',
        properties: {
          countries: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: { source: 'json', json: getCountryDropDownOptions() },
            items: { type: 'string' },
            description: 'Leave empty for every country',
            group: 'applies-where',
          },
          states: {
            type: 'array',
            items: { type: 'string' },
            description: 'State / province codes (TX, ON, NSW). Leave empty for the whole country.',
            group: 'applies-where',
          },
          postcodes: {
            type: 'array',
            items: { type: 'string' },
            description: 'Exact (75001), prefix (750*), or range (75000-75999)',
            group: 'applies-where',
          },
          minWeight: { type: 'number', description: 'Applies from this total weight up', group: 'applies-weight' },
          maxWeight: { type: 'number', description: 'Applies below this total weight', group: 'applies-weight' },
          weightUnit: { type: 'string', enum: ['lb', 'kg'], default: 'lb', group: 'applies-weight' },
          minQuantity: { type: 'number', description: 'Applies from this many items up', group: 'applies-qty' },
          maxQuantity: { type: 'number', description: 'Applies below this many items', group: 'applies-qty' },
          minOrderTotal: { type: 'number', description: 'Applies from this order value up', group: 'applies-total' },
          maxOrderTotal: { type: 'number', description: 'Applies below this order value', group: 'applies-total' },
          productClasses: {
            type: 'array',
            items: { type: 'string', enum: [...SHIPPING_CLASSES] },
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            description: 'Shipping classes this carries. Empty = ordinary goods with no class.',
            notes: 'Must match what products declare in Ships As.',
            group: 'applies-class',
          },
          priority: {
            type: 'number',
            default: 0,
            description: 'Breaks ties between configurations of equal specificity — higher wins',
            group: 'applies-priority',
          },
        },
      },
      method: {
        type: 'string',
        enum: ['free', 'flat', 'weight', 'carrier', 'pickup'],
        default: 'flat',
        description:
          'free=no cost, flat=single rate, weight=by weight tiers, carrier=real-time rates, pickup=collect in person. ' +
          'Region is not a method — scope the configuration with "Applies To".',
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

      pickup: {
        type: 'object',
        title: 'Pickup / Collect In Store',
        collapsible: true,
        rules: [{ operation: 'notEqual', valueA: '{{method}}', valueB: 'pickup', action: 'hide' }],
        properties: {
          locations: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: { source: 'collection', collection: DataType.location, value: 'name', label: 'name' },
            items: { type: 'string' },
            description: 'Where the order can be collected. Empty means every location.',
            group: 'pickup-where',
          },
          fee: { type: 'number', default: 0, description: 'Charge for collecting, if any', group: 'pickup-fee' },
          readyInHours: { type: 'number', description: 'How long before it is ready to collect', group: 'pickup-fee' },
          instructions: { type: 'string', 'x-control-variant': 'textarea', description: 'Shown to whoever is collecting' },
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
              filter: { 'data.useCases': 'Shipping' },
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
