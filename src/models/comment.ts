import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FormViewSectionType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      resourceType: {
        type: 'string',
        disabled: true,
        hidden: true,
      },
      resourceId: {
        type: 'string',
        hidden: true,
        disabled: true,
      },
      comment: {
        type: 'string',
        inputStyle: 'textarea',
        displayStyle: 'outlined',
        rows: 3,
      },
      ratings: { // this will store only the ratings average - actual rating will be stored with use activity
        type: 'number',
        inputStyle: 'rating',
        max: 5,
        min: 1,
      },
      likes: { // this will store only the likes count - actual rating will be stored with use activity
        type: 'boolean',
        inputStyle: 'like',
      },
      dislikes: { // this will store only the dislikes count - actual rating will be stored with use activity
        type: 'boolean',
        inputStyle: 'dislike',
      }
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
  CommentRules()
);
