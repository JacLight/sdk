import { FromSchema } from 'json-schema-to-ts';

export const SettingSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
        },
        owner: {
            type: 'string',
        },
        setting: {
            type: 'array',
            items: {
                "type": "object",
                "properties": {
                    target: {
                        type: 'string',
                    },
                    value: {
                        type: 'string'
                    }
                }
            }
        }
    },
} as const;


export type SettingModel = FromSchema<typeof SettingSchema>;
