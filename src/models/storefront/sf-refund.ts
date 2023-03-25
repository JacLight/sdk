import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui'; import { DataType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

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
      attachements: FileInfoSchema()
    },
  } as const;
};

const ms = SFRefundSchema();
export type SFRefundModel = FromSchema<typeof ms>;


export const SFRefundUI = (): CollectionUI[] => { return null };
export const SFRefundRules = (): CollectionRule[] => { return null };
registerCollection('Store Refund', DataType.sf_refund, SFRefundSchema(), SFRefundUI(), SFRefundRules(), true)
