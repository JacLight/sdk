import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFDiscountSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        transform: 'uri',
        group: 'general',
      },
      description: {
        type: 'string',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive'],
        default: 'draft',
        group: 'general',
      },
      priority: {
        type: 'number',
        default: 0,
        description: 'Higher priority applied first',
        group: 'general',
      },

      // Auto-apply or coupon code
      autoApply: {
        type: 'boolean',
        default: false,
        description: 'Apply automatically when conditions met (no code needed)',
        group: 'type',
      },
      code: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        description: 'Coupon code (required if not auto-apply)',
        group: 'type',
        rules: [
          { operation: 'equal', valueA: '{{autoApply}}', valueB: true, action: 'hide' },
        ],
      },
      stackable: {
        type: 'boolean',
        default: false,
        description: 'Can combine with other discounts',
        group: 'type',
      },

      // Discount type and value
      discountType: {
        type: 'string',
        enum: ['percentage', 'amount', 'fixed_price', 'buy_x_get_y', 'free_shipping'],
        default: 'percentage',
        group: 'discount',
      },
      value: {
        type: 'number',
        description: 'Discount value (% or amount)',
        group: 'discount',
        rules: [
          { operation: 'equal', valueA: '{{discountType}}', valueB: 'buy_x_get_y', action: 'hide' },
          { operation: 'equal', valueA: '{{discountType}}', valueB: 'free_shipping', action: 'hide' },
        ],
      },

      // Buy X Get Y configuration
      buyXGetY: {
        type: 'object',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{discountType}}', valueB: 'buy_x_get_y', action: 'hide' },
        ],
        properties: {
          buyQty: {
            type: 'number',
            minimum: 1,
            default: 2,
            description: 'Buy this many',
            group: 'bxgy',
          },
          getQty: {
            type: 'number',
            minimum: 1,
            default: 1,
            description: 'Get this many',
            group: 'bxgy',
          },
          getDiscount: {
            type: 'number',
            default: 100,
            description: '% off the "get" items (100 = free)',
            group: 'bxgy',
          },
          getProducts: {
            type: 'array',
            description: 'Products for "get" (empty = same as buy products)',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: {
              source: 'collection',
              collection: DataType.sf_product,
              value: 'sku',
              label: 'name',
            },
          },
        },
      },

      // Schedule
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

      // Usage limits
      usageLimit: {
        type: 'number',
        description: 'Max total uses (empty = unlimited)',
        group: 'limits',
      },
      usageLimitPerCustomer: {
        type: 'number',
        description: 'Max uses per customer',
        group: 'limits',
      },
      usageCount: {
        type: 'number',
        default: 0,
        readOnly: true,
        group: 'limits',
      },

      // Conditions for auto-apply
      conditions: {
        type: 'object',
        collapsible: true,
        description: 'Conditions that must be met for discount to apply',
        properties: {
          // Customer conditions
          isFirstOrder: {
            type: 'boolean',
            description: 'Only for first-time customers',
            group: 'customer-conditions',
          },
          minOrderCount: {
            type: 'number',
            description: 'Minimum previous orders (returning customers)',
            group: 'customer-conditions',
          },
          minAccountAgeDays: {
            type: 'number',
            description: 'Minimum account age in days',
            group: 'customer-conditions',
          },
          customerTier: {
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
            group: 'customer-conditions',
          },
          // Cart conditions
          minCartValue: {
            type: 'number',
            description: 'Minimum cart value',
            group: 'cart-conditions',
          },
          minCartQuantity: {
            type: 'number',
            description: 'Minimum items in cart',
            group: 'cart-conditions',
          },
          requiredProducts: {
            type: 'array',
            description: 'Cart must contain these products',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: {
              source: 'collection',
              collection: DataType.sf_product,
              value: 'sku',
              label: 'name',
            },
            group: 'cart-conditions',
          },
        },
      },

      // What discount applies to
      applyTo: {
        type: 'string',
        enum: ['cart', 'products', 'categories', 'shipping'],
        default: 'cart',
        description: 'What the discount applies to',
        group: 'scope',
      },
      products: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: 'name',
        },
        rules: [
          { operation: 'notEqual', valueA: '{{applyTo}}', valueB: 'products', action: 'hide' },
        ],
        group: 'scope',
      },
      categories: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
        },
        rules: [
          { operation: 'notEqual', valueA: '{{applyTo}}', valueB: 'categories', action: 'hide' },
        ],
        group: 'scope',
      },
      excludeProducts: {
        type: 'array',
        description: 'Exclude these products from discount',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: 'name',
        },
        group: 'scope',
      },

      // Customer targeting (in addition to conditions)
      customerGroups: {
        type: 'array',
        description: 'Limit to specific customer groups',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          value: 'name',
          label: 'name',
        },
        group: 'targeting',
      },
      customers: {
        type: 'array',
        description: 'Limit to specific customers',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'email',
          label: 'name',
        },
        group: 'targeting',
      },
    },
  } as const;
};

const ms = SFDiscountSchema();
export type SFDiscountModel = FromSchema<typeof ms>;

registerCollection(
  'Store Discount',
  DataType.sf_discount,
  SFDiscountSchema()
);
