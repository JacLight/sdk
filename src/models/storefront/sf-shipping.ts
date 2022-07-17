import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFShippingSchema = () => {
  return {
    type: 'object',
    properties: {
      order: {
        type: 'string',
      },
      products: {
        type: 'array',
      },
      address: AddressSchema(),
      tracking: {
        type: 'string',
      },
      shipper: {
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
        type: 'number'
      },
      weight: {
        type: 'string'
      },
      size: {
        type: 'string'
      },
      proofOfDelivery: {
        type: 'array',
        items: {
          type: 'object'
        }
      },
      remarks: {
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
