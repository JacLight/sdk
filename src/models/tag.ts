import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';


import { registerCollection } from '../default-schema';

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


registerCollection(
  'Tag',
  DataType.tag,
  TagSchema()
);

registerCollection(
  'Tag Group',
  DataType.tag_group,
  TagGroupSchema()
);