import { FromSchema } from 'json-schema-to-ts';
import { SFAttributeSchema } from './sf-attribute';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const SFWishlistSchema = () => {
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
        product: {
          type: 'string',
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

const ms = SFWishlistSchema();
export type SFWishlistModel = FromSchema<typeof ms>;


export const SFWishlistUI = (): CollectionUI[] => { return null };
export const SFWishlistRules = (): CollectionRule[] => { return null };
registerCollection('Store Wishlist', DataType.sf_wishlist, SFWishlistSchema(), SFWishlistUI(), SFWishlistRules(), true)
