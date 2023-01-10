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
      orderNumber: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_order,
          value: 'sk',
          label: 'number',
        },
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
      to: { ...AddressSchema(), collapsible: true, title: 'To address' },
      products: {
        type: 'array',
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
      parcel: {
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

export const SFShippingRules = (): CollectionRule[] => {
  return [
    {
      name: 'Manual Selection',
      action: [
        {
          operation: 'script',
          value: ' schema.properties.to.properties.region.dataSource.json = context.getCountryRegions(data.to.country) ',
          targetField: '/properties/to/properties/region',
          sourceField: '/properties/to/properties/country',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/to/properties/country',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ]
};

const ms = SFShippingSchema();
export type SFShippingModel = FromSchema<typeof ms>;

export const SFShippingUI = (): CollectionUI[] => { return null };
registerCollection('Store Shipping', DataType.sf_shipping, SFShippingSchema(), SFShippingUI(), SFShippingRules(), true)
