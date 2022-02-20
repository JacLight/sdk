import { FromSchema } from 'json-schema-to-ts';

export const SettingSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
            },
            ownertype: {
                type: 'string' // System, Role, Group, User
            },
            ownerid: {
                type: 'string'
            },
            '^setting_': {
                type: 'object',
                displayStyle: 'card',
                properties: {
                    '^property_': {
                        type: 'string',
                    }
                }

            }
        },
    } as const;
}

export const LogSchema = () => {
    return {
        type: 'object',
        properties: {
            sourceType: { type: 'string' },
            source: { type: 'string' },
            logType: { type: 'string' },
            logMessage: { type: 'string' },
            status: { type: 'string' },
        },
    } as const;
}

const ush = LogSchema();
const usgh = SettingSchema();

export type SettingModel = FromSchema<typeof usgh>;
export type LogModel = FromSchema<typeof ush>;