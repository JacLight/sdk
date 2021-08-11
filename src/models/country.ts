import { FromSchema } from 'json-schema-to-ts';

export const CountrySchema = () => {
    return {
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
            idd: {
                type: 'string',
            },
            ziprequired: {
                type: 'string',
                default: 'false',
            },
        },
    } as const;
}

const dd = CountrySchema();
export type CountryModel = FromSchema<typeof dd>