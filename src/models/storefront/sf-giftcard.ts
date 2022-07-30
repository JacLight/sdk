import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFGiftCardSchema = () => {
    return {
        type: 'object',
        properties: {
            serial: { type: 'string' },
            code: { type: 'string' },
            amount: { type: 'number' },
            amountUsed: { type: 'number' },
            batch: { type: 'string' },
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
                        order: { type: 'string' }
                    }
                }
            },
            status: { type: 'string' },
            type: { type: 'string' },
            limits: { type: 'string' },
            allowedSku: { type: 'string' },
            allowedUser: { type: 'string' },
            maxUses: { type: 'number' },
        },
    } as const;
};
const ms = SFGiftCardSchema();
export type SFGiftCardModel = FromSchema<typeof ms>;


export const SFGiftCardUI = (): CollectionUI[] => { return null };
export const SFGiftCardRules = (): CollectionRule[] => { return null };
registerCollection('Store Gift Card', DataType.sf_giftcard, SFGiftCardSchema(), SFGiftCardUI(), SFGiftCardRules(), true)
