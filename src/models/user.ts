import { FromSchema } from 'json-schema-to-ts';
export type UserModel = FromSchema<typeof UserSchema>;
export type UserGroupModel = FromSchema<typeof UserGroupSchema>;

export const UserSchema = {
    type: 'object',
    properties: {
        contactid: {
            type: 'integer',
        },
        password_: {
            type: 'string',
        },
        passwordencrypted: {
            type: 'string',
            default: 'false',
        },
        passwordreset: {
            type: 'string',
            default: 'false',
        },
        passwordmodifieddate: {
            type: 'string',
            format: 'date-time',
        },
        digest: {
            type: 'string',
        },
        reminderqueryquestion: {
            type: 'string',
        },
        reminderqueryanswer: {
            type: 'string',
        },
        gracelogincount: {
            type: 'integer',
            format: 'int32',
        },
        screenname: {
            type: 'string',
        },
        emailaddress: {
            type: 'string',
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
        portraitid: {
            type: 'integer',
        },
        languageid: {
            type: 'string',
        },
        timezoneid: {
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
        jobtitle: {
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
            type: 'integer',
            format: 'int32',
        },
        lockout: {
            type: 'string',
            default: 'false',
        },
        lockoutdate: {
            type: 'string',
            format: 'date-time',
        },
        agreedtotermsofuse: {
            type: 'string',
            default: 'false',
        },
        emailaddressverified: {
            type: 'string',
            default: 'false',
        },
        status: {
            type: 'integer',
            format: 'int32',
        },
    }
} as const

export const UserGroupSchema = {
    type: 'object',
    properties: {
        uuid_: {
            type: 'string',
        },
        externalreferencecode: {
            type: 'string',
        },
        usergroupid: {
            type: 'integer',
        },
        companyid: {
            type: 'integer',
        },
        userid: {
            type: 'integer',
        },
        username: {
            type: 'string',
        },
        createdate: {
            type: 'string',
            format: 'date-time',
        },
        modifieddate: {
            type: 'string',
            format: 'date-time',
        },
        parentusergroupid: {
            type: 'integer',
        },
        name: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        addedbyldapimport: {
            type: 'string',
            default: 'false',
        },
        role: {
            type: 'array',
            items: {
                $ref: '#/components/schemas/Role',
            },
        },
    },
} as const
