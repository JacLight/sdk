import { FromSchema } from 'json-schema-to-ts';
export type NavigationModel = FromSchema<typeof NavigationSchema>;
export type NavigationItemModel = FromSchema<typeof NavigationItemSchema>;

export const NavigationSchema = {
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
        },
        sitenavigationid: {
            type: 'integer',
        },
        groupid: {
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
        name: {
            type: 'string',
        },
        type: {
            type: 'integer',
            format: 'int32',
        },
        auto: {
            type: 'string',
            default: 'false',
        },
        lastpublishdate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;

export const NavigationItemSchema = {
    type: 'object',
    properties: {
        uuid: {
            type: 'string',
        },
        sitenavigationitemid: {
            type: 'integer',
        },
        groupid: {
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
        sitenavigationid: {
            type: 'integer',
        },
        parentsitenavigationitemid: {
            type: 'integer',
        },
        name: {
            type: 'string',
        },
        type: {
            type: 'string',
        },
        typesettings: {
            type: 'string',
        },
        order: {
            type: 'integer',
            format: 'int32',
        },
        lastpublishdate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
