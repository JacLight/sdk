import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';



export const ScriptSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri'
      },
      type: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['active', 'disabled'],
      },
      content: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
        },
      },
    },
  } as const;
};

const rt = ScriptSchema();
export type ScriptModel = FromSchema<typeof rt>;
registerCollection(
  'Script',
  DataType.script,
  ScriptSchema()
);