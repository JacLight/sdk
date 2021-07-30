import { FromSchema } from 'json-schema-to-ts';

export type SettingModel = FromSchema<typeof SettingSchema>;

export const SettingSchema = {
    type: 'object',
    properties: {
        type: {
            type: 'string',
        },
        group: {
            type: 'string',
        },
        owner: {
            type: 'string',
            enum: ['system', 'site', 'widget', 'group', 'uesr']
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
                        type: ['string', 'boolean', 'number']
                    }
                }
            }
        }
    },
} as const;



export const LogSchema = {
    type: 'object',
    properties: {
        machineLogId: { type: 'long' },
        sourceType: { type: 'String' },
        sourceId: { type: 'long' },
        logType: { type: 'String' },
        logMessage: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;
