import { FromSchema } from 'json-schema-to-ts';
export type TagModel = FromSchema<typeof TagSchema>;

export const TagSchema = {
    type: 'object',
    properties: {
        "name": {
            "type": "string"
        },
        "assetcount": {
            "type": "integer",
            "format": "int32"
        },
        "lastpublishdate": {
            "type": "string",
            "format": "date-time"
        }
    }
} as const