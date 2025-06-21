import { FromSchema } from 'json-schema-to-ts';


import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

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
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
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
      title: {
        type: 'string',
      },
      slug: {
        type: 'string',
        transform: 'uri',
        rules: [
          { operation: 'isNotEmpty', valueA: '{{selection}}', action: 'hide' }
        ]
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      type: {
        type: 'string',
        enum: ['url', 'content', 'custom']

      },
      selection: {
        type: 'object',
        title: 'Selections',
        'x-control': ControlType.lookup,
        dataSource: {
          source: 'collection',
          collection: DataType.post,
        },
        properties: {
          datatype: {
            type: 'string',
          },
          id: {
            type: 'string',
            styleClass: '!w-10'
          },
          name: {
            type: 'string',
          },
        },
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'content', action: 'hide' }
        ]
      },
      url: {
        type: 'string',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'content', action: 'hide' },
        ]
      },
      dropType: {
        type: 'string',
        enum: ['list', 'compact', 'column'],
        group: 'drop',
      },
      display: {
        type: 'string',
        enum: ['link', 'block', 'card', 'action', 'separator'],
        group: 'drop',
      },
      icon: {
        type: 'string',
        'x-control': ControlType.icon,
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


const rtlink = NavigationLinkSchema();
const rt = NavigationSchema();
export type NavigationLinkModel = FromSchema<typeof rtlink>;
export type NavigationModel = FromSchema<typeof rt>;
registerCollection(
  'Navigation',
  DataType.navigation,
  NavigationSchema()
);