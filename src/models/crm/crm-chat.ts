import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';
import { UserSchema } from '../user';

export const ChatMessageSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: 'string',
            },
            message: {
                type: 'string',
            },
            userId: {
                type: 'string',
            },
            user: UserSchema(),
            conversationId: {
                type: 'string',
            },
            conversation: {
                type: 'object',
                properties: {
                    id: {
                        type: 'string',
                    },
                }
            },
            status: {
                type: 'string',
            },
            time: {
                type: 'number',
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
            id: {
                type: 'string',
            },
            userIds: {
                type: 'array',
                items: {
                    type: 'string',
                }
            },
            users: {
                type: 'array',
                items: UserSchema()
            },
            messages: {
                type: 'array',
                items: ChatMessageSchema()
            },
            socketId: {
                type: 'string',
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
            user: UserSchema(),
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
