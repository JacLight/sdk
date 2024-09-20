import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';

export const SFSubscriptionDefinitionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        group: 'name'
      },
      title: {
        type: 'string',
        group: 'name'
      },
      price: {
        type: 'number',
        group: 'pricing'
      },
      durationUnit: {
        type: 'string',
        enum: ['minute', 'hour', 'day', 'week', 'month', 'year', 'forever'],
        group: 'pricing'
      },
      duration: {
        type: 'number',
        group: 'pricing'
      },
      trial: {
        type: 'number',
        title: 'Trial Period in Days',
        group: 'addOns'
      },
      status: {
        type: 'string',
        group: 'addOns',
        enum: ['active', 'inactive'],
      },
      addOns: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'collection',
          collection: DataType.sf_subscription_definition,
          value: 'name',
          label: ['name', 'title'],
        },
      },
      description: {
        collapsible: true,
        type: 'string',
        'x-control': 'richtext',
      },
      upstream: {
        type: 'object',
        layout: 'horizontal',
        collapsible: true,
        properties: {
          name: {
            type: 'string',
            enum: ['stripe', 'paypal', 'paddle'],
          },
          priceId: {
            type: 'string',
          },
          productId: {
            type: 'string',
          },
          remarks: {
            type: 'string',
          },
        },
      },

    },
  } as const;
};

const dd = SFSubscriptionDefinitionSchema();
export type SFSubscriptionDefinitionModel = FromSchema<typeof dd>;


registerCollection(
  'Store Subscription',
  DataType.sf_subscription_definition,
  SFSubscriptionDefinitionSchema(),
  null,
  null,
  false
);
