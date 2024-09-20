import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';

export const PostSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      name: {
        type: 'string',
        title: 'Slug',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
        group: 'slug',
        default: '{{title}}',
        groupLayout: 'flat',
        transform: ['uri', 'lowercase', 'suffix::-', 'random-string'],
        textSearch: true,

      },
      template: {
        type: 'string',
        'x-control': ControlType.selectMany,
        groupLayout: 'flat',
        group: 'slug',
        dataSource: {
          source: 'collection',
          collection: DataType.flexdata,
          value: 'name',
          label: 'name',
          filter: {
            value: 'ViewComponent',
            property: 'application',
            operator: 'equal'
          }
        },
      },
      summary: {
        type: 'string',
        'x-control-variant': 'textarea',
        textSearch: true,
      },
      content: {
        type: 'string',
        ai: true,
        'x-control': ControlType.richtext,
        hideInTable: true,
        textSearch: true,
      },
    },
  } as const;
};

const rt = PostSchema();
export type PostModel = FromSchema<typeof rt>;

export const PostUI = (): CollectionUI[] => {
  return null;
};
export const PostRules = (): CollectionRule[] => {
  return [];
};
registerCollection(
  'Post',
  DataType.post,
  PostSchema(),
  PostUI(),
  PostRules(),
  false,
  true
);
