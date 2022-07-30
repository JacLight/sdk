import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const FileInfoSchema = () => {
    return {
        type: 'object',
        properties: {
            path: {
                type: 'string',
                fieldType: "file",
            },
            mine: {
                type: 'string',
                hidden: true,
            },
            absoluteUrl: {
                type: 'string',
                hidden: true,
            },
            alt: {
                type: 'string',
                hidden: true,
            },
            href: {
                type: 'string',
                hidden: true,
            },
            width: {
                type: 'number',
                hidden: true,
            },
            height: {
                type: 'number',
                hidden: true,
            },
            caption: {
                type: 'string',
                hidden: true,
            },
            size: {
                type: 'number',
                hidden: true,
            },
        },
    } as const;
};

const cos = FileInfoSchema();
export type FileInfoModel = FromSchema<typeof cos>;

export const FileInfoUI = (): CollectionUI[] => { return null; };
export const FileInfoRules = (): CollectionRule[] => { return [] };

registerCollection('File', DataType.fileinfo, FileInfoSchema(), FileInfoUI(), FileInfoRules(), true)
