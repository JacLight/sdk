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
      addRulesMatch: {
        type: 'string',
        enum: ['all', 'any'],
        default: 'all',
        description: 'A smart group: every rule must hold (all) or at least one (any).',
      },
      query: {
        type: 'string',
        description: 'A smart group\'s query — the one truth of who is in it (JSON text): a filter on contact records, or a Data Viz pipeline on them ({"$date": "…"} for a date). Simple mode writes it from the rules; Advanced edits it by hand.',
      },
      queryMode: {
        type: 'string',
        enum: ['simple', 'advanced'],
        default: 'simple',
        description: 'How the query is written: simple (assisted, from the rules) or advanced (the JSON by hand).',
      },
      addRules: {
        type: 'array',
        description: "A smart group's rules: any field of the contact record (`data.…`, or the record's own `createdate`, `modifydate`, `author`, `state`), read as one database query on the server.",
        items: {
          type: 'object',
          properties: {
            field: {
              type: 'string',
            },
            operator: {
              type: 'string',
              enum: ['equals', 'not_equals', 'in', 'not_in', 'contains', 'not_contains', 'starts_with', 'ends_with', 'gt', 'gte', 'lt', 'lte', 'before', 'after', 'in_last_days', 'not_in_last_days', 'is_empty', 'is_not_empty'],
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
