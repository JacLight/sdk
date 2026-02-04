import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

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

      // Cart Items
      items: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            sku: { type: 'string' },
            productId: { type: 'string' },
            name: { type: 'string' },
            image: { type: 'string' },
            quantity: { type: 'number', default: 1 },
            unitPrice: { type: 'number' },
            originalPrice: { type: 'number' },
            lineTotal: { type: 'number' },
            discount: { type: 'number', default: 0 },
            categoryId: { type: 'string' },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  value: { type: 'string' },
                },
              },
            },
          },
        },
      },

      // Pricing Summary
      subtotal: {
        type: 'number',
        default: 0,
        description: 'Sum of item line totals',
      },

      // Shipping
      shipping: {
        type: 'number',
        default: 0,
      },
      shippingMethod: {
        type: 'string',
      },

      // Tax
      tax: {
        type: 'number',
        default: 0,
      },

      // Discount (total from all applied discounts)
      discount: {
        type: 'number',
        default: 0,
      },

      // Total
      total: {
        type: 'number',
        default: 0,
        description: 'Final total: subtotal + shipping + tax - discount',
      },

      // Discounts (single source of truth for all applied discounts)
      discounts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Coupon code if applicable' },
            name: { type: 'string', description: 'Display name' },
            amount: { type: 'number', description: 'Discount amount' },
            type: { type: 'string', enum: ['percent', 'fixed', 'free_shipping', 'buy_x_get_y', 'volume', 'automatic'] },
            message: { type: 'string', description: 'e.g. "10% off", "Free shipping"' },
          },
        },
      },

      // Checkout Info (from payment gateway)
      checkoutInfo: {
        type: 'object',
        properties: {
          paymentMethod: { type: 'string' },
          paymentStatus: { type: 'string' },
          paymentId: { type: 'string' },
          transactionId: { type: 'string' },
          deliveryMethod: { type: 'string' },
          deliveryAddress: { type: 'string' },
          deliveryDate: { type: 'string' },
          deliveryTime: { type: 'string' },
          notes: { type: 'string' },
        },
      },

      // Addresses (for cart before checkout)
      billingAddress: AddressSchema(),
      shippingAddress: AddressSchema(),
    },
  } as const;
};

const ms = SFCartSchema();
export type SFCartModel = FromSchema<typeof ms>;

registerCollection(
  'Store Cart',
  DataType.sf_cart,
  SFCartSchema(),
);
