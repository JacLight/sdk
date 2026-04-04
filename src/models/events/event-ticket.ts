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
      // Ticket Type (reference to event_ticket_type record — name, color, perks come from there)
      ticketType: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event_ticket_type,
          value: 'sk',
          label: 'title',
        },
        group: 'ticket-type',
      },

      // Holder
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
      holderEmail: {
        type: 'string',
        format: 'email',
        title: 'Holder Email',
      },
      holderName: {
        type: 'string',
        title: 'Holder Name',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'checked_in', 'cancelled', 'refunded', 'transferred'],
        default: 'pending',
      },

      // Code — ticket.name is the static code (print on wristbands, badges, etc.)
      // code is the rotating signed payload for mobile app (expires in 60s)
      code: { type: 'string', readOnly: true },
      codeSecret: { type: 'string', hidden: true },
      codeLastRotated: { type: 'string', format: 'date-time', hidden: true },

      // Badge
      badgePrinted: { type: 'boolean', default: false, readOnly: true },
      badgePrintedAt: { type: 'string', format: 'date-time', readOnly: true },

      // Fulfillment (accreditation desk)
      fulfilledAt: { type: 'string', format: 'date-time', readOnly: true },
      fulfilledBy: { type: 'string', readOnly: true },
      accreditationPoint: { type: 'string', readOnly: true },

      // Perks (populated from ticket type definition on issue)
      perks: {
        type: 'array',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            perkId: { type: 'string', title: 'Perk ID' },
            name: { type: 'string', title: 'Name' },
            type: { type: 'string', enum: ['perk', 'access', 'companion', 'addon'] },
            quantity: { type: 'number', default: 1 },
            claimedCount: { type: 'number', default: 0 },
            claims: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  claimedAt: { type: 'string', format: 'date-time' },
                  claimedBy: { type: 'string' },
                  scanPointId: { type: 'string' },
                  fulfilledAt: { type: 'string', format: 'date-time' },
                  fulfilledBy: { type: 'string' },
                  badgePrinted: { type: 'boolean', default: false },
                  badgePrintedAt: { type: 'string', format: 'date-time' },
                  code: { type: 'string' },
                },
              },
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
            scanPointId: { type: 'string' },
          },
        },
      },
      lastCheckIn: { type: 'string', format: 'date-time', readOnly: true },
      currentZone: { type: 'string', readOnly: true },

      // Purchase
      purchase: {
        type: 'object',
        collapsible: true,
        properties: {
          bookingId: { type: 'string' },
          transactionId: { type: 'string' },
          amount: { type: 'number' },
          currency: { type: 'string', default: 'USD' },
          purchasedAt: { type: 'string', format: 'date-time' },
          paymentMethod: { type: 'string' },
          promoCode: { type: 'string' },
          discount: { type: 'number' },
        },
      },

      amountPaid: { type: 'number', default: 0, readOnly: true },
      payments: {
        type: 'array', readOnly: true, items: {
          type: 'object', properties: {
            amount: { type: 'number' }, gateway: { type: 'string' }, ref: { type: 'string' },
            method: { type: 'string' }, date: { type: 'string' }, transactionId: { type: 'string' },
          },
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
      notes: { type: 'string', 'x-control-variant': 'textarea' },
      tags: { type: 'array', items: { type: 'string' } },
    },
    required: ['event', 'ticketType'],
  } as const;
};

const ets = EventTicketSchema();
export type EventTicketModel = FromSchema<typeof ets>;

registerCollection('EventTicket', DataType.event_ticket, EventTicketSchema());
