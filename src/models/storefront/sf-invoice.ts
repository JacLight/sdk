import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFInvoiceSchema = () => {
    return {
        type: 'object',
        properties: {
            number: {
                type: 'string',
            },
            user: {
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
            discount: {
                type: 'string',
            },
            discountInfo: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            remarks: {
                type: 'string',
            },
            items: {
                type: 'array',
                items: {
                    type: 'object',
                    property: {
                        quantity: { type: 'number' },
                        product: { type: 'object' }
                    }
                }
            },
        },
    } as const;
};

const ms = SFInvoiceSchema();
export type SFInoiceModel = FromSchema<typeof ms>;

export const SFInvoiceUI = (): CollectionUI[] => { return null };
export const SFInvoiceRules = (): CollectionRule[] => { return null };
registerCollection('Store Invoice', DataType.sf_invoice, SFInvoiceSchema(), SFInvoiceUI(), SFInvoiceRules(), true)
