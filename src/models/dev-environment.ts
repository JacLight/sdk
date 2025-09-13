import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

export const DevEnvironmentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        layoutGroup: 'info',
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
        group: 'name',
      },
      productionUrl: {
        type: 'string',
      },
      previewUrl: {
        type: 'string',
      },
      templateUrl: {
        type: 'string',
      },
      framework: {
        type: 'string',
      },
      domains: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      config: {
        type: 'object',
      },
    },
  } as const;
};



const dd = DevEnvironmentSchema();
export type DevEnvironmentModel = FromSchema<typeof dd>;

registerCollection(
  'DevEnvironment',
  DataType.dev_environment,
  DevEnvironmentSchema()
);
