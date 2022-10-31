import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFOrderSchema = () => {
    return {
        type: 'object',
        properties: {
            store: { type: 'string' },
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
            conversion: {
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
            commission: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            affiliate: {
                type: 'string',
            },
            remarks: {
                type: 'string',
            },
            ip: {
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
            paymentAddress: { type: 'object' },
            shippingAddress: { type: 'object' },
            shipping: {
                type: 'array'
            }
        },
    } as const;
};

const ms = SFOrderSchema();
export type SFOrderModel = FromSchema<typeof ms>;

export const SFOrderUI = (): CollectionUI[] => { return null };
export const SFOrderRules = (): CollectionRule[] => { return null };
registerCollection('Store Order', DataType.sf_order, SFOrderSchema(), SFOrderUI(), SFOrderRules())
