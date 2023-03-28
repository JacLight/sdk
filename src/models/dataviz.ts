import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

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
        enum: ['dashboard', 'table', 'chart'],
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
                    type: 'string',
                  },
                  caption: {
                    type: 'string',
                    inputStyle: 'textarea',
                  },
                  table: {
                    type: 'string',
                    fieldType: FieldType.selectionmultiple,
                    dataSource: {
                      source: 'collection',
                      collection: DataType.dataviz,
                      value: 'sk',
                      label: 'name',
                      filter: {
                        property: 'type',
                        operation: 'equal',
                        value: 'table',
                      },
                    },
                  },
                  chart: {
                    type: 'string',
                    fieldType: FieldType.selectionmultiple,
                    dataSource: {
                      source: 'collection',
                      collection: DataType.dataviz,
                      value: 'sk',
                      label: 'name',
                      filter: {
                        property: 'type',
                        operation: 'equal',
                        value: 'chart',
                      },
                    },
                  },
                  style: {
                    type: 'string',
                    inputStyle: 'textarea',
                  },
                },
              },
            },
            style: {
              type: 'object',
            },
          },
        },
      },
      table: {
        hidden: true,
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          config: {
            type: 'object',
          },
          style: {
            type: 'string',
          },
          data: {
            type: 'string',
          },
        },
      },
      chart: {
        hidden: true,
        type: 'object',
        properties: {
          type: {
            type: 'string',
          },
          config: {
            type: 'string',
          },
          style: {
            type: 'string',
          },
          data: {
            type: 'string',
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const dd = DataVizSchema();
export type DataVizModel = FromSchema<typeof dd>;

export const DataVizUI = (): CollectionUI[] => {
  return null;
};
export const DataVizRules = (): CollectionRule[] => {
  return null;
};

registerCollection(
  'DataViz',
  DataType.dataviz,
  DataVizSchema(),
  DataVizUI(),
  DataVizRules()
);
