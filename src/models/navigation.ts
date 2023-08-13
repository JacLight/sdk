import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { DataType, FieldType } from '../types';
import { widgetStore } from '../WidgetStore';
import { registerCollection } from '../defaultschema';
import { FileInfoSchema } from './fileinfo';

export const NavigationSchema = () => {
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
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      children: {
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
      mega: { type: 'boolean' },
      page: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          value: 'name',
          label: 'name',
          collection: DataType.page,
        },
      },
      url: {
        type: 'string',
        hidden: true,
      },
      widget: {
        type: 'string',
        hidden: true,
        enum: widgetStore.widgetList.map(widget => widget.name),
      },
      icon: {
        type: 'string',
        fieldType: FieldType.icon,
      },
      image: FileInfoSchema(),
      params: {
        type: 'string',
      },
      children: {
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
          targetField: '/properties/page/title',
          value: 'Page',
        },
        {
          operation: 'setProperty',
          targetField: '/properties/page/dataSource/collection',
          value: DataType.page,
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'page',
            field1: '/properties/linkType',
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
          targetField: '/properties/page/title',
          value: 'Post',
        },
        {
          operation: 'setProperty',
          targetField: '/properties/page/dataSource/collection',
          value: DataType.post,
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'post',
            field1: '/properties/linkType',
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
            value: 'url',
            field1: '/properties/linkType',
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
            value: 'widget',
            field1: '/properties/linkType',
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
registerCollection(
  'Navigation',
  DataType.navigation,
  NavigationSchema(),
  NavigationUI(),
  NavigationRules()
);
