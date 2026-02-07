import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const EventCheckInSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::12', 'uri'],
      },
      event: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'sk',
          label: 'title',
        },
      },
      ticket: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event_ticket,
          value: 'sk',
          label: 'name',
        },
      },
      attendee: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Check-in details
      direction: {
        type: 'string',
        enum: ['in', 'out'],
        default: 'in',
        group: 'direction',
      },
      zone: {
        type: 'string',
        group: 'zone',
      },
      zoneName: {
        type: 'string',
        group: 'zone',
      },
      checkpoint: {
        type: 'string',
      },

      // Timestamps
      timestamp: {
        type: 'string',
        format: 'date-time',
        group: 'timestamps',
      },
      day: {
        type: 'string',
        format: 'date',
        group: 'timestamps',
      },

      // Validation
      validatedBy: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      validatorDevice: {
        type: 'string',
      },
      validationMethod: {
        type: 'string',
        enum: ['qr_scan', 'manual', 'nfc', 'facial', 'api'],
        default: 'qr_scan',
      },

      // Status
      status: {
        type: 'string',
        enum: ['success', 'denied', 'flagged', 'override'],
        default: 'success',
      },
      denialReason: {
        type: 'string',
        enum: [
          'invalid_ticket',
          'wrong_zone',
          'capacity_full',
          'already_checked_in',
          'expired_ticket',
          'cancelled_ticket',
          'blacklisted',
          'other',
        ],
      },
      denialMessage: {
        type: 'string',
      },

      // Accreditation at time of check-in
      accreditations: {
        type: 'array',
        items: { type: 'string' },
      },
      ticketType: {
        type: 'string',
      },

      // Location data (optional)
      location: {
        type: 'object',
        properties: {
          lat: { type: 'number' },
          lng: { type: 'number' },
          accuracy: { type: 'number' },
        },
      },

      // Session check-in (if checking into specific session)
      session: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event_session,
          value: 'sk',
          label: 'title',
        },
      },
      sessionName: {
        type: 'string',
      },

      // Notes
      notes: {
        type: 'string',
      },
      flags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['event', 'ticket', 'direction', 'timestamp'],
  } as const;
};

const ecis = EventCheckInSchema();
export type EventCheckInModel = FromSchema<typeof ecis>;

registerCollection('EventCheckIn', DataType.event_checkin, EventCheckInSchema());
