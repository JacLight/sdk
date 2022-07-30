import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';


export const SFBrandSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      products: {
        type: 'array',
      },
      image: { type: 'object' }, //ImageSchema(),
      contact: { type: 'object' }, //ContactSchema(),
      status: {
        type: 'string',
      },
    },
  } as const;
};

const ms = SFBrandSchema();
export type SFBrandModel = FromSchema<typeof ms>;

export const SFBrandUI = (): CollectionUI[] => { return null };
export const SFBrandRules = (): CollectionRule[] => { return null };
registerCollection('Store Brand', DataType.sf_brand, SFBrandSchema(), SFBrandUI(), SFBrandRules(), true)
