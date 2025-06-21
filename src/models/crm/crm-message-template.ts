import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType } from '../../types';

export const MessageTemplateSchema = () => {
  return {
    type: 'object',
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
      html: {
        type: 'string',
        'x-control': 'richtext',
        displayStyle: 'full',
        hidden: true,
      },
      text: {
        type: 'string',
        'x-control-variant': 'textarea',
        hidden: true,
      },
      thumbnail: {
        type: 'string',
      },
    },
  } as const;
};

const dd = MessageTemplateSchema();
export type MessageTemplateModel = FromSchema<typeof dd>;

export const MessageTemplateUI = (): CollectionUI[] => {
  return null;
};
export const MessageTemplateRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'MessageTemplate',
  DataType.messagetemplate,
  MessageTemplateSchema(),
  MessageTemplateUI(),
  MessageTemplateRules(),
  true
);
