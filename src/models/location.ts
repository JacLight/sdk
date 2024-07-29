import { registerCollection } from '../defaultschema';
import { DataType, ControlType } from '../types';
import { CollectionUI } from './collection-ui';
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


export const LocationUI = (): CollectionUI[] => {
  return null;
};
registerCollection(
  'Business Location',
  DataType.location,
  LocationSchema(),
  null,
  null
);
