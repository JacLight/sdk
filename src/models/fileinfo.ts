import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const FileInfoSchema = () => {
    return {
        type: 'array',
        readonly: true,
        fieldType: FieldType.file,
        repeatable: true,
        items: {
            type: 'object',
            properties: {
                path: {
                    type: 'string',
                },
                url: {
                    type: 'string',
                },
            },
        }

    } as const;
};

const cos = FileInfoSchema();
export type FileInfoModel = FromSchema<typeof cos>;

export const FileInfoUI = (): CollectionUI[] => { return null; };
export const FileInfoRules = (): CollectionRule[] => { return [] };

registerCollection('File', DataType.fileinfo, FileInfoSchema(), FileInfoUI(), FileInfoRules(), true)
