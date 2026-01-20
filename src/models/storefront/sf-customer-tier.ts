import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const SFCustomerTierSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        description: 'Tier name (e.g., Bronze, Silver, Gold, Platinum)',
        group: 'general',
      },
      description: {
        type: 'string',
        group: 'general',
      },
      level: {
        type: 'number',
        minimum: 1,
        default: 1,
        description: 'Tier level (higher = better)',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        group: 'general',
      },

      // How customers qualify for this tier
      qualification: {
        type: 'object',
        collapsible: true,
        description: 'Conditions to automatically qualify (any condition met = qualified)',
        properties: {
          manualOnly: {
            type: 'boolean',
            default: false,
            description: 'Only manually assign customers to this tier',
            group: 'qualify',
          },
          minTotalSpent: {
            type: 'number',
            description: 'Lifetime spend amount',
            group: 'qualify',
            rules: [
              { operation: 'equal', valueA: '{{manualOnly}}', valueB: true, action: 'hide' },
            ],
          },
          minOrderCount: {
            type: 'number',
            description: 'Minimum completed orders',
            group: 'qualify',
            rules: [
              { operation: 'equal', valueA: '{{manualOnly}}', valueB: true, action: 'hide' },
            ],
          },
          minAccountAgeDays: {
            type: 'number',
            description: 'Minimum account age in days',
            group: 'qualify',
            rules: [
              { operation: 'equal', valueA: '{{manualOnly}}', valueB: true, action: 'hide' },
            ],
          },
        },
      },

      // Benefits for this tier
      benefits: {
        type: 'object',
        collapsible: true,
        description: 'Benefits customers get at this tier',
        properties: {
          discountPercent: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Extra % off all purchases',
            group: 'discount',
          },
          freeShipping: {
            type: 'boolean',
            default: false,
            description: 'Free shipping on all orders',
            group: 'shipping',
          },
          freeShippingMinimum: {
            type: 'number',
            description: 'Free shipping on orders over this amount',
            group: 'shipping',
            rules: [
              { operation: 'equal', valueA: '{{freeShipping}}', valueB: true, action: 'hide' },
            ],
          },
          earlyAccess: {
            type: 'boolean',
            default: false,
            description: 'Early access to new products',
            group: 'perks',
          },
          prioritySupport: {
            type: 'boolean',
            default: false,
            description: 'Priority customer support',
            group: 'perks',
          },
          exclusiveProducts: {
            type: 'array',
            description: 'Access to exclusive products',
            'x-control-variant': 'chip',
            dataSource: {
              source: 'collection',
              collection: DataType.sf_product,
              value: 'sku',
              label: 'name',
            },
            items: { type: 'string' },
          },
          bonusPoints: {
            type: 'number',
            description: 'Bonus loyalty points multiplier (e.g., 2 = 2x points)',
            group: 'perks',
          },
        },
      },

      // Display settings
      display: {
        type: 'object',
        collapsible: true,
        properties: {
          color: {
            type: 'string',
            description: 'Badge color (e.g., #FFD700 for gold)',
            group: 'display',
          },
          icon: {
            type: 'string',
            description: 'Icon name or URL',
            group: 'display',
          },
          showBadge: {
            type: 'boolean',
            default: true,
            description: 'Show tier badge to customer',
            group: 'display',
          },
        },
      },
    },
    required: ['name', 'level'],
  } as const;
};

const schema = SFCustomerTierSchema();
export type SFCustomerTierModel = FromSchema<typeof schema>;

registerCollection(
  'Customer Tier',
  DataType.sf_customer_tier,
  SFCustomerTierSchema()
);
