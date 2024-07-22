import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import {
  DataType,
} from '../../types';
import { registerCollection } from '../../defaultschema';

export const FlexDataSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        group: 'name',
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

export const FlexDataUI = (): CollectionUI[] => {
  return null;
};
export const FlexDataRules = (): CollectionRule[] => {
  return [];
};
registerCollection(
  'FlexData',
  DataType.flexdata,
  FlexDataSchema(),
  FlexDataUI(),
  FlexDataRules(),
  false,
  true
);
