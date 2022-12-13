import { FromSchema } from 'json-schema-to-ts';
import { ComponentType, ComponentName, DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';
import { registerCollection } from '../defaultschema';

export const ApplicationSchema = () => {
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
      icon: {
        type: 'string',
      },
      links: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            param: {
              type: 'string'
            },
            componentType: {
              type: 'string',
              enum: Object.values(ComponentType),
              fieldType: FieldType.selectionmultiple,
            },
            flow: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.mintflow,
                value: 'sk',
                label: 'name',
              },
            },
            page: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.page,
                value: 'sk',
                label: 'name',
              },
            },
            collection: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.collection,
                value: 'sk',
                label: 'name',
              },
            },
            collectionView: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.collectionview,
                value: 'sk',
                label: 'name',
              },
            },
            collectionForm: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.collectionform,
                value: 'sk',
                label: 'name',
              },
            },
            component: {
              type: 'string',
              enum: Object.values(ComponentName)
            },
            default: {
              type: 'boolean'
            }
          }
        },
      },
      config: {
        type: 'object',
        hidden: true,
      },
      data: {
        type: 'object',
        hidden: true,
      },
    },
  } as const;
};

export const ApplicationRules = (): CollectionRule[] => {
  return [
    {
      name: 'Show Collections',
      action: [
        {
          operation: 'show',
          targetField: '/properties/links/items/properties/collection',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'Collection',
            field1: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Collection Views',
      action: [
        {
          operation: 'show',
          targetField: '/properties/links/items/properties/collectionView',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'CollectionView',
            field1: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Collection Forms',
      action: [
        {
          operation: 'show',
          targetField: '/properties/links/items/properties/collectionForm',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'CollectionForm',
            field1: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Flow',
      action: [
        {
          operation: 'show',
          targetField: '/properties/links/items/properties/flow',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'Flow',
            field1: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Pages',
      action: [
        {
          operation: 'show',
          targetField: '/properties/links/items/properties/page',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'Page',
            field1: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Components',
      action: [
        {
          operation: 'show',
          targetField: '/properties/links/items/properties/component',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'Component',
            field1: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
  ]
};

const as = ApplicationSchema();
export type ApplicationModel = FromSchema<typeof as>;
export const ApplicationUI = (): CollectionUI[] => { return null };
registerCollection('Application', DataType.application, ApplicationSchema(), ApplicationUI(), ApplicationRules())
