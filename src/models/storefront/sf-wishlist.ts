import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';

export const SFWishlistSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      products: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            price: {
              type: 'number',
            },
          },
        },
      },
    },
  } as const;
};

const ms = SFWishlistSchema();
export type SFWishlistModel = FromSchema<typeof ms>;

export const SFWishlistUI = (): CollectionUI[] => {
  return null;
};
export const SFWishlistRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Wishlist',
  DataType.sf_wishlist,
  SFWishlistSchema(),
  SFWishlistUI(),
  SFWishlistRules(),
  true
);
