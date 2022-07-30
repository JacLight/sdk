import { FromSchema } from 'json-schema-to-ts';
import { SFAttributeSchema } from './sf-attribute';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFCartSchema = () => {
    return {
        type: 'array',
        items: {
            properties: {
                user: {
                    type: 'string',
                },
                status: {
                    type: 'string',
                },
                products: {
                    type: 'string'
                },
                price: {
                    type: 'string',
                },
                source: {
                    type: 'string',
                },
                notification: {
                    type: 'string',
                },
                variant: {
                    type: 'object',
                    properties: {
                        price: {
                            type: 'number'
                        },
                        stock: { type: 'number' },
                        attributes: {
                            type: 'array',
                            items: SFAttributeSchema()
                        },
                    }
                }
            },
        }
    } as const;
};

const ms = SFCartSchema();
export type SFCartModel = FromSchema<typeof ms>;

export const SFCartUI = (): CollectionUI[] => { return null };
export const SFCartRules = (): CollectionRule[] => { return null };
registerCollection('Store Cart', DataType.sf_cart, SFCartSchema(), SFCartUI(), SFCartRules(), true)
