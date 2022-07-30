import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { DataType } from '../types';
import { registerCollection } from '../defaultschema';

export const PostSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      template: {
        type: 'string',
        hidden: true
      },
    },
  } as const;
};

const rt = PostSchema();
export type PostModel = FromSchema<typeof rt>;

export const PostUI = (): CollectionUI[] => { return null };
export const PostRules = (): CollectionRule[] => { return [] };
registerCollection('Post', DataType.post, PostSchema(), PostUI(), PostRules(), false, true);
