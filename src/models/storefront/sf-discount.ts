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
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive'],
        group: 'general',
      },
      type: {
        type: 'string',
        enum: ['coupon', 'sale'],
        group: 'type',
      },
      code: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        group: 'type',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'coupon', action: 'hide' },
        ]
      },
      noCombination: {
        type: 'boolean',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'coupon', action: 'hide' },
        ],
        group: 'type',
      },
      valueType: {
        type: 'string',
        enum: ['amount', 'percentage'],
        group: 'discount',
      },
      value: {
        type: 'number',
        group: 'discount',
      },
      startDate: {
        type: 'string',
        format: 'date-time',
        group: 'start',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        group: 'start',
      },
      description: {
        type: 'string',
      },
      usageLimit: {
        type: 'number',
        group: 'limits',
      },
      usageCount: {
        type: 'number',
        group: 'limits',
      },
      sku: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: 'sku',
        },
      },
      category: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
        },
      },
      customer: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'username',
          label: 'username',
        },
      },
      group: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          value: 'name',
          label: 'name',
        },
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
