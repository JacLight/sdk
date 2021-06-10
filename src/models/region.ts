
import { FromSchema } from 'json-schema-to-ts';
export type RegionModel = FromSchema<typeof RegionSchema>;

export const RegionSchema = {
    type: 'object',
    properties: {
        "countryid": {
            "type": "integer",
        },
        "regioncode": {
            "type": "string"
        },
        "name": {
            "type": "string"
        },
    }
} as const