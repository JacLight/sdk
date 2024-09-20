import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
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
        transform: 'uri'
      },
      description: {
        type: 'string',
      },
      selection: {
        type: 'object',
        title: 'Selections',
        'x-control': ControlType.collection,
        displayStyle: 'table',
        'x-control-variant': 'picker',
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
      },
      url: {
        type: 'string',
      },
      dropType: {
        type: 'string',
        enum: ['list', 'compact', 'column']
      },
      display: {
        type: 'string',
        enum: ['link', 'block', 'card', 'action', 'separator']
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
