import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ConfigType, ControlType } from '../types';
import { DataType } from '../types';

export const ConfigSchema = () => {
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
        enum: Object.values(ConfigType),
        disabled: true,
      },
      useCases: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        readOnly: true,
      },
      default: {
        type: 'boolean',
      },
      provider: {
        type: 'string',
        disabled: true,
      },
      data: {
        type: 'object',
        hidden: true,
      },
    },
  } as const;
};

const rt = ConfigSchema();
export type ConfigModel = FromSchema<typeof rt>;
registerCollection(
  'Config',
  DataType.config,
  ConfigSchema(),
);
