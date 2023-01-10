import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFGiftCardSchema = () => {
    return {
        type: 'object',
        properties: {
            serial: {
                type: 'string',
                pattern: '^[^[a-zA-Z_\-0-9]*$',
                readOnly: true
            },
            batch: {
                type: 'string',
                pattern: '^[^[a-zA-Z_\-0-9]*$',
                readOnly: true
            },
            code: {
                type: 'string',
                pattern: '^[^[a-zA-Z_\-0-9]*$',
                readOnly: true
            },
            noOfUse: {
                type: 'number'
            },
            amount: { type: 'number' },
            amountUsed: { type: 'number' },
            agent: { type: 'string' },
            boughtBy: { type: 'number' },
            boughtDate: { type: 'string' },
            uses: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        user: { type: 'string' },
                        date: { type: 'string' },
                        amount: { type: 'number' },
                        orderNumber: { type: 'string' }
                    }
                }
            },
            type: {
                type: 'string'
            },
            limits: {
                type: 'string'
            },
            sku: {
                type: 'string'
            },
            user: {
                type: 'string'
            },
            category: {
                type: 'string'
            },
            status: {
                type: 'string',
                enum: ['new', 'assigned', 'sold', 'used']
            },
        },
    } as const;
};
const ms = SFGiftCardSchema();
export type SFGiftCardModel = FromSchema<typeof ms>;


export const SFGiftCardUI = (): CollectionUI[] => { return null };
export const SFGiftCardRules = (): CollectionRule[] => { return null };
registerCollection('Store Gift Card', DataType.sf_giftcard, SFGiftCardSchema(), SFGiftCardUI(), SFGiftCardRules(), true)
