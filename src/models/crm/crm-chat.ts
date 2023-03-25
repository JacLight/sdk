import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui'; import { DataType } from '../../types';
import { UserSchema } from '../user';

export const ChatMessageSchema = () => {
    return {
        type: 'object',
        properties: {
            content: {
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
            },
            status: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
            sentTime: {
                type: 'number',
            },
            deliveredTime: {
                type: 'number',
            },
            readTime: {
                type: 'number',
            },
            user: {
                ...UserSchema(),
                hidden: true,
            },
        },
    } as const;
};

const cms = ChatMessageSchema();
export type ChatMessageModel = FromSchema<typeof cms>;


export const ChatGroupSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            admins: {
                type: 'array',
                items: {
                    type: 'string',
                }
            },
            emails: {
                type: 'array',
                items: {
                    type: 'string',
                }
            },
            users: {
                type: 'array',
                items: UserSchema()
            },
            status: {
                type: 'string',
            },
        },
    } as const;
};

const ccs = ChatGroupSchema();
export type ChatGroupModel = FromSchema<typeof ccs>;


export const ChatUI = (): CollectionUI[] => { return null };
export const ChatRules = (): CollectionRule[] => { return null };
registerCollection('Chat Message', DataType.chatmessage, ChatMessageSchema(), ChatUI(), ChatRules(), true)
registerCollection('Chat Group', DataType.chatgroup, ChatGroupSchema(), ChatUI(), ChatRules(), true)
