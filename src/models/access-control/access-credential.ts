import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const ACCESS_CREDENTIAL_TYPES = ['card', 'fob', 'qr', 'mobile', 'plate', 'fingerprint', 'face'] as const;

// What identifies a person at an input device. It is only a link to the person:
// access comes from their roles and the zones' allow/deny lists, so one
// card works for doors, POS login and clock punches, and a replacement card
// carries everything over. Issue and status changes are written to
// access_event (type 'credential').
export const AccessCredentialSchema = () => {
  return {
    type: 'object',
    properties: {
      type: { type: 'string', enum: [...ACCESS_CREDENTIAL_TYPES], default: 'card', group: 'code' },
      code: {
        type: 'string',
        description: 'Card/fob chip UID, plate number, QR seed or biometric template ref.',
        group: 'code',
      },
      label: { type: 'string', description: 'Friendly name, e.g. "Front-desk guest card #3".', group: 'label' },
      batch: { type: 'string', description: 'Import batch this card came in, e.g. "HID-2026-10". Used to find or revoke a whole box at once.', group: 'label' },
      pin: {
        type: 'string',
        readOnly: true,
        hidden: true,
        description: 'This credential\'s PIN as salt.scrypt-hash. When set, the PIN must be entered with the card. Set through the access-control API, never stored or returned in clear.',
      },
      pinFailures: {
        type: 'number',
        readOnly: true,
        hidden: true,
        description: 'Wrong PINs in a row. The card is suspended when it reaches the lockout limit; a correct PIN or a PIN reset clears it.',
      },
      holder: {
        type: 'object',
        properties: {
          datatype: { type: 'string', enum: ['user', 'bm_employee', 'customer', 'event_ticket', 'guest'] },
          id: { type: 'string', notes: 'Id of the person record. Empty for guests.' },
          name: { type: 'string', notes: 'Guests only — a guest has no record elsewhere.' },
          email: { type: 'string', notes: 'Guests only.' },
          phone: { type: 'string', notes: 'Guests only.' },
          company: { type: 'string', notes: 'Guests only.' },
          host: { type: 'string', notes: 'Guests only: the user responsible for them.' },
          photo: FileInfoSchema(),
        },
        notes: 'The link to the person. A guest\'s details live here. Empty on pool cards until issued.',
      },
      validFrom: { type: 'string', format: 'date-time', group: 'validity' },
      validUntil: { type: 'string', format: 'date-time', group: 'validity' },
      status: {
        type: 'string',
        enum: ['available', 'active', 'suspended', 'returned', 'expired', 'revoked', 'lost'],
        default: 'active',
        description: 'Only "active" credentials open anything. "available" = blank pool card waiting to be issued.',
      },
      issuedBy: { type: 'string', readOnly: true, group: 'audit' },
      issuedAt: { type: 'string', format: 'date-time', disabled: true, group: 'audit' },
      lastUsedAt: { type: 'string', format: 'date-time', disabled: true, group: 'audit' },
    },
    required: ['type'],
  } as const;
};

const acs = AccessCredentialSchema();
export type AccessCredentialModel = FromSchema<typeof acs>;

registerCollection('Access Credential', DataType.access_credential, AccessCredentialSchema());
