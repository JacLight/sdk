import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const SFReturnSchema = () => {
    return {
        type: 'object',
        properties: {
            order: {
                type: 'string',
            },
            product: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            condition: {
                type: 'string',
            },
            remarks: {
                type: 'string',
            },
            returnto: {
                type: 'string',
            },
            startDate: {
                type: 'string',
            },
            receiveDate: {
                type: 'string',
            },
            attachements: FileInfoSchema(),
        },
    } as const;
};

const ms = SFReturnSchema();
export type SFReturnModel = FromSchema<typeof ms>;

export const SFReturnUI = (): CollectionUI[] => { return null };
export const SFReturnRules = (): CollectionRule[] => { return null };
registerCollection('Store Return', DataType.sf_return, SFReturnSchema(), SFReturnUI(), SFReturnRules(), true)
