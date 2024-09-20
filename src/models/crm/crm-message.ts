import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';


//add context to system emails can be regenerated - select the template adn add the data
export const MessageSchema = () => {
  return {
    type: 'object',
    properties: {
      deliveryType: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: ['email', 'sms', 'whatsapp', 'chat', 'facebook', 'intragram', 'twitter', 'gmb', 'tiktok', 'slack', 'push', 'notification', 'site-popup', 'site-alert'],
        },
        default: 'email',
        group: 'name',
      },
      templates: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          label: 'name',
          value: 'name',
        },
        items: {
          type: 'string',
        },
        group: 'name',
      },
      from: {
        type: 'string',
        group: 'from',
      },
      status: {
        type: 'string',
        default: 'new',
        enum: ['new', 'pending', 'sent', 'delivered', 'read', 'failed'],
        'x-control': 'label',
        group: 'from',
        readOnly: true,
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
        rules: [
          { operation: 'in', valueA: ['site-popup', 'gmb', 'site-alert'], valueB: '{{deliveryType}}', action: 'hide' },
        ],
      },
      subject: {
        type: 'string',
        rules: [
          { operation: 'notIn', valueA: ['email'], valueB: '{{deliveryType}}', action: 'hide' },
        ],
        watchedPaths: ['deliveryType'],
      },
      html: {
        title: 'Content',
        type: 'string',
        'x-control': 'richtext',
        rules: [
          { operation: 'notIn', valueA: ['email', 'site-popup'], valueB: '{{deliveryType}}', action: 'hide' },
          { operation: 'isNotEmpty', valueA: '{{templates}}', action: 'hide' },
        ],
        watchedPaths: ['deliveryType'],
        hideIn: ['table']
      },
      text: {
        title: 'Content',
        type: 'string',
        'x-control-variant': 'textarea',
        rows: 4,
        displayStyle: 'outlined',
        rules: [
          { operation: 'in', valueA: ['email', 'site-popup'], valueB: '{{deliveryType}}', action: 'hide' },
          { operation: 'isNotEmpty', valueA: '{{templates}}', action: 'hide' },
        ],
        watchedPaths: ['deliveryType'],
        hideIn: ['table']
      },
      files: {
        type: 'array',
        title: 'Attachments',
        collapsible: true,
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },
      source: {
        type: 'string',
        hidden: true,
        'x-control': 'label',
        group: 'status',
      },
      type: {
        type: 'string',
        group: 'status',
        hidden: true,
      },
      tries: {
        type: 'number',
        'x-control': 'label',
        hidden: true,
        group: 'status',
      },
      statusHistory: {
        type: 'array',
        hidden: true,
        'x-control': 'label',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
            },
            status: {
              type: 'string',
            },
            statusText: {
              type: 'string',
            },
          },
        },
      },
      conversationId: {
        type: 'string',
        hidden: true,
      },
      context: {
        type: 'array',
        'x-control': ControlType.collection,
        collapsible: true,
        hidden: true,
        displayStyle: 'table',
        'x-control-variant': 'picker',
        dataSource: {
          source: 'collection',
          collection: DataType.post,
        },
        items: {
          type: 'object',
          properties: {
            datatype: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
    },
    required: ['to', 'subject', 'deliveryType', 'from'],
  } as const;
};
const ms = MessageSchema();
export type MessageModel = FromSchema<typeof ms>;

registerCollection(
  'Message',
  DataType.message,
  MessageSchema(),
  null,
  null,
  true
);
