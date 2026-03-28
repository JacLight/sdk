import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const EventBadgeTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
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
        title: 'Template Name',
      },

      // Sizing
      size: {
        type: 'string',
        enum: ['standard', 'small', 'wristband', 'lanyard', 'custom'],
        default: 'standard',
      },
      width: {
        type: 'number',
        title: 'Width (mm)',
        default: 85.6,
      },
      height: {
        type: 'number',
        title: 'Height (mm)',
        default: 54,
      },

      // Template
      template: {
        type: 'string',
        title: 'HTML Template',
        'x-control-variant': 'code',
        description: 'Handlebars HTML template for badge layout. Use {{ticketName}}, {{holderName}}, {{ticketType}}, {{eventName}}, {{qrCode}}, {{barcode}}, {{perkName}}, etc.',
      },

      // Display options
      showQR: {
        type: 'boolean',
        default: true,
        title: 'Show QR Code',
      },
      showBarcode: {
        type: 'boolean',
        default: false,
        title: 'Show Barcode',
      },
      showPhoto: {
        type: 'boolean',
        default: false,
        title: 'Show Attendee Photo',
      },

      isDefault: {
        type: 'boolean',
        default: false,
        title: 'Default Template',
        description: 'Used when no specific template is assigned to a ticket type',
      },
    },
    required: ['event', 'title'],
  } as const;
};

const ebt = EventBadgeTemplateSchema();
export type EventBadgeTemplateModel = FromSchema<typeof ebt>;

registerCollection('EventBadgeTemplate', DataType.event_badge_template, EventBadgeTemplateSchema());
