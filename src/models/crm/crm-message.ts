import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const MessageSchema = () => {
    return {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                fieldType: 'richtext'
            },
            template: {
                type: 'string',
            },
            type: {
                type: 'string',
                enum: ['dialog', 'alert', 'popup', 'email', 'sms', 'whatsapp', 'slack']
            },
            source: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            from: {
                type: 'string',
            },
            to: {
                type: 'string',
            },
            files: {
                type: 'array',
                items: {
                    type: 'object'
                }
            },
            conversation: {
                type: 'string',
            },
        },
    } as const;
};

const ms = MessageSchema();
export type MessageModel = FromSchema<typeof ms>;


export const MessageUI = (): CollectionUI[] => { return null };
export const MessageRules = (): CollectionRule[] => { return null };
registerCollection('Message', DataType.message, MessageSchema(), MessageUI(), MessageRules(), true)
