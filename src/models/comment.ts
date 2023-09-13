import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FormViewSectionType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        inputStyle: 'textarea',
        displayStyle: 'outlined',
      },
    },
  } as const;
};

export const CommentUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      title: 'Comments',
      items: [
        {
          '0': '/properties/comment',
        },
      ]
    },
  ];
};


const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

export const CommentRules = (): CollectionRule[] => {
  return [];
};
registerCollection(
  'Comment',
  DataType.comment,
  CommentSchema(),
  CommentUI(),
  CommentRules()
);
