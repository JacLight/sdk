import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
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

registerCollection(
  'Store Wishlist',
  DataType.sf_wishlist,
  SFWishlistSchema,
);
