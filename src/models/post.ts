import { FromSchema } from 'json-schema-to-ts';
export type PostModel = FromSchema<typeof PostSchema>;

export const PostSchema = {
    type: 'object',
    properties: {
        version: {
            type: 'number',
            format: 'double',
        },
        urltitle: {
            type: 'string',
        },
        content: {
            type: 'string',
        },
        ddmstructurekey: {
            type: 'string',
        },
        ddmtemplatekey: {
            type: 'string',
        },
        defaultlanguageid: {
            type: 'string',
        },
        layoutuuid: {
            type: 'string',
        },
        displaydate: {
            type: 'string',
            format: 'date-time',
        },
        expirationdate: {
            type: 'string',
            format: 'date-time',
        },
        reviewdate: {
            type: 'string',
            format: 'date-time',
        },
        indexable: {
            type: 'string',
            default: 'false',
        },
        smallimage: {
            type: 'string',
            default: 'false',
        },
        smallimageid: {
            type: 'integer',
            format: 'int64',
        },
        smallimageurl: {
            type: 'string',
        },
        lastpublishdate: {
            type: 'string',
            format: 'date-time',
        },
        status: {
            type: 'integer',
            format: 'int32',
        },
        statusbyuserid: {
            type: 'integer',
            format: 'int64',
        },
        statusbyusername: {
            type: 'string',
        },
        statusdate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;
