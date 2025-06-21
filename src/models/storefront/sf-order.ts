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
          'paid',
          'paid-partial',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
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
      currency: {
        type: 'string',
      },
      amount: {
        type: 'number',
      },
      tax: {
        type: 'number',
      },
      discount: {
        type: 'number',
      },
      discountInfo: {
        type: 'string',
      },
      discountCode: {
        type: 'string',
      },
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
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            options: {
              type: 'string',
            },
            quantity: {
              type: 'number',
            },
            image: {
              type: 'string',
            },
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