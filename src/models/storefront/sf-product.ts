import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFProductSchema = () => {
  return {
    type: 'object',
    properties: {
      sky: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      isbn: {
        type: 'string',
      },
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      brand: {
        type: 'string',
      },
      price: {
        type: 'number',
      },
      currency: {
        type: 'number',
      },
      tax: {
        type: 'string'
      },
      rules: {
        type: 'array'
      },
      bundle: {
        type: 'array',
        items: {
          type: 'object', //product sku
        }
      },
      subscription: {
        type: 'string'
      },
      images: { type: 'object' },// ImageSchema(),
      posts: { type: 'object' },//  PostSchema(),
      stock: { type: 'number' },
      shipping: { type: 'string' },
      points: { type: 'number' },
      available: { type: 'string' },
      variations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            price: {
              type: 'number'
            },
            stock: { type: 'number' },
            attributes: {
              type: 'array',
              items: { type: 'object' }
            },
          }
        }
      },
      attributes: {
        type: 'array',
        items: { type: 'object' }
      },
      discount: { type: 'string' },
      promotion: { type: 'string' },
      status: { type: 'string' },
      views: { type: 'number' },
    },
  } as const;
};

const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

export const SFProductUI = (): CollectionUI[] => { return null };
export const SFProductRules = (): CollectionRule[] => { return null };
registerCollection('Store Product', DataType.sf_product, SFProductSchema(), SFProductUI(), SFProductRules())
