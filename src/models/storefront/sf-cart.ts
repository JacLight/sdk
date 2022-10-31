import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFCartSchema = () => {
    return {
        type: 'object',
        properties: {
            status: {
                type: 'string',
            },
            source: {
                type: 'string',
            },
            items: {
                type: 'array',
                properties: {
                    product: {
                        type: 'string'
                    },
                    price: {
                        type: 'number',
                    },
                    quantity: {
                        type: 'number'
                    },
                },
            }
        }
    } as const;
};

const ms = SFCartSchema();
export type SFCartModel = FromSchema<typeof ms>;

export const SFCartUI = (): CollectionUI[] => { return null };
export const SFCartRules = (): CollectionRule[] => { return null };
registerCollection('Store Cart', DataType.sf_cart, SFCartSchema(), SFCartUI(), SFCartRules(), true)
