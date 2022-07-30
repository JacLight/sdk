import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFSubscriptionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      plan: {
        type: 'string',
      },
      nextRenewalDate: {
        type: 'string',
      },
      statrtDate: {
        type: 'string',
      },
      endDate: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      renewals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            transaction: { type: 'string' }
          }
        },
      },
    },
  } as const;
};

const dd = SFSubscriptionSchema();
export type SFSubscriptionSchema = FromSchema<typeof dd>;

export const SFSubscriptionUI = (): CollectionUI[] => { return null };
export const SFSubscriptionRules = (): CollectionRule[] => { return null };
registerCollection('Store Subscription', DataType.sf_subscription, SFSubscriptionSchema(), SFSubscriptionUI(), SFSubscriptionRules(), true)
