import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * Event Credential Schema
 *
 * Physical items (badges, wristbands, NFC tags) pre-printed with unique codes.
 * At accreditation, staff scans the code and links it to a ticket.
 * At gates, scanners read the code to find the linked ticket.
 */
export const EventCredentialSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['random-string::12', 'uri'],
      },
      event: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'name',
          label: 'title',
        },
      },

      // The unique code on the physical item
      code: {
        type: 'string',
        unique: true,
        description: 'Barcode, QR, or NFC UID on the physical item',
      },
      type: {
        type: 'string',
        enum: ['badge', 'wristband', 'lanyard', 'nfc_tag', 'card', 'sticker', 'other'],
        default: 'wristband',
      },
      codeFormat: {
        type: 'string',
        enum: ['barcode', 'qr', 'nfc', 'rfid', 'manual'],
        default: 'barcode',
      },

      // Status
      status: {
        type: 'string',
        enum: ['available', 'assigned', 'revoked', 'damaged', 'lost'],
        default: 'available',
      },

      // Linked ticket (set when assigned at accreditation)
      ticket: {
        type: 'string',
        dataSource: {
          source: 'collection',
          collection: DataType.event_ticket,
          value: 'name',
          label: 'name',
        },
      },

      // Badge template used to print this
      badgeTemplateId: {
        type: 'string',
        dataSource: {
          source: 'collection',
          collection: DataType.event_badge_template,
          value: 'name',
          label: 'title',
        },
      },

      // Batch tracking
      batchId: { type: 'string', description: 'Batch/shipment ID for inventory' },

      // Assignment
      assignedAt: { type: 'string', format: 'date-time' },
      assignedBy: { type: 'string' },
      accreditationPoint: { type: 'string' },

      // Revocation
      revokedAt: { type: 'string', format: 'date-time' },
      revokedBy: { type: 'string' },
      revokeReason: { type: 'string' },

      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['event', 'code'],
  } as const;
};

const ecs = EventCredentialSchema();
export type EventCredentialModel = FromSchema<typeof ecs>;

registerCollection('EventCredential', DataType.event_credential, EventCredentialSchema());
