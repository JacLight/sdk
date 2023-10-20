import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';

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

const ms = SFPromotionSchema();
export type SFPromotionModel = FromSchema<typeof ms>;

export const SFPromotionUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
          '2': '/properties/status',
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
export const SFPromotionRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Promotion',
  DataType.sf_promotion,
  SFPromotionSchema(),
  SFPromotionUI(),
  SFPromotionRules(),
  true
);
