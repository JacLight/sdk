import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFOrderSchema = () => {
  return {
    type: 'object',
    properties: {
      store: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      number: {
        type: 'string',
        unique: true,
        readOnly: true,
      },
      status: {
        type: 'string',
        enum: [
          'new',
          'awaiting-payment',
          'paid-partial',
          'paid',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
          'completed',
          'failed',
          'returned',
          'refunded',
          'cancelled',
        ],
      },
      name: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },      
      currency: {
        type: 'string',
      },

      // Pricing Summary
      subtotal: {
        type: 'number',
        description: 'Sum of item line totals before discounts',
      },
      shipping: {
        type: 'number',
      },
      shippingMethod: {
        type: 'string',
      },
      shippingFee: {
        type: 'number',
        description: 'Alias for shipping (backwards compat)',
      },
      tax: {
        type: 'number',
      },
      discount: {
        type: 'number',
        description: 'Total discount amount',
      },
      amount: {
        type: 'number',
        description: 'Final total: subtotal + shipping + tax - discount',
      },

      // Discount Details
      discounts: {
        type: 'array',
        description: 'All applied discounts',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      discountCode: {
        type: 'string',
        description: 'Comma-separated discount codes (for display)',
      },

      // Other
      commission: {
        type: 'number',
      },
      affiliate: {
        type: 'string',
      },
      remarks: {
        type: 'string',
      },
      ip: {
        type: 'string',
      },
      paymentRef: {
        type: 'string',
      },
      paymentGateway: {
        type: 'string',
      },

      // Order Items
      products: {
        type: 'array',
        hideLabel: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        displayStyle: 'table',
        items: {
          type: 'object',
          properties: {
            sku: { type: 'string' },
            name: { type: 'string' },
            image: { type: 'string' },
            options: { type: 'string' },
            quantity: { type: 'number' },
            unitPrice: { type: 'number' },
            originalPrice: { type: 'number' },
            lineTotal: { type: 'number' },
            discount: { type: 'number', description: 'Item-level discount (volume pricing)' },
          },
        },
      },
      shippingAddress: { ...AddressSchema() },
      billingAddress: { ...AddressSchema() },
      shippingInfo: {
        type: 'array',
        hideLabel: true,
        items: {
          type: 'object',
          properties: {
            carrier: {
              type: 'string',
            },
            tracker: {
              type: 'string',
            },
            rate: {
              type: 'string',
            },
            cost: {
              type: 'string',
            },
          },
        },
      },
    },
  } as const;
};


const ms = SFOrderSchema();
export type SFOrderModel = FromSchema<typeof ms>;

registerCollection(
  'Store Order',
  DataType.sf_order,
  SFOrderSchema()
);