import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFDiscountSchema = () => {
  return {
    type: 'object',
    properties: {
      order: {
        type: 'string',
      },
      receipt: {
        type: 'string',
      },
      return: {
        type: 'string',
      },
      amount: {
        type: 'string',
      },
      refundType: {
        type: 'string',
        enum: ['account', 'giftcard', 'cash']
      },
      tranction: {
        type: 'string',
      },
      remark: {
        type: 'string',
      },
      attachements: {
        type: 'array',
        items: {
          type: 'object'
        }
      },
    },
  } as const;
};

const ms = SFDiscountSchema();
export type SFDiscountModel = FromSchema<typeof ms>;


export const SFDiscountUI = (): CollectionUI[] => { return null };
export const SFDiscountRules = (): CollectionRule[] => { return null };
registerCollection('Store Discount', DataType.sf_discount, SFDiscountSchema(), SFDiscountUI(), SFDiscountRules(), true)
