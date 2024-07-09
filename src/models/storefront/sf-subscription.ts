import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';

export const SFSubscriptionSchema = () => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        group: 'status',
        readOnly: true,
      },
      referenceId: {
        type: 'string',
        group: 'status',
        readOnly: true,
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        group: 'name',
        readOnly: true,
      },
      plan: {
        type: 'string',
        group: 'name',
        readOnly: true,
      },
      nextRenewalDate: {
        type: 'string',
        group: 'date'
      },
      startDate: {
        type: 'string',
        group: 'date'
      },
      endDate: {
        type: 'string',
        group: 'date'
      },
      addOns: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            price: { type: 'number' },
          },
        },
      },
      renewals: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            amount: { type: 'number' },
            paymentRef: { type: 'string' },
            paymentGateway: { type: 'string' },
            nextRenewalDate: { type: 'string' },
          },
        },
        isTrial: {
          type: 'boolean',
        },
        trial: {
          collapsible: true,
          type: 'array',
          items: {
            type: 'object',
            properties: {
              startDate: { type: 'string' },
              endDate: { type: 'string' },
              ref: { type: 'string' },
            },
          },
        }
      },
    },
  } as const;
};

const dd = SFSubscriptionSchema();
export type SFSubscriptionModel = FromSchema<typeof dd>;

export const SFSubscriptionUI = (): CollectionUI[] => {
  return null;
};
export const SFSubscriptionRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Subscription',
  DataType.sf_subscription,
  SFSubscriptionSchema(),
  SFSubscriptionUI(),
  SFSubscriptionRules(),
  false
);
