import { FromSchema } from "json-schema-to-ts";


export const AddressSchema = {
    type: 'object',
    properties: {
        street1: {
            type: 'string',
        },
        street2: {
            type: 'string',
        },
        street3: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
        zip: {
            type: 'string',
        },
        region: {
            type: 'string',
            enum: ['Home', "Work"]
        },
        country: {
            type: 'string',
            enum: ['Home', "Work"]
        },
        typeid: {
            type: 'string',
            enum: ['Home', "Work"]
        },
        mailing: {
            type: 'string',
            default: 'false',
        },
        primary: {
            type: 'string',
            default: 'false',
        },
        address: {
            type: 'string',
        },
    },
} as const;


export type AddressModel = FromSchema<typeof AddressSchema>