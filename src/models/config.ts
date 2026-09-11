import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ConfigType } from '../types';
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
        collapsible: true,
        readOnly: true,
        items:{
          type: 'string',
        }
      },
      priority: {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        default: 1,
        title: 'Priority',
        description:
          'Higher priority gateways are used first when more than one can do the same job (0-100). This is the only thing that picks between them — nothing points at a gateway from anywhere else.',
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
