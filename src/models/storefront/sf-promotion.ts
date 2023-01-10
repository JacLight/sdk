import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';

export const SFPromotionSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            start: {
                type: 'string',
                format: 'date-time'
            },
            end: {
                type: 'string',
                format: 'date-time'
            },
            discountType: {
                type: 'string',
                enum: ['amount', 'percentage']
            },
            discount: {
                type: 'number',
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
            usePerUser: {
                type: 'number',
            },
            status: {
                type: 'string',
                enum: ['new', 'active', 'stopped'],
            },
        },
    } as const;
};

const ms = SFPromotionSchema();
export type SFPromotionModel = FromSchema<typeof ms>;


export const SFPromotionUI = (): CollectionUI[] => { return null };
export const SFPromotionRules = (): CollectionRule[] => { return null };
registerCollection('Store Promotion', DataType.sf_promotion, SFPromotionSchema(), SFPromotionUI(), SFPromotionRules(), true)
