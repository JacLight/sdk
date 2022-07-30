import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';

export const SFAttributeSchema = () => {
    return {
        type: 'object',
        properties: {
            parent: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.sf_attribute,
                    field: 'name',
                },
            },
            name: {
                type: 'string',
                pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
                minLength: 3,
                maxLength: 50,
                unique: true,
            },
            options: {
                layout: 'horizontal',
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        value: { type: 'string' },
                        param: { type: 'string' },
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
