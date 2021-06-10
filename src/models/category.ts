import { FromSchema } from "json-schema-to-ts";

export const CategorySchema = {
    type: 'object',
    properties: {
        parentcategoryid: {
            type: 'integer',
        },
        treepath: {
            type: 'string',
        },
        name: {
            type: 'string',
        },
        title: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        lastpublishdate: {
            type: 'string',
            format: 'date-time',
        },
    },
} as const;


export type CategoryModel = FromSchema<typeof CategorySchema>
