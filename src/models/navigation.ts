import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { DataType, FieldType } from '../types';
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
        transform: 'uri'
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
        enum: ['page', 'url'], //use of page filter liket category or tags
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
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
      dropType: {
        type: 'string',
        enum: ['list', 'compact', 'column']
      },
      display: {
        type: 'string',
        enum: ['link', 'block', 'card', 'action']
      },
      icon: {
        type: 'string',
        fieldType: FieldType.icon,
      },
      image: FileInfoSchema(),
      url: {
        type: 'string',
      },
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
