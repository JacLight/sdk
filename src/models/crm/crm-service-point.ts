import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType } from '../../types';

export const ServicePointSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
      },
      capacity: {
        type: 'number',
      },
      location: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        'x-group': 'group1',
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
      schema: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['closed', 'open', 'busy'],
      },
    },
  } as const;
};

export const ServicePointRules = (): CollectionRule[] => null
export const ServicePointUI = (): CollectionUI[] => null


const cs = ServicePointSchema();
export type ServicePointModel = FromSchema<typeof cs>;

registerCollection(
  'Event',
  DataType.service_point,
  ServicePointSchema(),
  ServicePointUI(),
  ServicePointRules(),
  true,
  true
);
