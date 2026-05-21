import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';

// Registry of physical NFC cards issued for POS quick login. A card is
// registered by an admin and bound to a BusinessMade employee. Authentication
// keys off `cardUid` — the chip's factory-burned hardware serial (read-only,
// NOT the writable employeeId), so a cloned/copied card carries a different
// UID, is absent from this registry, and is rejected.
export const AccessCardSchema = () => {
  return {
    type: 'object',
    properties: {
      cardUid: {
        type: 'string',
        unique: true,
        description: "NFC chip hardware UID (factory-burned serial read on tap). The registry key.",
        group: 'card',
      },
      label: {
        type: 'string',
        description: 'Friendly name for the physical card (e.g. "Front-desk lanyard #3")',
        group: 'card',
      },
      employeeId: {
        type: 'string',
        description: 'BusinessMade employee this card is issued to. Must match the user login it unlocks.',
        group: 'card',
        'x-control': ControlType.selectSingle,
        dataSource: {
          source: 'collection',
          collection: DataType.bm_employee,
          value: 'employeeId',
          label: ['employeeId', 'name'],
        },
      },
      userId: {
        type: 'string',
        readOnly: true,
        description: 'Resolved user record id, for fast login lookup',
        group: 'card',
      },
      status: {
        type: 'string',
        enum: ['active', 'revoked', 'lost'],
        default: 'active',
        description: 'Only "active" cards can sign in. Set "lost"/"revoked" to instantly disable a physical card.',
        group: 'card',
      },
      issuedBy: {
        type: 'string',
        readOnly: true,
        description: 'User id of the admin who registered the card',
        group: 'audit',
      },
      issuedAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        group: 'audit',
      },
      lastUsedAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        group: 'audit',
      },
      // Full lifecycle/usage trail (registered, used, revoked, lost) is written
      // to the generic activity log via recordActivity(DataType.access_card,
      // cardId, ...) — same infra as login history. Only the at-a-glance
      // lastUsedAt is kept on the record itself.
    },
    required: ['cardUid', 'employeeId'],
  } as const;
};

const ach = AccessCardSchema();
export type AccessCardModel = FromSchema<typeof ach>;

registerCollection('Access Card', DataType.access_card, AccessCardSchema());
