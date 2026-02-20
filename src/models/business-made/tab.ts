import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const TabItemSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productSKU: { type: 'string' },
      productName: { type: 'string' },
      quantity: { type: 'number', default: 1 },
      price: { type: 'number' },
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
      seatId: { type: 'string' },
      addedAt: { type: 'string', format: 'date-time' },
      addedBy: { type: 'string' },
      voidReason: { type: 'string' },
      voidedBy: { type: 'string' },
      voidedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'productSKU', 'productName', 'quantity', 'price'],
  } as const;
};

export const TabPaymentSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      method: {
        type: 'string',
        enum: ['cash', 'card', 'gift_card', 'mobile', 'other'],
      },
      amount: { type: 'number' },
      tip: { type: 'number' },
      cardLast4: { type: 'string' },
      cardBrand: { type: 'string' },
      transactionId: { type: 'string' },
      paidAt: { type: 'string', format: 'date-time' },
      paidBy: { type: 'string' },
    },
    required: ['id', 'method', 'amount'],
  } as const;
};

export const TabSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::tab-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      // Location info
      locationId: {
        type: 'string',
        description: 'Table, room, counter ID',
        group: 'location',
      },
      locationName: {
        type: 'string',
        group: 'location',
      },
      locationType: {
        type: 'string',
        enum: ['table', 'room', 'counter', 'bar', 'pickup', 'delivery', 'drive-thru'],
        group: 'location',
      },
      seatId: {
        type: 'string',
        group: 'location',
      },
      previousLocationId: {
        type: 'string',
        description: 'Previous location before transfer',
      },
      // Card tab
      cardToken: {
        type: 'string',
        description: 'Tokenized card for tab',
        group: 'card',
      },
      cardLast4: {
        type: 'string',
        group: 'card',
      },
      cardBrand: {
        type: 'string',
        group: 'card',
      },
      // Customer info
      customerId: {
        type: 'string',
        group: 'customer',
      },
      customerName: {
        type: 'string',
        group: 'customer',
      },
      customerPhone: {
        type: 'string',
        group: 'customer',
      },
      // Staff
      serverId: {
        type: 'string',
        group: 'staff',
      },
      serverName: {
        type: 'string',
        group: 'staff',
      },
      // Items
      items: {
        type: 'array',
        items: TabItemSchema(),
      },
      // Payments
      payments: {
        type: 'array',
        items: TabPaymentSchema(),
      },
      // Totals
      subtotal: { type: 'number', default: 0 },
      tax: { type: 'number', default: 0 },
      taxRate: { type: 'number' },
      tip: { type: 'number', default: 0 },
      discount: { type: 'number', default: 0 },
      discountReason: { type: 'string' },
      total: { type: 'number', default: 0 },
      paidAmount: { type: 'number', default: 0 },
      balance: { type: 'number', default: 0 },
      // Status
      status: {
        type: 'string',
        enum: ['open', 'closed', 'split', 'void'],
        default: 'open',
        group: 'status',
      },
      // Split info
      parentTabId: { type: 'string' },
      splitType: {
        type: 'string',
        enum: ['even', 'items'],
      },
      splitNumber: { type: 'number' },
      totalSplits: { type: 'number' },
      splitInto: {
        type: 'array',
        items: { type: 'string' },
      },
      // Timestamps
      openedAt: { type: 'string', format: 'date-time' },
      closedAt: { type: 'string', format: 'date-time' },
      closedBy: { type: 'string' },
      transferredAt: { type: 'string', format: 'date-time' },
      splitAt: { type: 'string', format: 'date-time' },
      voidedAt: { type: 'string', format: 'date-time' },
      voidedBy: { type: 'string' },
      voidReason: { type: 'string' },
      // Notes
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
  } as const;
};

const t = TabSchema();
export type TabModel = FromSchema<typeof t>;

const ti = TabItemSchema();
export type TabItemModel = FromSchema<typeof ti>;

const tp = TabPaymentSchema();
export type TabPaymentModel = FromSchema<typeof tp>;

registerCollection('Tab', DataType.bm_tab, TabSchema());
