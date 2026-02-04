import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * Simplified Discount Schema
 */
export const SFDiscountSchema = () => {
  return {
    type: 'object',
    properties: {
      // Row 1: name, status
      name: {
        type: 'string',
        transform: 'uri',
        group: 'row1',
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive'],
        default: 'draft',
        group: 'row1',
      },

      // Row 2: code, priority, stackable
      code: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        description: 'Coupon code (leave empty for auto-apply)',
        group: 'row2',
      },
      priority: {
        type: 'number',
        default: 0,
        description: 'Higher = applied first',
        group: 'row2',
      },
      stackable: {
        type: 'boolean',
        default: false,
        description: 'Can combine with other discounts',
        group: 'row2',
      },

      // Row 3: description
      description: {
        type: 'string',
        group: 'row3',
      },

      // Row 4: type, value, maxDiscount
      type: {
        type: 'string',
        enum: ['percent', 'fixed', 'free_shipping', 'buy_x_get_y'],
        default: 'percent',
        group: 'row4',
      },
      value: {
        type: 'number',
        description: 'Discount amount (% or $)',
        group: 'row4',
      },
      maxDiscount: {
        type: 'number',
        description: 'Cap discount at this amount (for %)',
        group: 'row4',
      },

      // Row 5: Buy X Get Y (collapsible)
      buyXGetY: {
        type: 'object',
        collapsible: true,
        group: 'row5',
        properties: {
          buyQty: { type: 'number', default: 2, description: 'Buy this many' },
          getQty: { type: 'number', default: 1, description: 'Get this many' },
          getPercent: { type: 'number', default: 100, description: '% off (100 = free)' },
        },
        rules: [{ operation: 'notEqual', valueA: '{{type}}', valueB: 'buy_x_get_y', action: 'hide' }],
      },

      // Row 6: applyTo, products, categories
      applyTo: {
        type: 'string',
        enum: ['cart', 'products', 'categories'],
        default: 'cart',
        group: 'row6',
      },
      products: {
        type: 'array',
        description: 'Apply to these products',
        'x-control': ControlType.lookup,
        dataSource: { source: 'collection', collection: DataType.sf_product, value: 'sku', label: 'name' },
        group: 'row6',
        rules: [{ operation: 'notEqual', valueA: '{{applyTo}}', valueB: 'products', action: 'hide' }],
      },
      categories: {
        type: 'array',
        description: 'Apply to these categories',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'collection', collection: DataType.category, value: 'name', label: 'name' },
        group: 'row6',
        rules: [{ operation: 'notEqual', valueA: '{{applyTo}}', valueB: 'categories', action: 'hide' }],
      },

      // Row 7: excludeProducts
      excludeProducts: {
        type: 'array',
        description: 'Never apply to these products',
        'x-control': ControlType.lookup,
        dataSource: { source: 'collection', collection: DataType.sf_product, value: 'sku', label: 'name' },
        group: 'row7',
      },

      // Row 8: minCartValue, minCartItems, firstOrderOnly
      minCartValue: {
        type: 'number',
        description: 'Minimum cart value required',
        group: 'row8',
      },
      minCartItems: {
        type: 'number',
        description: 'Minimum items in cart',
        group: 'row8',
      },
      firstOrderOnly: {
        type: 'boolean',
        default: false,
        description: 'Only for first-time customers',
        group: 'row8',
      },

      // Row 9: requireProducts
      requireProducts: {
        type: 'array',
        description: 'Cart must contain these products',
        'x-control': ControlType.lookup,
        dataSource: { source: 'collection', collection: DataType.sf_product, value: 'sku', label: 'name' },
        group: 'row9',
      },

      // Row 10: customerGroups, customers
      customerGroups: {
        type: 'array',
        description: 'Limit to these customer groups (empty = all)',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'collection', collection: DataType.customer_group, value: 'name', label: 'name' },
        group: 'row10',
      },
      customers: {
        type: 'array',
        description: 'Limit to specific customers (empty = all)',
        'x-control': ControlType.lookup,
        dataSource: { source: 'collection', collection: DataType.customer, value: 'email', label: 'name' },
        group: 'row10',
      },

      // Row 11: startDate, endDate
      startDate: {
        type: 'string',
        format: 'date-time',
        group: 'row11',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        group: 'row11',
      },

      // Row 12: usageLimit, usageLimitPerCustomer, usageCount
      usageLimit: {
        type: 'number',
        description: 'Max total uses (empty = unlimited)',
        group: 'row12',
      },
      usageLimitPerCustomer: {
        type: 'number',
        description: 'Max uses per customer',
        group: 'row12',
      },
      usageCount: {
        type: 'number',
        default: 0,
        readOnly: true,
        group: 'row12',
      },
    },
  } as const;
};

const ms = SFDiscountSchema();
export type SFDiscountModel = FromSchema<typeof ms>;

registerCollection('Store Discount', DataType.sf_discount, SFDiscountSchema());
