import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFPromotionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['new', 'active', 'running', 'expired', 'disabled'],
      },
      start: {
        type: 'string',
        format: 'date-time',
      },
      end: {
        type: 'string',
        format: 'date-time',
      },
      discountType: {
        type: 'string',
        enum: ['amount', 'percentage'],
      },
      discount: {
        type: 'number',
      },
      sku: {
        type: 'string',
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
        type: 'string',
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
        type: 'string',
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
        type: 'string',
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

const ms = SFPromotionSchema();
export type SFPromotionModel = FromSchema<typeof ms>;

registerCollection(
  'Store Promotion',
  DataType.sf_promotion,
  SFPromotionSchema(),
);
