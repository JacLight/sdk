import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFShippingSchema = () => {
  return {
    type: 'object',
    properties: {
      courier: {
        type: 'string',
        hidden: true
      },
      order: {
        type: 'string',
      },
      products: {
        type: 'array',
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
            parcel: {
              type: 'object',
              layout: 'horizontal',
              properties: {
                weight: {
                  type: 'number'
                },
                length: {
                  type: 'number'
                },
                height: {
                  type: 'number'
                },
                width: {
                  type: 'number'
                },
              }
            },
          }
        }
      },
      from: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      to: { ...AddressSchema(), collapsible: true, title: 'To address', },
      parcel: {
        type: 'array',
        title: 'Package and weight',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            length: { type: 'string' },
            width: { type: 'string' },
            height: { type: 'string' },
            weight: { type: 'string' },
          }
        }
      },
      tracking: {
        type: 'string',
        readOnly: true,
        hidden: true,
      },
      shipDate: {
        hidden: true,
        type: 'string',
      },
      expectedDeliveryDate: {
        hidden: true,
        type: 'string',
      },
      deliveryDate: {
        hidden: true,
        type: 'string',
      },
      status: {
        hidden: true,
        type: 'string',
      },
      cost: {
        hidden: true,
        type: 'number'
      },
      proofOfDelivery: {
        hidden: true,
        type: 'array',
        items: {
          type: 'object'
        }
      },
      remarks: {
        hidden: true,
        type: 'string'
      },
    },
  } as const;
};

const ms = SFShippingSchema();
export type SFShippingModel = FromSchema<typeof ms>;

export const SFShippingUI = (): CollectionUI[] => { return null };
export const SFShippingRules = (): CollectionRule[] => { return null };
registerCollection('Store Shipping', DataType.sf_shipping, SFShippingSchema(), SFShippingUI(), SFShippingRules(), true)
