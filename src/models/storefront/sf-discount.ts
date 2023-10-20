import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';

export const SFDiscountSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        transform: 'uri',
      },
      code: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$'
      },
      active: {
        type: 'boolean',
      },
      description: {
        type: 'string',
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
      usePerUser: {
        type: 'number',
      },
      sku: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: 'sku',
        },
      },
      category: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
        },
      },
      customer: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'username',
          label: 'username',
        },
      },
      group: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
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

export const SFDiscountUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
          '1': '/properties/code',
          '2': '/properties/active',
        },
        {
          '0': '/properties/description',
        },
        {
          '0': '/properties/start',
          '1': '/properties/end',
        },
        {
          '0': '/properties/discountType',
          '1': '/properties/discount',
          '2': '/properties/usePerUser',
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
  ]
};
export const SFDiscountRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Discount',
  DataType.sf_discount,
  SFDiscountSchema(),
  SFDiscountUI(),
  SFDiscountRules(),
  true
);
