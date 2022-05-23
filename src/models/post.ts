import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';

export const PostSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
      },
      template: {
        type: 'string',
        hidden: true
      },
      config: {
        type: 'object',
        hidden: true
      },
      content: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
        }
      }
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
