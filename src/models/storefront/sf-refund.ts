import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFRefundSchema = () => {
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

const ms = SFRefundSchema();
export type SFRefundModel = FromSchema<typeof ms>;


export const SFRefundUI = (): CollectionUI[] => { return null };
export const SFRefundRules = (): CollectionRule[] => { return null };
registerCollection('Store Refund', DataType.sf_refund, SFRefundSchema(), SFRefundUI(), SFRefundRules(), true)
