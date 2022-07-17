import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFAttributeSchema = () => {
    return {
        type: 'object',
        properties: {
            parent: {
                type: 'string',
            },
            name: {
                type: 'string',
            },
            options: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        value: { type: 'string' },
                        param: { type: 'string' },
                        file: { type: 'string', fieldType: 'File' },
                    }
                },
            }
        },
    } as const;
};

const ms = SFAttributeSchema();
export type SFAttributeModel = FromSchema<typeof ms>;


export const SFAttributeUI = (): CollectionUI[] => { return null };
export const SFAttributeRules = (): CollectionRule[] => { return null };
registerCollection('Store Attribute', DataType.sf_attribute, SFAttributeSchema(), SFAttributeUI(), SFAttributeRules(), true)
