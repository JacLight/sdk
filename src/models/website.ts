import { FromSchema } from 'json-schema-to-ts';
export type WebsiteModel = FromSchema<typeof WebsiteSchema>;
export type VirtualHostModel = FromSchema<typeof VirtualHostSchema>;

export const WebsiteSchema = {
    type: 'object',
    properties: {
        url: {
            type: 'string',
        },
        typeid: {
            type: 'integer',
        },
        primary_: {
            type: 'string',
            default: 'false',
        },
        lastpublishdate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;

export const VirtualHostSchema = {
    type: 'object',
    properties: {
        siteId: {
            type: 'integer',
        },
        hostname: {
            type: 'string',
        },
        defaultvirtualhost: {
            type: 'string',
            default: 'false',
        },
        languageid: {
            type: 'string',
        },
    },
} as const;
