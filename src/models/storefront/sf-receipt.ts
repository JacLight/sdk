import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const SFReceiptSchema = () => {
    return {
        type: 'object',
        properties: {
            parent: {
                type: 'string',
            },
            message: {
                type: 'string',
            },
            template: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
            source: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            from: {
                type: 'string',
            },
            to: {
                type: 'string',
            },
            attachements: FileInfoSchema(),
            conversation: {
                type: 'string',
            },
        },
    } as const;
};

const ms = SFReceiptSchema();
export type SFReceiptModel = FromSchema<typeof ms>;


export const SFReceiptUI = (): CollectionUI[] => { return null };
export const SFReceiptRules = (): CollectionRule[] => { return null };
registerCollection('Store Receipt', DataType.sf_receipt, SFReceiptSchema(), SFReceiptUI(), SFReceiptRules(), true)
