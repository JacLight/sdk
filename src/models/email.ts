import { FromSchema } from 'json-schema-to-ts';
export type EmailModel = FromSchema<typeof EmailSchema>;



export const EmailSchema = {
    type: 'object',
    properties: {
        address: {
            type: 'string',
        },
        typeid: {
            type: 'integer',
        },
        primary_: {
            type: 'string',
            default: 'false',
        },
    },
} as const
