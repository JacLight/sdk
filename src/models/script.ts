import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const ScriptSchema = () => {
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
      type: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['active', 'disabled']
      },
      content: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
        }
      },
    },
  } as const;
};

const rt = ScriptSchema();
export type ScriptModel = FromSchema<typeof rt>;
export const ScriptUI = (): CollectionUI[] => { return null };
export const ScriptRules = (): CollectionRule[] => { return [] };
registerCollection('Script', DataType.script, ScriptSchema(), ScriptUI(), ScriptRules())
