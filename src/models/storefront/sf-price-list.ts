import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFPriceListSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        group: 'name',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'scheduled'],
        default: 'active',
        group: 'name',
      },
      type: {
        type: 'string',
        enum: ['retail', 'wholesale', 'contract', 'promotional'],
        default: 'retail',
        description: 'Pricing type',
        group: 'name',
      },
      priority: {
        type: 'number',
        default: 0,
        description: 'Higher priority price lists are applied first',
        group: 'name',
      },
      autoApply: {
        type: 'boolean',
        default: false,
        description: 'Automatically apply to eligible customers',
        group: 'name',
      },
      description: {
        type: 'string',
      },

      // Date range for scheduled price lists
      startDate: {
        type: 'string',
        format: 'date-time',
        group: 'schedule',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        group: 'schedule',
      },

      // Eligibility conditions (for auto-apply)
      eligibility: {
        type: 'object',
        collapsible: true,
        description: 'Conditions for customers to qualify for this pricing',
        rules: [
          { operation: 'notEqual', valueA: '{{autoApply}}', valueB: true, action: 'hide' },
        ],
        properties: {
          requiresApproval: {
            type: 'boolean',
            default: false,
            description: 'Requires manual approval to use this pricing',
            group: 'eligibility',
          },
          minOrderCount: {
            type: 'number',
            description: 'Minimum previous orders',
            group: 'eligibility',
          },
          minTotalSpent: {
            type: 'number',
            description: 'Minimum lifetime spend',
            group: 'eligibility',
          },
          minAccountAgeDays: {
            type: 'number',
            description: 'Minimum account age in days',
            group: 'eligibility',
          },
          customerTiers: {
            type: 'array',
            description: 'Required customer tier',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: {
              source: 'collection',
              collection: DataType.sf_customer_tier,
              value: 'name',
              label: 'name',
            },
            items: { type: 'string' },
            group: 'eligibility',
          },
        },
      },

      // Customer targeting
      customerGroups: {
        type: 'array',
        description:
          'Apply to specific customer groups (e.g., wholesalers, gold-members)',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.customer_group,
          value: 'name',
          label: 'name',
        },
        items: { type: 'string' },
        group: 'targeting',
      },
      customers: {
        type: 'array',
        description: 'Apply to specific customers',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'email',
          label: 'name',
        },
        items: { type: 'string' },
        group: 'targeting',
      },
      applyTo: {
        type: 'string',
        enum: ['all', 'products', 'categories', 'brands'],
        default: 'all',
        group: 'scope',
      },
      products: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: 'name',
        },
        items: { type: 'string' },
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{applyTo}}',
            valueB: 'products',
            action: 'hide',
          },
        ],
        group: 'scope',
      },
      categories: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
        },
        items: { type: 'string' },
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{applyTo}}',
            valueB: 'categories',
            action: 'hide',
          },
        ],
        group: 'scope',
      },
      brands: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.sf_brand,
          value: 'name',
          label: 'name',
        },
        items: { type: 'string' },
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{applyTo}}',
            valueB: 'brands',
            action: 'hide',
          },
        ],
        group: 'scope',
      },
      // Pricing method
      pricingMethod: {
        type: 'string',
        enum: ['discount', 'fixed', 'markup'],
        default: 'discount',
        description:
          'discount: reduce by %, fixed: set exact price, markup: add % to cost',
        group: 'pricing',
      },
      discountType: {
        type: 'string',
        enum: ['percentage', 'amount'],
        default: 'percentage',
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{pricingMethod}}',
            valueB: 'discount',
            action: 'hide',
          },
        ],
        group: 'pricing',
      },
      discountValue: {
        type: 'number',
        description: 'Discount percentage or fixed amount',
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{pricingMethod}}',
            valueB: 'discount',
            action: 'hide',
          },
        ],
        group: 'pricing',
      },
      markupPercentage: {
        type: 'number',
        description: 'Markup percentage over cost',
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{pricingMethod}}',
            valueB: 'markup',
            action: 'hide',
          },
        ],
        group: 'pricing',
      },
      // Quantity-based tiered pricing
      tieredPricing: {
        type: 'boolean',
        default: false,
        description: 'Enable quantity-based tiered pricing',
        group: 'tiers',
      },
      tiers: {
        type: 'array',
        collapsible: true,
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{tieredPricing}}',
            valueB: true,
            action: 'hide',
          },
        ],
        items: {
          type: 'object',
          properties: {
            minQuantity: {
              type: 'number',
              minimum: 1,
              default: 1,
              group: 'tier',
            },
            maxQuantity: {
              type: 'number',
              group: 'tier',
            },
            discountType: {
              type: 'string',
              enum: ['percentage', 'amount', 'fixed_price'],
              default: 'percentage',
              group: 'tier',
            },
            value: {
              type: 'number',
              description: 'Discount % or amount, or fixed price per unit',
              group: 'tier',
            },
          },
        },
        group: 'tiers',
      },
      // Minimum order requirements
      minimumOrderValue: {
        type: 'number',
        description: 'Minimum order value to qualify for this price list',
        group: 'requirements',
      },
      minimumQuantity: {
        type: 'number',
        description: 'Minimum quantity to qualify for this price list',
        group: 'requirements',
      },
      // Product-specific overrides within this price list
      productPrices: {
        type: 'array',
        collapsible: true,
        description: 'Override prices for specific products',
        items: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.sf_product,
                value: 'sku',
                label: 'name',
              },
              group: 'product',
            },
            price: {
              type: 'number',
              description: 'Fixed price for this product',
              group: 'product',
            },
            tiers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  minQuantity: { type: 'number', group: 'qty' },
                  maxQuantity: { type: 'number', group: 'qty' },
                  price: { type: 'number', group: 'qty' },
                },
              },
            },
          },
        },
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'general',
      },
    },
    required: ['name'],
  } as const;
};

const schema = SFPriceListSchema();
export type SFPriceListModel = FromSchema<typeof schema>;

registerCollection(
  'Pricing Table',
  DataType.sf_price_list,
  SFPriceListSchema()
);
