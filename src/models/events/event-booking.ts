import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const EventBookingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::9', 'uri'],
        title: 'Booking Reference',
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
      // Buyer
      email: {
        type: 'string',
        format: 'email',
        title: 'Buyer Email',
      },
      holderName: {
        type: 'string',
        title: 'Buyer Name',
      },
      phone: {
        type: 'string',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'paid', 'confirmed', 'cancelled', 'refunded', 'expired'],
        default: 'pending',
      },

      // Items
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ticketTypeId: { type: 'string' },
            quantity: { type: 'number' },
            unitPrice: { type: 'number' },
            amount: { type: 'number' },
          },
        },
      },
      ticketCount: {
        type: 'number',
        default: 0,
      },

      // Pricing
      subtotal: { type: 'number', default: 0 },
      discount: { type: 'number', default: 0 },
      tax: { type: 'number', default: 0 },
      total: { type: 'number', default: 0 },
      currency: { type: 'string', default: 'USD' },
      promoCode: { type: 'string' },

      // Payment
      payment: {
        type: 'object',
        properties: {
          method: { type: 'string', enum: ['stripe', 'paypal', 'card', 'cash', 'free', 'other'] },
          status: { type: 'string', enum: ['pending', 'processing', 'paid', 'failed', 'refunded'] },
          ref: { type: 'string', title: 'Payment Reference' },
          gateway: { type: 'string' },
          paidAt: { type: 'string', format: 'date-time' },
          refundedAt: { type: 'string', format: 'date-time' },
          refundAmount: { type: 'number' },
          stripePaymentIntentId: { type: 'string' },
          stripeClientSecret: { type: 'string' },
          paypalOrderId: { type: 'string' },
        },
      },

      // Timestamps
      confirmedAt: { type: 'string', format: 'date-time' },
      cancelledAt: { type: 'string', format: 'date-time' },
      cancelReason: { type: 'string' },
      expiresAt: {
        type: 'string',
        format: 'date-time',
        title: 'Payment Deadline',
        description: 'Pending bookings expire after this time',
      },

      // Notes
      notes: { type: 'string' },
    },
    required: ['event', 'email'],
  } as const;
};

const eb = EventBookingSchema();
export type EventBookingModel = FromSchema<typeof eb>;

registerCollection('EventBooking', DataType.event_booking, EventBookingSchema());
