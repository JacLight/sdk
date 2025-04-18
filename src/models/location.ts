import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';
import { AddressSchema } from './crm/crm-address';

export const LocationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      type: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: [
            'address',
            'website',
            'virtual',
          ],
        },
        group: 'name',
      },
      title: {
        type: 'string',
      },
      services: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: [
          ],
        },
      },
      address: {
        type: 'object',
        properties: AddressSchema().properties,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'address', action: 'hide' },
        ]
      },
      link: {
        type: 'string',
        rules: [
          { operation: 'notIn', valueA: ['virtual', 'website'], valueB: '{{type}}', action: 'hide' },
        ]
      },
      accessCode: {
        type: 'string',
        rules: [
          { operation: 'notIn', valueA: ['virtual', 'website'], valueB: '{{type}}', action: 'hide' },
        ]
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
      },
    },
  } as const;
};

const ps = LocationSchema();
export type LocationModel = FromSchema<typeof ps>;
registerCollection(
  'Business Location',
  DataType.location,
  LocationSchema(),
  null,
  null
);
