import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFPromotionSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            start: {
                type: 'string',
            },
            end: {
                type: 'string',
            },
            discountType: {
                type: 'string',
                enum: ['amount', 'percentage']
            },
            discount: {
                type: 'number',
            },
            skus: {
                type: 'array',
            },
            users: {
                type: 'array',
            },
            usePerUser: {
                type: 'number',
            },
        },
    } as const;
};

const ms = SFPromotionSchema();
export type SFPromotionModel = FromSchema<typeof ms>;


export const SFPromotionUI = (): CollectionUI[] => { return null };
export const SFPromotionRules = (): CollectionRule[] => { return null };
registerCollection('Store Promotion', DataType.sf_promotion, SFPromotionSchema(), SFPromotionUI(), SFPromotionRules(), true)
