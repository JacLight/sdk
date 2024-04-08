import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FormViewSectionType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        hidden: true,
        displayStyle: 'outlined',
      },
      message: {
        type: 'string',
        'x-control-variant': 'textarea',
        displayStyle: 'outlined',
        rows: 3,
      },
      rating: { //this is the rating the commenter gave to the owning object
        type: 'number',
        'x-control-variant': 'rating',
        max: 5,
        min: 1,
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
        {
          '0': '/properties/ratings',
          '1': '/properties/likes',
          '2': '/properties/dislikes',
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
  CommentRules(),
);
