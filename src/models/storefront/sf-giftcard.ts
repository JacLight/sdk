import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFGiftCardSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      serial: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        readOnly: true,
      },
      batch: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        readOnly: true,
      },
      code: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        readOnly: true,
      },
      noOfUse: {
        type: 'number',
      },
      forSale: {
        type: 'boolean',
      },
      amount: { type: 'number' },
      type: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['new', 'bought', 'sold', 'used', 'expired', 'cancelled', 'refunded',],
      },
      agent: { type: 'string' },
      boughtBy: { type: 'string' },
      boughtDate: { type: 'string' },
      amountUsed: { type: 'number', readOnly: true },
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
      uses: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            user: { type: 'string' },
            date: { type: 'string' },
            amount: { type: 'number' },
            orderNumber: { type: 'string' },
          },
        },
      },
    },
  } as const;
};
const ms = SFGiftCardSchema();
export type SFGiftCardModel = FromSchema<typeof ms>;

registerCollection(
  'Store Gift Card',
  DataType.sf_giftcard,
  SFGiftCardSchema(),
);
