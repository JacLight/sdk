import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

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
          json: ['email', 'sms', 'facebook', 'instagram', 'tiktok', 'twitter', 'linkedin', 'whatsapp', 'gbp', 'slack', 'pinterest', 'chat', 'push', 'notification', 'sitePopup', 'siteAlert'],
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
        'x-control': ControlType.selectMany,
        'x-control-variant': 'combo',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'store',
          value: 'from-accounts',
        },
        rules: [
          { operation: 'notIn', valueA: ['email', 'whatsapp', 'chat', 'slack', 'push'], valueB: '{{deliveryType}}', action: 'hide' },
        ],
      },
      status: {
        type: 'string',
        default: 'new',
        enum: ['new', 'pending', 'active', 'sent', 'delivered', 'read', 'failed', 'scheduled', 'draft'],
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
          filter: {
            property: 'deliveryTypes',
            operation: 'in',
            value: '{{deliveryType}}'
          }
        },
      },
      subject: {
        type: 'string',
        rules: [
          { operation: 'in', valueA: ['email'], valueB: '{{deliveryType}}', action: 'set-property', property: [{ key: 'inputRequired', value: true }] },
        ],
        watchedPaths: ['deliveryType'],
      },
      html: {
        title: 'Content',
        type: 'string',
        'x-control': 'richtext',
        rules: [
          { operation: 'notIn', valueA: ['email', 'sitePopup'], valueB: '{{deliveryType}}', action: 'hide' },
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
        reference: {
          type: 'string',
          hidden: true,
        }
      },
    },
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
