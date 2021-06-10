import { FromSchema } from 'json-schema-to-ts';
export type PhoneModel = FromSchema<typeof PhoneSchema>;

export const PhoneSchema = {
    type: 'object',
    properties: {
        number_: {
            type: 'string',
        },
        extension: {
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
} as const;
