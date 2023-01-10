import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';

export const SFDiscountSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      code: {
        type: 'string',
        pattern: '^[^[a-zA-Z_\-0-9]*$',
      },
      remark: {
        type: 'string',
      },
      start: {
        type: 'string',
        format: 'date-time'
      },
      end: {
        type: 'string',
        format: 'date-time'
      },
      discountType: {
        type: 'string',
        enum: ['amount', 'percentage']
      },
      discount: {
        type: 'number',
      },
      active: {
        type: 'boolean',
      },
      sku: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sk',
          label: 'sku',
        },
      },
      user: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: 'username',
        },
      },
      category: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'sk',
          label: 'name',
        },
      },
      usePerUser: {
        type: 'number',
      },
    },
  } as const;
};

const ms = SFDiscountSchema();
export type SFDiscountModel = FromSchema<typeof ms>;


export const SFDiscountUI = (): CollectionUI[] => { return null };
export const SFDiscountRules = (): CollectionRule[] => { return null };
registerCollection('Store Discount', DataType.sf_discount, SFDiscountSchema(), SFDiscountUI(), SFDiscountRules(), true)
