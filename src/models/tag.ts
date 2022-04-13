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
      value: {
        type: 'string',
      },
    },
  } as const;
};

export const TagGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      tags: {
        type: 'array',
        items: TagSchema(),
      },
    },
  } as const;
};

export const TagSetSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      tags: {
        type: 'array',
        items: TagSchema(),
      },
      tagGroups: {
        type: 'array',
        items: TagGroupSchema(),
      },
    },
  } as const;
};

const ts = TagSchema();
const tgs = TagGroupSchema();
const tss = TagSetSchema();

export type TagModel = FromSchema<typeof ts>;
export type TagGroupModel = FromSchema<typeof tgs>;
export type TagSetModel = FromSchema<typeof tss>;

export const TagUI = (): CollectionUI[] => {
  return null;
};

export const TagRules = (): CollectionRule[] => {
  return [];
};
