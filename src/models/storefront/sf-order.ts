import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFOrderSchema = () => {
    return {
        type: 'object',
        properties: {
            store: { type: 'string' },
            number: {
                type: 'string',
                unique: true,
                pattern: '^[^[a-zA-Z_\-0-9]*$',
                minLength: 6,
                maxLength: 18,
            },
            user: {
                type: 'string',
            },
            name: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            currency: {
                type: 'string',
            },
            amount: {
                type: 'number',
            },
            trackingNumber: {
                type: 'string',
            },
            conversion: {
                type: 'string',
            },
            tax: {
                type: 'number',
            },
            discount: {
                type: 'number',
            },
            discountInfo: {
                type: 'string',
            },
            discountCode: {
                type: 'string',
            },
            commission: {
                type: 'number',
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
            paymentRef: {
                type: 'string',
            },
            paymentGateway: {
                type: 'string',
            },
            shippingMethod: {
                type: 'string',
            },
            shippingFee: {
                type: 'number',
            },
            products: {
                type: 'array',
                displayStyle: 'table',
                items: {
                    type: 'object',
                    property: {
                        quantity: { type: 'number' },
                        product: { type: 'object' }
                    }
                }
            },
            billingAddress: AddressSchema(),
            shippingAddress: AddressSchema(),
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
