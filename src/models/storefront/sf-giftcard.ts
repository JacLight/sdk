import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui'; import { DataType, FieldType } from '../../types';

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
            sku: {
                type: 'string',
                inputStyle: 'chip',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.sf_product,
                    value: 'sk',
                    label: 'sku',
                },
            },
            user: {
                type: 'string',
                inputStyle: 'chip',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.user,
                    value: 'sk',
                    label: 'username',
                },
            },
            category: {
                type: 'string',
                inputStyle: 'chip',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.category,
                    value: 'sk',
                    label: 'name',
                },
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
