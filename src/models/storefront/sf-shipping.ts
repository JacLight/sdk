import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFShippingSchema = () => {
  return {
    type: 'object',
    properties: {
      courier: {
        type: 'string',
      },
      orderNumber: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_order,
          value: 'number',
          label: 'number',
        },
      },
      from: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      to: { ...AddressSchema(), collapsible: true, title: 'To address' },
      products: {
        type: 'array',
        hideIn: ['table'],
        collapsible: true,
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
            qty: {
              type: 'number',
            },
            image: {
              type: 'string',
            },
            parcel: {
              type: 'object',
              layout: 'horizontal',
              properties: {
                weight: {
                  type: 'number',
                },
                length: {
                  type: 'number',
                },
                height: {
                  type: 'number',
                },
                width: {
                  type: 'number',
                },
              },
            },
          },
        },
      },
      parcels: {
        type: 'array',
        title: 'Package and weight',
        collapsible: true,
        layout: 'horizontal',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            length: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            weight: { type: 'number' },
          },
        },
      },
      tracking: {
        type: 'string',
      },
      shipDate: {
        type: 'string',
      },
      expectedDeliveryDate: {
        type: 'string',
      },
      deliveryDate: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      cost: {
        type: 'number',
      },
      proofOfDelivery: {
        type: 'array',
        items: {
          type: 'object',
        },
      },
      remarks: {
        type: 'string',
      },
    },
  } as const;
};


const ms = SFShippingSchema();
export type SFShippingModel = FromSchema<typeof ms>;

registerCollection(
  'Store Shipping',
  DataType.sf_shipping,
  SFShippingSchema(),
);
