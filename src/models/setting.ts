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




export const MachineControl = {
    type: 'object',
    properties: {
        machineControlId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        controlType: { type: 'String' },
        controlName: { type: 'String' },
        controlValue: { type: 'String' },
        controlParam: { type: 'String' },
    },
} as const;

export const MachineLog = {
    type: 'object',
    properties: {
        machineLogId: { type: 'long' },

        companyId: { type: 'long' },
        groupId: { type: 'long' },
        userId: { type: 'long' },
        createDate: { type: 'Date' },
        modifyDate: { type: 'Date' },
        remoteAppId: { type: 'long' },

        sourceType: { type: 'String' },
        sourceId: { type: 'long' },
        logType: { type: 'String' },
        logMessage: { type: 'String' },
        remarks: { type: 'String' },
        status: { type: 'String' },
    },
} as const;
