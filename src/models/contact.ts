import { FromSchema } from 'json-schema-to-ts';
export type ContactModel = FromSchema<typeof ContactSchema>;

export const ContactSchema = {
    type: 'object',
    properties: {
        parentcontactid: {
            type: 'integer',
        },
        emailaddress: {
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
        prefixid: {
            type: 'integer',
        },
        suffixid: {
            type: 'integer',
        },
        male: {
            type: 'string',
            default: 'false',
        },
        birthday: {
            type: 'string',
            format: 'date-time',
        },
        smssn: {
            type: 'string',
        },
        facebooksn: {
            type: 'string',
        },
        jabbersn: {
            type: 'string',
        },
        skypesn: {
            type: 'string',
        },
        twittersn: {
            type: 'string',
        },
        employeestatusid: {
            type: 'string',
        },
        employeenumber: {
            type: 'string',
        },
        jobtitle: {
            type: 'string',
        },
        jobclass: {
            type: 'string',
        },
        hoursofoperation: {
            type: 'string',
        },
    },
} as const;
