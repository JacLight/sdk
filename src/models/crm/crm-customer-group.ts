import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const CustomerGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      groupType: {
        type: 'string',
        enum: ['dynamic', 'static'],
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
