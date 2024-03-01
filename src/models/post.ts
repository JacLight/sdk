import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { DataType, FieldType } from '../types';
import { registerCollection } from '../defaultschema';

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
        groupLayout: 'flat',
        suffix: '-',
        transform: ['uri', 'lowercase', 'suffix', 'random-string', '{{title}}'],

      },
      template: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
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
        inputStyle: 'textarea',
      },
      content: {
        type: 'string',
        fieldType: FieldType.richtext,
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
