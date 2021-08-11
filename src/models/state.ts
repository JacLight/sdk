import { FromSchema } from 'json-schema-to-ts';

export const CountryStateSchema = () => {
    return {
        type: 'object',
        properties: {
            countryid: {
                type: 'integer',
            },
            code: {
                type: 'string',
            },
            name: {
                type: 'string',
            },
            phonecode: {
                type: 'string',
            },
        },
    } as const;
}

const dd = CountryStateSchema();
export type CountryStateModel = FromSchema<typeof dd>;