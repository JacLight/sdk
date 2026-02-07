import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const EventTicketSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::12', 'uri'],
        title: 'Ticket ID',
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
        group: 'event-info',
      },
      eventName: {
        type: 'string',
        readOnly: true,
        group: 'event-info',
      },

      // Ticket Type
      ticketType: {
        type: 'string',
        group: 'ticket-type',
      },
      ticketTypeName: {
        type: 'string',
        readOnly: true,
        group: 'ticket-type',
      },
      ticketTypeColor: {
        type: 'string',
        readOnly: true,
        group: 'ticket-type',
      },

      // Holder Information
      holder: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      // Status
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'checked_in', 'cancelled', 'refunded', 'transferred'],
        default: 'pending',
      },

      // QR Code
      qrCode: {
        type: 'string',
        readOnly: true,
      },
      qrSecret: {
        type: 'string',
        hidden: true,
      },
      qrLastRotated: {
        type: 'string',
        format: 'date-time',
        hidden: true,
      },

      // Accreditation
      accreditations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            name: { type: 'string' },
            zones: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },

      // Check-in tracking
      checkIns: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            zone: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
            direction: { type: 'string', enum: ['in', 'out'] },
            validator: { type: 'string' },
          },
        },
      },
      lastCheckIn: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      currentZone: {
        type: 'string',
        readOnly: true,
      },

      // Purchase Information
      purchase: {
        type: 'object',
        collapsible: true,
        properties: {
          orderId: { type: 'string' },
          transactionId: { type: 'string' },
          amount: { type: 'number' },
          currency: { type: 'string', default: 'USD' },
          purchasedAt: { type: 'string', format: 'date-time' },
          paymentMethod: { type: 'string' },
          promoCode: { type: 'string' },
          discount: { type: 'number' },
        },
      },

      // Transfer history
      transfers: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            fromHolder: { type: 'string' },
            toHolder: { type: 'string' },
            transferredAt: { type: 'string', format: 'date-time' },
            reason: { type: 'string' },
          },
        },
      },

      // Metadata
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['event', 'ticketType'],
  } as const;
};

const ets = EventTicketSchema();
export type EventTicketModel = FromSchema<typeof ets>;

registerCollection('EventTicket', DataType.event_ticket, EventTicketSchema());
