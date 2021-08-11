import { FromSchema } from "json-schema-to-ts";

export const PasswordPolicySchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            historyAge: {
                type: 'number',
            },
            passwordAgeInDay: {
                type: 'number',
            },
            maxFailure: {
                type: 'number',
            },
            resetDelayInMinutes: {
                type: 'number',
            },
            syntax: {
                type: 'object',
                title: 'syntax',
                displayStyle: 'card',
                properties: {
                    enable: {
                        type: 'boolean',
                    },
                    allowDictionary: {
                        type: 'boolean',
                    },
                    minAlphaNumeric: {
                        type: 'number',
                    },
                    minLenght: {
                        type: 'number',
                    },
                    minLowercase: {
                        type: 'number',
                    },
                    minUppercase: {
                        type: 'number',
                    },
                    minNumbers: {
                        type: 'number',
                    },
                    minsSymbols: {
                        type: 'number',
                    },
                    pattern: {
                        type: 'string',
                    },
                },
            },
        },
    } as const;
};

const pps = PasswordPolicySchema();
export type PasswordPolicyModel = FromSchema<typeof pps>;
