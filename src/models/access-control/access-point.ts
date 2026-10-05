import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AccessAllowSchema, AccessDenySchema, AccessPolicyRef } from './access-rules';

// Grouping only: the place a set of access devices belongs to (e.g. "Front
// Entrance" — ten door locks, twelve readers). Devices point at it
// (access_device.accessPoint, device_config.access.accessPoint); it never
// lists them. Its allow / deny are read when deciding access at its devices:
// an allow here lets a role through these doors even if the zone does not.
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
      allow: AccessAllowSchema(),
      deny: AccessDenySchema(),
      policy: AccessPolicyRef(),
    },
    required: ['name'],
  } as const;
};

const aps = AccessPointSchema();
export type AccessPointModel = FromSchema<typeof aps>;

registerCollection('Access Point', DataType.access_point, AccessPointSchema());
