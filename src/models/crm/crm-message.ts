import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '../fileinfo';


//add context to system emails can be regenerated - select the template adn add the data
export const MessageSchema = () => {
  return {
    type: 'object',
    properties: {
      deliveryType: {
        type: 'string',
        enum: ['email', 'sms', 'whatsapp', 'slack', 'instant', 'push', 'notification', 'site-popup', 'site-dialog', 'site-alert'],
        default: 'email',
      },
      template: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate
        },
      },
      from: {
        type: 'string',
      },
      to: {
        type: 'array',
        fieldType: FieldType.selectionmultiple,
        hideLabel: true,
        inputStyle: 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getMessageRecipients',
        },
      },
      subject: {
        type: 'string',
      },
      html: {
        title: 'Content',
        collapsible: true,
        type: 'string',
        fieldType: 'richtext',
      },
      text: {
        collapsible: true,
        title: 'Content as text',
        type: 'string',
        inputStyle: 'textarea',
        rows: 4,
        displayStyle: 'outlined',
      },
      source: {
        type: 'string',
        fieldType: 'label',
      },
      status: {
        type: 'string',
        fieldType: 'label',
      },
      type: {
        type: 'string',
      },
      tries: {
        type: 'number',
        fieldType: 'label',
      },
      statusHistory: {
        type: 'array',
        fieldType: 'label',
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
      files: {
        type: 'array',
        collapsible: true,
        allowDelete: true,
        fieldType: FieldType.file,
        items: FileInfoSchema(),
      },
      context: {
        type: 'array',
        fieldType: FieldType.collection,
        collapsible: true,
        displayStyle: 'table',
        inputStyle: 'picker',
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
    required: ['to', 'title', 'deliveryType', 'from'],
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
              '0': '/properties/from',
              '1': '/properties/template',
              '2': '/properties/deliveryType',
            },
            {
              '0': '/properties/to',
            },
            {
              '0': '/properties/subject',
            },
            {
              '0': '/properties/html',
            },
            {
              '0': '/properties/text',
            },
            {
              '0': '/properties/files',
            },
            {
              '0': '/properties/context',
            },
          ],
        },
      ],
    },
  ];
};


registerCollection(
  'Message',
  DataType.message,
  MessageSchema(),
  MessageUI(),
  null,
  true
);
