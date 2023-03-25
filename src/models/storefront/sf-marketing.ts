import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui'; import { DataType } from '../../types';

export const SFMarketingSchema = () => {
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

const ms = SFMarketingSchema();
export type SFMarketingModel = FromSchema<typeof ms>;


export const SFMarketingUI = (): CollectionUI[] => { return null };
export const SFMarketingRules = (): CollectionRule[] => { return null };
registerCollection('Store Marketing', DataType.sf_marketing, SFMarketingSchema(), SFMarketingUI(), SFMarketingRules(), true)
