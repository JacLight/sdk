import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
import { CollectionUI, CollectionRule } from './collection';

export const DataVizSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['dashboard', 'table', 'chart']
      },
      sections: {
        hidden: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            columns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string'
                  },
                  config: {
                    type: 'object'
                  },
                  style: {
                    type: 'object'
                  },
                  data: {
                    type: 'object'
                  },
                }
              }
            },
            style: {
              type: 'object'
            },
          }
        }
      },
      table: {
        hidden: true,
        type: 'object',
        properties: {
          type: {
            type: 'string'
          },
          config: {
            type: 'string'
          },
          style: {
            type: 'string'
          },
          data: {
            type: 'string'
          },
        }
      },
      chart: {
        hidden: true,
        type: 'object',
        properties: {
          type: {
            type: 'string'
          },
          config: {
            type: 'string'
          },
          style: {
            type: 'string'
          },
          data: {
            type: 'string'
          },
        }
      }
    },
    required: ['name']
  } as const;
};



const dd = DataVizSchema();
export type DataVizModel = FromSchema<typeof dd>;

export const DataVizUI = (): CollectionUI[] => { return null };
export const DataVizRules = (): CollectionRule[] => { return null };

registerCollection('DataViz', DataType.dataviz, DataVizSchema(), DataVizUI(), DataVizRules())


