import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';

export const SFVendorSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      products: {
        type: 'array',
        item: {
          type: 'string',
        },
      },
      image: { type: 'object' }, //ImageSchema(),
      contact: { type: 'object' }, //ContactSchema(),
      status: {
        type: 'string',
      },
    },
  } as const;
};

const ms = SFVendorSchema();
export type SFBrandModel = FromSchema<typeof ms>;

export const SFVendorUI = (): CollectionUI[] => {
  return null;
};
export const SFVendorRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Vendor',
  DataType.sf_vendor,
  SFVendorSchema(),
  SFVendorUI(),
  SFVendorRules(),
  true
);
