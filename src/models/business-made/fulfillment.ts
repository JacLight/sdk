import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const FulfillmentItemSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productSKU: { type: 'string' },
      productName: { type: 'string' },
      quantity: {
        type: 'number',
        default: 1,
      },
      modifiers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            groupId: { type: 'string' },
            groupName: { type: 'string' },
            optionId: { type: 'string' },
            optionName: { type: 'string' },
            price: { type: 'number' },
          },
        },
      },
      specialInstructions: { type: 'string' },
      status: {
        type: 'string',
        enum: ['pending', 'sent', 'preparing', 'ready', 'completed', 'cancelled'],
        default: 'pending',
      },
      sentAt: { type: 'string', format: 'date-time' },
      startedAt: { type: 'string', format: 'date-time' },
      readyAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      voidReason: { type: 'string' },
      voidedBy: { type: 'string' },
      voidedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'productSKU', 'productName', 'quantity'],
  } as const;
};

export const FulfillmentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::ful-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      orderNumber: {
        type: 'string',
        description: 'Order number/identifier',
        group: 'order',
      },
      station: {
        type: 'string',
        description: 'Fulfillment station (kitchen, pickup, bar, etc.)',
        group: 'station',
      },
      locationId: {
        type: 'string',
        description: 'Reference to table, room, counter, etc.',
        group: 'location',
      },
      locationName: {
        type: 'string',
        group: 'location',
      },
      locationType: {
        type: 'string',
        enum: ['table', 'room', 'counter', 'pickup', 'delivery', 'drive-thru'],
        group: 'location',
      },
      seatId: {
        type: 'string',
        description: 'Specific seat within location',
        group: 'location',
      },
      assignedTo: {
        type: 'string',
        description: 'Staff member assigned to fulfill',
        group: 'staff',
      },
      items: {
        type: 'array',
        items: FulfillmentItemSchema(),
      },
      priority: {
        type: 'string',
        enum: ['normal', 'rush', 'urgent', 'vip'],
        default: 'normal',
        group: 'status',
      },
      status: {
        type: 'string',
        enum: ['pending', 'in_progress', 'ready', 'completed', 'cancelled'],
        default: 'pending',
        group: 'status',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      sentAt: { type: 'string', format: 'date-time' },
      startedAt: { type: 'string', format: 'date-time' },
      readyAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      completedBy: { type: 'string' },
      fulfillmentTime: {
        type: 'number',
        description: 'Time in seconds from sent to completed',
      },
    },
    required: ['orderNumber'],
  } as const;
};

const f = FulfillmentSchema();
export type FulfillmentModel = FromSchema<typeof f>;

const fi = FulfillmentItemSchema();
export type FulfillmentItemModel = FromSchema<typeof fi>;

registerCollection('Fulfillment', DataType.bm_fulfillment, FulfillmentSchema());
