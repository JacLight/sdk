import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// Devices that act the same way wherever they are — every freezer probe, every gas detector.
// Members are held on the group (as access groups hold their people); the group's policy is
// what every member does. A device may be in many groups and follows all their policies.
export const DeviceGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', unique: true, transform: 'uri', pattern: '^[a-zA-Z_\\-0-9]*$', group: 'name' },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      devices: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.device_config, value: 'name', label: ['displayName', 'name'] },
      },
      policy: {
        type: 'string',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        dataSource: { source: 'collection', collection: DataType.device_policy, value: 'name', label: ['title', 'name'] },
      },
    },
    required: ['name'],
  } as const;
};

const dgs = DeviceGroupSchema();
export type DeviceGroupModel = FromSchema<typeof dgs>;

registerCollection('Device Group', DataType.device_group, DeviceGroupSchema());
