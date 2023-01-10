import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      comment: {
        type: 'string',
        inputStyle: 'textarea'
      },
      user: {
        type: 'string',
        hidden: true,
      },
      time: {
        type: 'string',
        format: 'date-time',
        hidden: true,
      },
      rating: {
        type: 'number',
        maximum: 5,
        minimum: 1,
        hidden: true,
      },
      voteUp: {
        type: 'number',
        hidden: true,
      },
      voteDown: {
        type: 'number',
        hidden: true,
      },
      comments: {
        type: 'array',
        items: { type: 'object' },
        hidden: true,
      },
    },
  } as const;
};

export const CommentListSchema = () => {
  return {
    type: 'object',
    properties: {
      comments: {
        type: 'array',
        hideLabel: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            comment: {
              type: 'string',
              fieldType: FieldType.paragraph
            },
            user: {
              type: 'string',
              fieldType: FieldType.label
            },
            time: {
              type: 'string',
              fieldType: FieldType.label
            },
          },
        }
      },
      comment: {
        type: 'string',
        inputStyle: 'textarea',
        displayStyle: 'outlined'
      },
    }
  } as const;
};



const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

export const CommentUI = (): CollectionUI[] => { return null };
export const CommentRules = (): CollectionRule[] => { return [] };
registerCollection('Comment', DataType.comment, CommentSchema(), CommentUI(), CommentRules())
