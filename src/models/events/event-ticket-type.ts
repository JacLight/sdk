import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const EventTicketTypeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        uniqueScope: ['event'],
        transform: ['random-string::10', 'uri'],
        title: 'ID',
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
      title: {
        type: 'string',
        title: 'Ticket Name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      slug: {
        type: 'string',
        title: 'Slug',
        description: 'URL-friendly name (e.g. "vip", "general")',
      },

      // Visual
      color: {
        type: 'string',
        'x-control': ControlType.color,
      },

      // Pricing
      price: {
        type: 'number',
        title: 'Price',
        default: 0,
      },
      currency: {
        type: 'string',
        default: 'USD',
      },

      // Capacity & Sales
      capacity: {
        type: 'number',
        title: 'Total Capacity',
      },
      soldCount: {
        type: 'number',
        default: 0,
        readOnly: true,
      },
      saleStartDate: {
        type: 'string',
        format: 'date-time',
        title: 'Sale Opens',
      },
      saleEndDate: {
        type: 'string',
        format: 'date-time',
        title: 'Sale Closes',
      },
      isActive: {
        type: 'boolean',
        default: true,
      },
      maxPerOrder: {
        type: 'number',
        title: 'Max Per Order',
        description: 'Maximum number of tickets a customer can buy in one order',
        default: 10,
      },
      maxPerCustomer: {
        type: 'number',
        title: 'Max Per Customer',
        description: 'Maximum tickets a single customer can hold for this type',
      },
      sortOrder: {
        type: 'number',
        default: 0,
      },

      // Rules
      allowReentry: {
        type: 'boolean',
        default: false,
        title: 'Allow Re-entry',
      },
      reentryLimit: {
        type: 'number',
        title: 'Re-entry Limit',
        description: 'Max re-entries allowed. Empty = unlimited when re-entry is on.',
      },
      allowTransfer: {
        type: 'boolean',
        default: false,
        title: 'Allow Transfer',
      },
      transferDeadline: {
        type: 'string',
        format: 'date-time',
        title: 'Transfer Deadline',
        description: 'No transfers after this date',
      },
      transferPreservesPerks: {
        type: 'boolean',
        default: true,
        title: 'Preserve Claimed Perks on Transfer',
        description: 'When transferred, already claimed perks stay claimed',
      },

      // Zone Access
      zoneAccess: {
        type: 'array',
        title: 'Zone Access',
        description: 'Which zones this ticket grants access to',
        items: { type: 'string' },
      },

      // Session Access
      sessionAccess: {
        type: 'array',
        title: 'Session Access',
        description: 'Specific sessions this ticket can attend. Empty = all public sessions.',
        items: { type: 'string' },
      },

      // Perks included with this ticket type
      perks: {
        type: 'array',
        title: 'Included Perks',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', title: 'Perk ID' },
            name: { type: 'string', title: 'Perk Name' },
            type: {
              type: 'string',
              enum: ['perk', 'access', 'companion', 'addon'],
              default: 'perk',
              title: 'Type',
            },
            description: { type: 'string' },
            quantity: { type: 'number', default: 1, title: 'Quantity' },
            autoIssue: {
              type: 'boolean',
              default: false,
              title: 'Auto-issue on purchase',
            },
            scanPointFilter: {
              type: 'array',
              title: 'Valid Scan Points',
              description: 'Scan point IDs where this perk can be redeemed. Empty = any.',
              items: { type: 'string' },
            },
            badgeTemplateId: {
              type: 'string',
              title: 'Badge Template',
              description: 'Badge template for printing this perk (e.g. lunch wristband)',
            },
          },
        },
      },

      // Badge
      badgeTemplateId: {
        type: 'string',
        title: 'Badge Template',
        description: 'Badge template for the main ticket badge',
      },
    },
    required: ['event', 'title'],
  } as const;
};

const etts = EventTicketTypeSchema();
export type EventTicketTypeModel = FromSchema<typeof etts>;

registerCollection('EventTicketType', DataType.event_ticket_type, EventTicketTypeSchema());
