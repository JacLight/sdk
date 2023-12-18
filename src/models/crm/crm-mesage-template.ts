import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';

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
        transform: 'uri'
      },
      from: {
        type: 'string',
      },
      to: {
        type: 'string',
        inputStyle: 'textarea',
      },
      title: {
        type: 'string',
      },
      blocks: {
        type: 'array',
        hidden: true,
      },
      bodyHtml: {
        type: 'string',
        fieldType: 'Rich Text Editor',
        displayStyle: 'full',
        hidden: true,
      },
      text: {
        type: 'string',
        inputStyle: 'textarea',
        hidden: true,
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
