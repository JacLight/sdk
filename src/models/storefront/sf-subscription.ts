import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType } from '../../types';

export const SFSubscriptionSchema = () => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        group: 'status',
        readOnly: true,
        enum: ['new', 'active', 'inactive', 'cancelled', 'expired'],
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
      renewalDate: {
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
      benefits: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
      email: {
        type: 'string',
      },
      renewals: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            plan: { type: 'string' },
            amount: { type: 'number' },
            paymentRef: { type: 'string' },
            paymentGateway: { type: 'string' },
            renewalDate: { type: 'string' },
          },
        },
        isTrial: {
          type: 'boolean',
        },
        autoRenew: {
          type: 'boolean',
        },
        endDate: {
          type: 'string',
        },
        cancelReason: {
          type: 'string',
        },
        cancelDate: {
          type: 'string',
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
        },
      },
      remarks: {
        type: 'string',
        'x-control-variant': 'textarea',
      }
    },
  } as const;
};

const dd = SFSubscriptionSchema();
export type SFSubscriptionModel = FromSchema<typeof dd>;

registerCollection(
  'Store Subscription',
  DataType.sf_subscription,
  SFSubscriptionSchema(),
);
