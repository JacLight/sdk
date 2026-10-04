import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// Grouping only: the granting and input devices at one place (e.g. "Front
// Entrance" — ten door locks, twelve readers). Never read when deciding
// access; each granting device carries its own zone on device_config.access.
export const AccessPointSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        transform: 'uri',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        group: 'name',
      },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      zone: {
        type: 'string',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        dataSource: { source: 'collection', collection: DataType.access_zone, value: 'name', label: ['title', 'name'] },
      },
      devices: {
        type: 'array',
        items: { type: 'string' },
        description: 'Granting hub devices: locks, gates, barriers.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.device_config, value: 'name', label: ['displayName', 'name'] },
      },
      inputs: {
        type: 'array',
        items: { type: 'string' },
        description: 'Input devices at the same place: readers, scanners, terminals.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.access_device, value: 'name', label: ['title', 'name'] },
      },
    },
    required: ['name'],
  } as const;
};

const aps = AccessPointSchema();
export type AccessPointModel = FromSchema<typeof aps>;

registerCollection('Access Point', DataType.access_point, AccessPointSchema());
