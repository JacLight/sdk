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
          ],
        },
        default: 'email',
      },
      contentJSON: {
        type: 'object',
        properties: {},
        hidden: true,
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
