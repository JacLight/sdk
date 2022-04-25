import { FromSchema } from 'json-schema-to-ts';

export const ImageSchema = () => {
    return {
        type: 'object',
        properties: {
            url: {
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
            displayStyle: {
                type: 'string',
                enum: ['simple', 'card', 'overlay'],
                default: 'plan'
            },
        },
    } as const;
};

const cos = ImageSchema();
export type ImageModel = FromSchema<typeof cos>;
