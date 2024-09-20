import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType, FormViewSectionType } from '../../types';

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

export const SFGiftCardUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
          '1': '/properties/forSale',
        },
        {
          '0': '/properties/serial',
          '1': '/properties/batch',
          '2': '/properties/code',
        },
        {
          '0': '/properties/amount',
          '1': '/properties/amountUsed',
          '2': '/properties/noOfUse',
        },
        {
          '0': '/properties/type',
          '1': '/properties/status',
          '2': '/properties/noOfUse',
        },
      ],
    },
    {
      type: FormViewSectionType.sectiontable,
      collapsible: true,
      title: 'Allowed Uses',
      items: [
        {
          '0': '/properties/sku',
        },
        {
          '0': '/properties/category',
        },
        {
          '0': '/properties/group',
        },
        {
          '0': '/properties/customer',
        },
      ],
    },
    {
      type: FormViewSectionType.sectiontable,
      collapsible: true,
      title: 'Use History',
      items: [
        {
          '0': '/properties/boughtBy',
          '1': '/properties/boughtDate',
          '2': '/properties/agent',
        },
        {
          '0': '/properties/uses',
        },
      ],
    },
  ]
};
export const SFGiftCardRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Gift Card',
  DataType.sf_giftcard,
  SFGiftCardSchema(),
  SFGiftCardUI(),
  SFGiftCardRules(),
  true
);
