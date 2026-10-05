import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// Rules applied on top of who may enter. A policy stands on its own; a zone
// points at one (access_zone.policy) and zones beneath inherit it until one
// points at its own.
//
// PIN: required for everyone, for members of one of `pinGroups` (access
// groups), or off.
// Anyone can still turn it on for themselves by setting a PIN on their card.
export const AccessPolicySchema = () => {
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
      requirePin: {
        type: 'string',
        enum: ['off', 'everyone', 'groups'],
        default: 'off',
        description: 'Who must enter their card PIN in zones under this policy.',
        notes: 'Off does not mean nobody uses one — a person who set a PIN on their card is always asked for it.',
        group: 'pin',
      },
      pinGroups: {
        type: 'array',
        items: { type: 'string' },
        description: 'requirePin = groups: members of any of these access groups.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.access_group, value: 'name', label: ['title', 'name'] },
        group: 'pin',
      },
    },
    required: ['name'],
  } as const;
};

const apols = AccessPolicySchema();
export type AccessPolicyModel = FromSchema<typeof apols>;

registerCollection('Access Policy', DataType.access_policy, AccessPolicySchema());
