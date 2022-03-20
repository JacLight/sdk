import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { DataType, FieldType } from '../types';
import { widgetStore } from '../WidgetStore';

export const NavigationSchema = () => {
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
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      links: {
        type: 'array',
        hidden: true,
        items: NavigationLinkSchema()
      },
    },
  } as const;
};

export const NavigationLinkSchema = (): any => {
  return {
    type: 'object',
    properties: {
      linkType: {
        type: 'string',
        enum: ['page', 'widget', 'url'], //use of page filter liket category or tags
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      page: {
        type: 'string',
        hidden: true,
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          field: 'name',
          collection: DataType.page,
        }
      },
      url: {
        type: 'string',
        format: 'uri',
        hidden: true
      },
      widget: {
        type: 'string',
        hidden: true,
        enum: widgetStore.widgetList.map(widget => widget.name)
      },
      params: {
        type: 'array',
        layout: 'horizontal',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            value: {
              type: 'string'
            }
          }
        }
      },
      image: {
        type: 'string',
      },
      links: {
        hidden: true,
      },
    },
    required: ['title', 'slug'],
  } as const;
};

export const NavigationLinkRules = (): CollectionRule[] => {
  return [
    {
      name: 'Show Hide Page',
      action: [
        {
          operation: 'show',
          script: '',
          targetField: '/properties/page',
        },
        {
          operation: 'hide',
          script: '',
          targetField: '/properties/widget',
        },
        {
          operation: 'hide',
          script: '',
          targetField: '/properties/url',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            targetValue: 'page',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/linkType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Hide URL',
      action: [
        {
          operation: 'hide',
          script: '',
          targetField: '/properties/page',
        },
        {
          operation: 'hide',
          script: '',
          targetField: '/properties/widget',
        },
        {
          operation: 'show',
          script: '',
          targetField: '/properties/url',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            targetValue: 'url',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/linkType',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Hide Widget',
      action: [
        {
          operation: 'hide',
          script: '',
          targetField: '/properties/page',
        },
        {
          operation: 'show',
          script: '',
          targetField: '/properties/widget',
        },
        {
          operation: 'hide',
          script: '',
          targetField: '/properties/url',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            targetValue: 'widget',
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/linkType',
            operation: 'equal',
          },
        ],
      },
    },
  ];
};

const rtlink = NavigationLinkSchema();
const rt = NavigationSchema();
export type NavigationLinkModel = FromSchema<typeof rtlink>;
export type NavigationModel = FromSchema<typeof rt>;
export const NavigationUI = (): CollectionUI[] => {
  return null;
};
export const NavigationRules = (): CollectionRule[] => {
  return [];
};