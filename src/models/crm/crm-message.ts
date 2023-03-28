import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const MessageSchema = () => {
  return {
    type: 'object',
    properties: {
      fromEmail: {
        type: 'string',
      },
      fromPhone: {
        type: 'string',
      },
      toEmail: {
        type: 'string',
        inputStyle: 'textarea',
      },
      toPhone: {
        type: 'string',
        inputStyle: 'textarea',
      },
      bodyHtml: {
        title: 'Content',
        type: 'string',
        fieldType: 'richtext',
      },
      text: {
        title: 'Content as text',
        type: 'string',
        inputStyle: 'textarea',
        rows: 4,
        displayStyle: 'outlined',
      },
      sms: {
        type: 'string',
        rows: 4,
        displayStyle: 'outlined',
        inputStyle: 'textarea',
      },
      title: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['dialog', 'alert', 'popup', 'email', 'sms', 'whatsapp', 'slack'],
        default: 'email',
      },
      maxTries: {
        type: 'number',
        default: 3,
      },
      source: {
        type: 'string',
        fieldType: 'label',
      },
      status: {
        type: 'string',
        fieldType: 'label',
      },
      tries: {
        type: 'number',
        fieldType: 'label',
      },

      statusHistory: {
        type: 'array',
        fieldType: 'label',
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

      files: FileInfoSchema(),
    },
    required: ['message', 'to', 'title', 'type'],
  } as const;
};
const ms = MessageSchema();
export type MessageModel = FromSchema<typeof ms>;

export const MessageUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'Instant Send',
          items: [
            {
              '0': '/properties/type',
            },
            {
              '0': '/properties/fromEmail',
              '1': '/properties/toEmail',
            },
            {
              '0': '/properties/fromPhone',
              '1': '/properties/toPHone',
            },
            {
              '0': '/properties/title',
            },
            {
              '0': '/properties/bodyHtml',
            },
            {
              '0': '/properties/text',
            },
            {
              '0': '/properties/sms',
            },
            {
              '0': '/properties/files',
            },
            {
              '0': '/properties/source',
              '1': '/properties/status',
            },
          ],
        },
      ],
    },
  ];
};

export const MessageRules = (): CollectionRule[] => {
  return [
    {
      name: 'Hide HTML',
      action: [
        {
          operation: 'hide',
          targetField: [
            '/properties/bodyHtml',
            '/properties/text',
            '/properties/fromEmail',
            '/properties/toEmail',
          ],
        },
        {
          operation: 'show',
          targetField: [
            '/properties/sms',
            '/properties/fromPhone',
            '/properties/toPhone',
          ],
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'sms',
            field1: '/properties/type',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Show Text',
      action: [
        {
          operation: 'show',
          targetField: ['/properties/text'],
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: 'email',
            field1: '/properties/type',
            operation: 'equal',
          },
        ],
      },
    },
  ];
};

registerCollection(
  'Message',
  DataType.message,
  MessageSchema(),
  MessageUI(),
  MessageRules(),
  true
);
