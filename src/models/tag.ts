import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';
import { registerCollection } from '../defaultschema';

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


const ts = TagSchema();
const tgs = TagGroupSchema();

export type TagModel = FromSchema<typeof ts>;
export type TagGroupModel = FromSchema<typeof tgs>;

export const TagUI = (): CollectionUI[] => { return null };
export const TagRules = (): CollectionRule[] => { return [] };

registerCollection('Tag', DataType.tag, TagSchema(), TagUI(), TagRules())
registerCollection('Tag', DataType.taggroup, TagGroupSchema(), TagUI(), TagRules())
