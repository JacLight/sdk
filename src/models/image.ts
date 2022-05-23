import { FromSchema } from 'json-schema-to-ts';

export const ImageSchema = () => {
    return {
        type: 'object',
        properties: {
            path: {
                type: 'string',
                fieldType: "Upload",
            },
            absoluteUrl: {
                type: 'string',
            },
            alt: {
                type: 'string',
            },
            href: {
                type: 'string',
            },
            width: {
                type: 'number',
            },
            height: {
                type: 'number',
            },
            caption: {
                type: 'string',
            },
        },
    } as const;
};

const cos = ImageSchema();
export type ImageModel = FromSchema<typeof cos>;
