import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

const RoleList = () => ({
  type: 'array',
  items: { type: 'string' },
  'x-control': ControlType.selectMany,
  dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
} as const);

const UserList = () => ({
  type: 'array',
  items: { type: 'string' },
  'x-control': ControlType.selectMany,
  dataSource: { source: 'collection', collection: DataType.user, value: 'sk', label: ['email', 'firstName', 'lastName'] },
} as const);

// A place access is granted to. Zones form one tree: global → country →
// state → site/building → floor → room → cage ...
//
// Who gets in is held on the zone itself, like menu permissions on a role:
// a user is let in when one of their roles (direct, or granted by a group) is
// in allow.roles, or they are named in allow.users. A match in deny always
// wins. A zone with empty allow and deny lists inherits its parent's; a zone
// that sets its own lists replaces what it would have inherited.
export const AccessZoneSchema = () => {
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
      kind: {
        type: 'string',
        enum: ['global', 'country', 'state', 'site', 'building', 'floor', 'wing', 'room', 'cage', 'rack', 'parking', 'lane', 'perimeter'],
        default: 'building',
        group: 'kind',
      },
      parent: {
        type: 'string',
        description: 'Parent zone. Empty = top of the tree.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        dataSource: { source: 'collection', collection: DataType.access_zone, value: 'name', label: ['title', 'name'] },
        group: 'kind',
      },

      allow: {
        type: 'object',
        properties: { roles: RoleList(), users: UserList() },
      },
      deny: {
        type: 'object',
        properties: { roles: RoleList(), users: UserList() },
        notes: 'Always wins over allow.',
      },
      policy: {
        type: 'string',
        description: 'Access policy for this zone. Empty = inherited from the parent zone.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        dataSource: { source: 'collection', collection: DataType.access_policy, value: 'name', label: ['title', 'name'] },
      },

      capacity: { type: 'number', minimum: 0, description: 'Maximum people inside at once. Empty = no limit.' },

      location: {
        type: 'string',
        description: 'Business Location this zone is. Supplies address and timezone.',
        'x-control': ControlType.selectMany,
        maxItems: 1,
        dataSource: { source: 'collection', collection: DataType.location, value: 'name', label: 'name' },
        group: 'place',
      },
      address: {
        type: 'object',
        properties: AddressSchema().properties,
        notes: 'Only for zones that are not a Business Location (toll plaza, remote gate).',
      },
      timezone: {
        type: 'string',
        maxLength: 64,
        description: 'IANA time zone when there is no Business Location. Inherited from the parent when empty.',
        group: 'place',
      },

      lockdown: {
        type: 'object',
        properties: {
          active: { type: 'boolean', default: false },
          mode: { type: 'string', enum: ['lock', 'open'], default: 'lock', notes: 'open = evacuation, every door unlocked.' },
          reason: { type: 'string' },
          by: { type: 'string' },
          at: { type: 'string', format: 'date-time' },
        },
        notes: 'Applies to this zone and every zone beneath it.',
      },
      scopePath: {
        type: 'string',
        readOnly: true,
        description: 'Computed from the parent chain, e.g. /global/us/tx/austin-hq/floor-3. Used for lockdown and reporting.',
      },
    },
    required: ['name', 'kind'],
  } as const;
};

const azs = AccessZoneSchema();
export type AccessZoneModel = FromSchema<typeof azs>;

registerCollection('Access Zone', DataType.access_zone, AccessZoneSchema());
