import { FromSchema } from 'json-schema-to-ts';
export type PhoneModel = FromSchema<typeof PhoneSchema>;

export const PhoneSchema = {
    type: 'object',
    properties: {
        phone: {
            type: 'string',
        },
        extension: {
            type: 'string',
        },
        typeid: {
            type: 'string',
        },
        primary: {
            type: 'string',
            default: 'false',
        },
    },
} as const;
