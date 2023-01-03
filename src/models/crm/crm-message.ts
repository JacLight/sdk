import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FormViewSectionType, FieldType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const MessageSchema = () => {
    return {
        type: 'object',
        properties: {
            email: {
                type: 'string',
                fieldType: 'richtext',
            },
            emailText: {
                type: 'string',
                inputStyle: 'textarea',
            },
            sms: {
                type: 'string',
                inputStyle: 'textarea',
            },
            title: {
                type: 'string',
            },
            template: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'self',
                    value: 'currencies',
                    label: 'currencies',
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
                inputStyle: 'textarea',
            },
            files: FileInfoSchema()
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
                            '1': '/properties/template',
                        },
                        {
                            '0': '/properties/from',
                            '1': '/properties/to',
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
                    targetField: '/properties/bodyHtml',
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
    ]
};

registerCollection('Message', DataType.message, MessageSchema(), MessageUI(), MessageRules(), true)
