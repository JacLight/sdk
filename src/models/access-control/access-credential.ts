import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const ACCESS_CREDENTIAL_TYPES = ['card', 'fob', 'pin', 'qr', 'mobile', 'plate', 'fingerprint', 'face'] as const;

// What identifies a person at an input device. It is only a link to the person:
// access comes from their roles and the zones' allow/deny lists, so one
// card works for doors, POS login and clock punches, and a replacement card
// carries everything over. Issue and status changes are written to
// access_event (type 'credential').
export const AccessCredentialSchema = () => {
  return {
    type: 'object',
    properties: {
      type: { type: 'string', enum: [...ACCESS_CREDENTIAL_TYPES], default: 'card', group: 'credential' },
      code: {
        type: 'string',
        description: 'Card/fob chip UID, plate number, QR seed or biometric template ref. PINs are stored hashed.',
        group: 'credential',
      },
      label: { type: 'string', description: 'Friendly name, e.g. "Front-desk guest card #3".', group: 'credential' },
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
        group: 'credential',
      },
      validFrom: { type: 'string', format: 'date-time', group: 'validity' },
      validUntil: { type: 'string', format: 'date-time', group: 'validity' },
      status: {
        type: 'string',
        enum: ['available', 'active', 'suspended', 'returned', 'expired', 'revoked', 'lost'],
        default: 'active',
        description: 'Only "active" credentials open anything. "available" = blank pool card waiting to be issued.',
        group: 'validity',
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
