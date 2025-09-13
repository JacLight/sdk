import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CustomerGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'name',
        },
      },
      description: {
        type: 'string',
      },
      groupType: {
        type: 'string',
        enum: ['dynamic', 'static'],
      },
      contacts: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      addRules: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
            operator: {
              type: 'string',
              enum: ['equals', 'not_equals', 'in', 'not_in'],
            },
            value: {
              type: 'string',
            },
          },
        },
        removeRules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: {
                type: 'string',
              },
              operator: {
                type: 'string',
                enum: ['equals', 'not_equals', 'in', 'not_in'],
              },
              value: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  } as const;
};

const ush = CustomerGroupSchema();
export type CustomerGroupModel = FromSchema<typeof ush>;
registerCollection('Customer Group', DataType.customer_group, CustomerGroupSchema());
