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
      },
      user: {
        type: 'string',
      },
      rating: {
        type: 'number',
        maximum: 5,
        minimum: 1,
      },
      voteUp: {
        type: 'number',
      },
      voteDown: {
        type: 'number',
      },
      date: {
        type: 'string',
        format: 'date-time',
      },
      comments: {
        type: 'array',
        items: { type: 'object' },
        hidden: true,
      },
    },
  } as const;
};

const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

export const CommentUI = (): CollectionUI[] => { return null };
export const CommentRules = (): CollectionRule[] => { return [] };
registerCollection('Comment', DataType.comment, CommentSchema(), CommentUI(), CommentRules())
