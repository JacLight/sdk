import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { ConfigType } from '../types';

export const ConfigSchema = () => {
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
        enum: Object.values(ConfigType),
        disabled: true
      },
      provider: {
        type: 'string',
        disabled: true
      },
      data: {
        type: 'object',
        hidden: true
      },
    },
  } as const;
};

const rt = ConfigSchema();
export type ConfigModel = FromSchema<typeof rt>;

export const ConfigUI = (): CollectionUI[] => {
  return null;
};

export const ConfigRules = (): CollectionRule[] => {
  return [];
};
