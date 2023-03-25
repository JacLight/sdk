import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const FileInfoSchema = () => {
    return {
        type: 'array',
        readOnly: true,
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
