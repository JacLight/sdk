import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';
import { AddressSchema } from './crm/crm-address';

export const BusinessLocationSchema = () => {
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
        dataSource: { source: 'json', json: ['address', 'website', 'virtual'] },
        group: 'name',
      },
      title: { type: 'string' },
      services: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'json', json: [] },
      },
      address: {
        type: 'object',
        properties: AddressSchema().properties,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'address', action: 'hide' },
        ],
      },
      meetingLink: {
        type: 'string',
        rules: [
          { operation: 'notIn', valueA: ['virtual', 'website'], valueB: '{{type}}', action: 'hide' },
        ],
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        rules: [
          { operation: 'notIn', valueA: ['virtual', 'website'], valueB: '{{type}}', action: 'hide' },
        ],
      },
      gridSize: { type: 'number', default: 20 },
      status: { type: 'string', enum: ['active', 'inactive'] },
    },
  } as const;
};

export const LocationSchema = BusinessLocationSchema;

const ps = BusinessLocationSchema();
export type BusinessLocationModel = FromSchema<typeof ps>;
export type LocationModel = BusinessLocationModel;

registerCollection('Business Location', DataType.location, BusinessLocationSchema());
