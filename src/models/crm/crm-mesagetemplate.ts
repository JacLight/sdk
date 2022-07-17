import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const MessageTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      from: {
        type: 'string',
      },
      to: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      sections: {
        type: 'array',
        hidden: true
      },
      email: {
        type: 'string',
        fieldType: 'Rich Text Editor',
        displayStyle: 'full',
      },
      emailText: {
        type: 'string',
        inputStyle: 'textarea',
      },
      sms: {
        type: 'string',
        inputStyle: 'textarea',
        maxLength: 150,
      },
    },
  } as const;
};

const dd = MessageTemplateSchema();
export type MessageTemplateModel = FromSchema<typeof dd>;

export const MessageTemplateUI = (): CollectionUI[] => { return null };
export const MessageTemplateRules = (): CollectionRule[] => { return null };
registerCollection('MessageTemplate', DataType.messagetemplate, MessageTemplateSchema(), MessageTemplateUI(), MessageTemplateRules(), true)
