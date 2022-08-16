import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
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
      date: {
        type: 'string',
        format: 'date-time',
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
        readonly: true,
        items: CommentSchema()
      },
      newComment: CommentSchema()
    }
  } as const;
};



const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

export const CommentUI = (): CollectionUI[] => { return null };
export const CommentRules = (): CollectionRule[] => { return [] };
registerCollection('Comment', DataType.comment, CommentSchema(), CommentUI(), CommentRules())
