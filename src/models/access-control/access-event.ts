import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// One log for everything that happens in access control:
//   type 'access'     — a request at an input device and its result (granted, denied, alarm)
//   type 'credential' — a credential issued, reassigned, or changing status
// so a person's day reads in one place: issued → lobby → floor 3 → returned.
export const AccessEventSchema = () => {
  return {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['access', 'credential'], default: 'access' },
      credential: { type: 'string', notes: 'access_credential sk.' },
      holder: {
        type: 'object',
        properties: { datatype: { type: 'string' }, id: { type: 'string' }, name: { type: 'string' } },
      },
      by: { type: 'string', notes: 'User / staff / system that acted (handheld operator, desk staff, admin).' },
      occurredAt: { type: 'string', format: 'date-time' },

      // type: access
      inputDevice: { type: 'string', notes: 'access_device name.' },
      grantingDevice: { type: 'string', notes: 'device_config name.' },
      zone: { type: 'string' },
      scopePath: { type: 'string' },
      direction: { type: 'string', enum: ['in', 'out'] },
      method: { type: 'string', enum: ['card', 'qr', 'door_qr', 'mobile', 'plate', 'fingerprint', 'face', 'remote', 'override'] },
      result: { type: 'string', enum: ['granted', 'denied', 'alarm'] },
      reason: {
        type: 'string',
        enum: [
          'no_policy',
          'denied_by_policy',
          'capacity_full',
          'credential_inactive',
          'expired',
          'pin_required',
          'pin_invalid',
          'pin_locked',
          'lockdown',
          'payment_failed',
          'unknown_credential',
        ],
      },
      alarm: { type: 'string', enum: ['forced', 'held_open', 'tailgate', 'tamper'] },
      charge: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          currency: { type: 'string' },
          paidFrom: { type: 'string' },
          transactionId: { type: 'string' },
        },
      },
      offline: { type: 'boolean', default: false, notes: 'Decided on the hub while disconnected, uploaded later.' },

      // type: credential
      action: { type: 'string', enum: ['imported', 'issued', 'status_changed', 'reassigned', 'validity_changed', 'pin_changed', 'replaced'] },
      fromStatus: { type: 'string' },
      toStatus: { type: 'string' },
      note: { type: 'string' },
    },
    required: ['type', 'occurredAt'],
  } as const;
};

const aes = AccessEventSchema();
export type AccessEventModel = FromSchema<typeof aes>;

registerCollection('Access Event', DataType.access_event, AccessEventSchema());
