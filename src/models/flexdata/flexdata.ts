import { FromSchema } from 'json-schema-to-ts';


import {
  DataType,
} from '../../types';
import { registerCollection } from '../../default-schema';

export const FlexDataSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        group: 'name',
        uniqueScope: ['application'],
        unique: true,
      },
      application: {
        type: 'string',
        group: 'name',
      },
      type: {
        type: 'string',
        group: 'name',
      },
      content: {
        type: 'object',
        properties: {},
      },
    },
    required: ['name', 'application'],
  } as const;
};

const rt = FlexDataSchema();
export type FlexDataModel = FromSchema<typeof rt>;

registerCollection(
  'FlexData',
  DataType.flexdata,
  FlexDataSchema(),
);
