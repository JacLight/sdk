import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { ComponentName, DataType } from '../types';
import { registerCollection } from '../defaultschema';

export const FlexDataSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        title: 'Slug',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      application: {
        type: 'string',
        enum: Object.values(ComponentName)
      },
      data: {
        type: 'object',
        properties: {

        }
      }
    },
    required: ['name', 'application']
  } as const;
};

const rt = FlexDataSchema();
export type FlexStoreModel = FromSchema<typeof rt>;

export const FlexDataUI = (): CollectionUI[] => { return null };
export const FlexDataRules = (): CollectionRule[] => { return [] };
registerCollection('FlexData', DataType.flexdata, FlexDataSchema(), FlexDataUI(), FlexDataRules(), false, true);
