import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFTransactionSchema = () => {
    return {
        type: 'object',
        properties: {
            user: {
                type: 'string',
            },
            order: {
                type: 'string',
            },
            invoice: {
                type: 'string',
            },
            gateway: {
                type: 'string',
            },
            currency: {
                type: 'string',
            },
            amount: {
                type: 'string',
            },
            tax: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            tnxref: {
                type: 'string',
            },
            remarks: {
                type: 'string',
            },
            reqquestIp: {
                type: 'string',
            },
            requestDump: {
                type: 'string',
            },
            sessionDump: {
                type: 'string',
            },
        },
    } as const;
};

const ms = SFTransactionSchema();
export type SFTransactionModel = FromSchema<typeof ms>;


export const SFTransactionUI = (): CollectionUI[] => { return null };
export const SFTransactionRules = (): CollectionRule[] => { return null };
registerCollection('Store Transaction', DataType.sf_transaction, SFTransactionSchema(), SFTransactionUI(), SFTransactionRules(), true)
