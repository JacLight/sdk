import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { ComponentType, ComponentName, DataType, FieldType } from '../types';

export const ApplicationSchema = () => {
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
                field: 'name',
              },
            },
            page: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.page,
                field: 'name',
              },
            },
            collection: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.collection,
                field: 'name',
              },
            },
            collectionView: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.collectionview,
                field: 'name',
              },
            },
            collectionForm: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.collectionform,
                field: 'name',
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

const as = ApplicationSchema();
export type ApplicationModel = FromSchema<typeof as>;

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
            targetValue: 'Collection',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/links/items/properties/componentType',
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
            targetValue: 'CollectionView',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/links/items/properties/componentType',
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
            targetValue: 'CollectionForm',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/links/items/properties/componentType',
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
            targetValue: 'Flow',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/links/items/properties/componentType',
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
            targetValue: 'Page',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/links/items/properties/componentType',
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
            targetValue: 'Component',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/links/items/properties/componentType',
            operation: 'equal',
          },
        ],
      },
    },
  ]
};

export const ApplicationUI = (): CollectionUI[] => {
  return [];
};
