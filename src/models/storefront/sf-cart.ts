import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

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
      phone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      items: {
        type: 'array',
        properties: {
          product: {
            type: 'string',
          },
          price: {
            type: 'number',
          },
          quantity: {
            type: 'number',
          },
        },
      },
      total: {
        type: 'number',
      },
      discounts: {
        type: 'array',
        properties: {
          code: {
            type: 'string',
          },
          value: {
            type: 'number',
          },
        }

      },
      checkoutInfo: {
        type: 'object',
        properties: {
          paymentMethod: {
            type: 'string',
          },
          deliveryMethod: {
            type: 'string',
          },
          deliveryAddress: {
            type: 'string',
          },
          deliveryDate: {
            type: 'string',
          },
          deliveryTime: {
            type: 'string',
          },
        }
      },
      billingAddress: AddressSchema(),
      shippingAddress: AddressSchema(),
    },
  } as const;
};

const ms = SFCartSchema();
export type SFCartModel = FromSchema<typeof ms>;

export const SFCartUI = (): CollectionUI[] => {
  return null;
};
export const SFCartRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Cart',
  DataType.sf_cart,
  SFCartSchema(),
  SFCartUI(),
  SFCartRules(),
  true
);
