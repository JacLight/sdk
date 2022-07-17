import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const ChatMessageSchema = () => {
    return {
        type: 'object',
        properties: {
            message: {
                type: 'string',
            },
            user: {
                type: 'string',
            },
            conversation: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
        },
    } as const;
};

const cms = ChatMessageSchema();
export type ChatMessageModel = FromSchema<typeof cms>;


export const ChatConversationSchema = () => {
    return {
        type: 'object',
        properties: {
            users: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            status: {
                type: 'string',
            },
        },
    } as const;
};

const ccs = ChatConversationSchema();
export type ChatConversationModel = FromSchema<typeof ccs>;


export const ChatRegisterSchema = () => {
    return {
        type: 'object',
        properties: {
            socketId: {
                type: 'string',
                fieldType: "Upload",
            },
            user: {
                type: 'string',
            },
            conversation: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
        },
    } as const;
};

const crs = ChatRegisterSchema();
export type ChatRegisterModel = FromSchema<typeof crs>;
export const ChatUI = (): CollectionUI[] => { return null };
export const ChatRules = (): CollectionRule[] => { return null };
registerCollection('Chat Message', DataType.chatmessage, ChatMessageSchema(), ChatUI(), ChatRules(), true)
registerCollection('Chat Conversation', DataType.chatconversation, ChatConversationSchema(), ChatUI(), ChatRules(), true)
registerCollection('Chat Register', DataType.chatregister, ChatRegisterSchema(), ChatUI(), ChatRules(), true)
