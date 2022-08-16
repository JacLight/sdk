import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { DataType, FieldType } from '../types';
import { widgetStore } from '../WidgetStore';
import { registerCollection } from '../defaultschema';

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
        items: NavigationLinkSchema(),
      },
    },
  } as const;
};

export const NavigationLinkSchema = () => {
  return {
    type: 'object',
    properties: {
      linkType: {
        type: 'string',
        enum: ['page', 'post', 'widget', 'url'], //use of page filter liket category or tags
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
          value: 'sk',
          label: 'name',
          collection: DataType.page,
        },
      },
      url: {
        type: 'string',
        format: 'uri',
        hidden: true,
      },
      widget: {
        type: 'string',
        hidden: true,
        enum: widgetStore.widgetList.map(widget => widget.name),
      },
      params: {
        type: 'array',
        layout: 'horizontal',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            value: {
              type: 'string',
            },
          },
        },
      },
      image: {
        type: 'string',
      },
      links: {
        type: 'array',
        hidden: true,
      },
    },
    required: ['title'],
  } as const;
};

export const NavigationLinkRules = (): CollectionRule[] => {
  return [
    {
      name: 'Show Hide Page',
      action: [
        {
          operation: 'show',
          targetField: '/properties/page',
        },
        {
          operation: 'hide',
          targetField: '/properties/widget',
        },
        {
          operation: 'hide',
          targetField: '/properties/url',
        },
        {
          operation: 'setProperty',
          property: 'title',
          targetField: '/properties/page',
          sourceType: 'value',
          value: 'Page'
        },
        {
          operation: 'setProperty',
          property: 'collection',
          targetField: '/properties/page/dataSource',
          sourceType: 'value',
          value: DataType.page
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
      name: 'Show Hide Post',
      action: [
        {
          operation: 'show',
          targetField: '/properties/page',
        },
        {
          operation: 'hide',
          targetField: '/properties/widget',
        },
        {
          operation: 'hide',
          targetField: '/properties/url',
        },
        {
          operation: 'setProperty',
          property: 'title',
          targetField: '/properties/page',
          sourceType: 'value',
          value: 'Post'
        },
        {
          operation: 'setProperty',
          property: 'collection',
          targetField: '/properties/page/dataSource',
          sourceType: 'value',
          value: DataType.post
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            targetValue: 'post',
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
          targetField: '/properties/page',
        },
        {
          operation: 'hide',
          targetField: '/properties/widget',
        },
        {
          operation: 'show',
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
          targetField: '/properties/page',
        },
        {
          operation: 'show',
          targetField: '/properties/widget',
        },
        {
          operation: 'hide',
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
export const NavigationUI = (): CollectionUI[] => { return null };
export const NavigationRules = (): CollectionRule[] => { return [] };
registerCollection('Navigation', DataType.navigation, NavigationSchema(), NavigationUI(), NavigationRules())
