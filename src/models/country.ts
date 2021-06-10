import { FromSchema } from 'json-schema-to-ts';
export type CountryModel = FromSchema<typeof CountrySchema>;

export const CountrySchema = {
    type: 'object',
    properties: {
        countryid: {
            type: 'integer',
        },
        name: {
            type: 'string',
        },
        a2: {
            type: 'string',
        },
        a3: {
            type: 'string',
        },
        code: {
            type: 'string',
        },
        idd_: {
            type: 'string',
        },
        ziprequired: {
            type: 'string',
            default: 'false',
        },
    },
} as const;
