import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';

export const TagSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
    },
  } as const;
};

const rt = TagSchema();
export type TagModel = FromSchema<typeof rt>;
export const TagUI = (): CollectionUI[] => {
  return null;
};

export const TagRules = (): CollectionRule[] => {
  return null;
};
