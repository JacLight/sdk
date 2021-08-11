import { FromSchema } from 'json-schema-to-ts';


export const UserSchema = () => {
    return {
        type: 'object',
        properties: {
            email: {
                type: 'string',
            },
            portrait: {
                type: 'integer',
            },
            language: {
                type: 'string',
            },
            timezone: {
                type: 'string',
            },
            greeting: {
                type: 'string',
            },
            comments: {
                type: 'string',
            },
            firstname: {
                type: 'string',
            },
            middlename: {
                type: 'string',
            },
            lastname: {
                type: 'string',
            },
            title: {
                type: 'string',
            },
            lockout: {
                type: 'string',
                default: 'false',
            },
            lockoutdate: {
                type: 'string',
                format: 'date-time',
            },
            status: {
                type: 'number',
            },
            address: {
                type: 'array',
                items: { type: 'object' }
            },
            password: {
                type: 'string',
            },
            passwordreset: {
                type: 'string',
                default: 'false',
            },
            passwordmodifieddate: {
                type: 'string',
                format: 'date-time',
            },
            reminderquestion: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        question: {
                            type: 'string'
                        },
                        answer: {
                            type: 'string'
                        },
                    }
                }
            },
            facebookid: {
                type: 'integer',
            },
            googleuserid: {
                type: 'string',
            },
            ldapserverid: {
                type: 'integer',
            },
            openid: {
                type: 'string',
            },
            logindate: {
                type: 'string',
                format: 'date-time',
            },
            loginip: {
                type: 'string',
            },
            lastlogindate: {
                type: 'string',
                format: 'date-time',
            },
            lastloginip: {
                type: 'string',
            },
            lastfailedlogindate: {
                type: 'string',
                format: 'date-time',
            },
            failedloginattempts: {
                type: 'number',
            },
            passwordpolicy: {
                type: 'string',
            },
            groups: {
                type: 'array',
                items: { type: 'string' },
            },
            roles: {
                type: 'array',
                items: { type: 'string' },
            },
        }
    } as const
}

export const UserGroupSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            passwordpolicy: {
                type: 'string',
            },
            roles: {
                type: 'array',
                items: { type: 'string' },
            },
        },
    } as const
}

export const UserRoleSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            permissions: {
                type: 'array',
                items: { type: 'string' },
            },
            users: {
                type: 'array',
                items: { type: 'string' },
            },
            groups: {
                type: 'array',
                items: { type: 'string' },
            },
        },
    } as const
}

const ush = UserSchema();
const usgh = UserGroupSchema();
const usrh = UserRoleSchema();

export type UserModel = FromSchema<typeof ush>;
export type UserGroupModel = FromSchema<typeof usgh>;
export type UserRoleModel = FromSchema<typeof usrh>;