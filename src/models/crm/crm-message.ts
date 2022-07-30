import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FormViewSectionType, FieldType } from '../../types';

export const MessageSchema = () => {
    return {
        type: 'object',
        properties: {
            message: {
                type: 'string',
                fieldType: 'richtext'
            },
            title: {
                type: 'string',
            },
            template: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'self',
                    field: 'currencies',
                },
            },
            type: {
                type: 'string',
                enum: ['dialog', 'alert', 'popup', 'email', 'sms', 'whatsapp', 'slack']
            },
            source: {
                type: 'string',
                fieldType: 'label'
            },
            status: {
                type: 'string',
                fieldType: 'label'
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


export const MessageUI = (): CollectionUI[] => {
    return [
        {
            type: FormViewSectionType.sectiontab,
            tab: [
                {
                    title: 'Site Info',
                    items: [
                        {
                            '0': '/properties/type',
                            '1': '/properties/template',
                        },
                        {
                            '0': '/properties/from',
                        },
                        {
                            '0': '/properties/to',
                        },
                        {
                            '0': '/properties/title',
                        },
                        {
                            '0': '/properties/message',
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


export const MessageRules = (): CollectionRule[] => { return null };
registerCollection('Message', DataType.message, MessageSchema(), MessageUI(), MessageRules(), true)
