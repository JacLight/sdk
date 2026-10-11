import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { FileInfoSchema } from '../file-info';

import { DataType, ControlType } from '../../types';

export const MessageTemplateSchema = () => {
  return {
    type: 'object',
    ai: true,
    personalize: true,
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      from: {
        type: 'string',
        group: 'name',
      },
      subject: {
        type: 'string',
      },
      to: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getMessageRecipients',
        },
      },
      datatype: {
        type: 'string',
        group: 'datatype',
      },
      variant: {
        type: 'string',
        group: 'datatype',
      },
      subtype: {
        type: 'string',
        group: 'datatype',
      },
      deliveryType: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: [
            'email',
            'sms',
            'facebook',
            'instagram',
            'tiktok',
            'twitter',
            'linkedin',
            'whatsapp',
            'gbp',
            'slack',
            'pinterest',
            'chat',
            'push',
            'notification',
            'sitePopup',
            'siteAlert',
            // Thermal receipt printer (ESC/POS). Rendered server-side by
            // StorefrontPosPrintService against an order/payment context;
            // contentJSON holds the print line tree (text/image/twocol/loop/
            // divider/feed/cut). Common variants: 'receipt', 'check',
            // 'queue-ticket', 'kitchen-ticket'.
            'print',
          ],
        },
        default: 'email',
      },
      contentJSON: {
        type: 'object',
        properties: {},
        hidden: true,
      },
      // Marks this template as the active default for its (deliveryType,
      // variant) pair within the org. Server lookup matches isDefault=true
      // first; setting it on one template clears it on all other templates
      // of the same (deliveryType, variant). At most one per pair.
      isDefault: {
        type: 'boolean',
        default: false,
        exclusive: true,
      },
      html: {
        type: 'string',
        'x-control': 'richtext',
        displayStyle: 'full',
        hideIn: ['table'],
        rules: [
          {
            operation: 'notIn',
            valueA: ['email', 'sitePopup', 'siteAlert'],
            valueB: '{{deliveryType}}',
            action: 'hide',
          },
        ],
      },
      text: {
        type: 'string',
        'x-control-variant': 'textarea',
        socialControl: true,
        hideIn: ['table'],
      },
      files: {
        type: 'array',
        title: 'Attachments',
        collapsible: true,
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        rules: [
          {
            operation: 'in',
            valueA: ['sms', 'push', 'notification'],
            valueB: '{{deliveryType}}',
            action: 'hide',
          },
        ],
      },
      // WhatsApp: the template as Twilio Content, approved by Meta. Body = text
      // above with {{1}}-style variables.
      whatsapp: {
        type: 'object',
        title: 'WhatsApp',
        collapsible: true,
        hideIn: ['table'],
        rules: [
          { operation: 'notIn', valueA: ['whatsapp'], valueB: '{{deliveryType}}', action: 'hide' },
        ],
        watchedPaths: ['deliveryType'],
        properties: {
          contentSid: { type: 'string', readOnly: true, description: 'Twilio Content id (HX…) — replaced on each submit.' },
          category: {
            type: 'string',
            enum: ['UTILITY', 'MARKETING', 'AUTHENTICATION'],
            enumNames: ['Utility', 'Marketing', 'Authentication'],
            default: 'UTILITY',
          },
          language: { type: 'string', default: 'en' },
          header: {
            type: 'object',
            properties: {
              type: { type: 'string', enum: ['text', 'image', 'document', 'video'] },
              text: { type: 'string' },
              mediaUrl: { type: 'string' },
            },
          },
          footer: { type: 'string', maxLength: 60 },
          buttons: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['quick_reply', 'url', 'phone'] },
                text: { type: 'string', maxLength: 25 },
                url: { type: 'string' },
                phone: { type: 'string' },
              },
            },
          },
          approval: {
            type: 'object',
            readOnly: true,
            properties: {
              status: { type: 'string', enum: ['draft', 'pending', 'approved', 'rejected'], default: 'draft' },
              reason: { type: 'string' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      thumbnail: {
        type: 'string',
      },
    },
  } as const;
};

const dd = MessageTemplateSchema();
export type MessageTemplateModel = FromSchema<typeof dd>;

registerCollection(
  'MessageTemplate',
  DataType.messagetemplate,
  MessageTemplateSchema()
);
