
import { FromSchema } from 'json-schema-to-ts';
export type CountryState = FromSchema<typeof CountryStateSchema>;

export const CountryStateSchema = {
    type: 'object',
    properties: {
        "countryid": {
            "type": "integer",
        },
        "code": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
        phonecode: {
            "type": "string"
        }
    }
} as const