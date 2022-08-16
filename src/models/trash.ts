import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';
import { registerCollection } from '../defaultschema';

export const TrashSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      resourceType: {
        type: 'string',
      },
      resourceId: {
        type: 'string',
      },
      date: {
        type: 'string',
      },
      item: {
        type: 'string',
      },
    },
  } as const;
};

const ts = TrashSchema();
export type TrashModel = FromSchema<typeof ts>;
export const TrashUI = (): CollectionUI[] => { return null };
export const TrashRules = (): CollectionRule[] => { return [] };
registerCollection('Trash', DataType.trash, TrashSchema(), TrashUI(), TrashRules())
