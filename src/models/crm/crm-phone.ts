import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';

export const PhoneSchema = () => {
  return {
    type: 'object',
    layout: 'horizontal',
    properties: {
      countryCode: {
        type: 'string',
        pattern: '^[-$0-9]*$',
      },
      phone: {
        type: 'string',
        pattern: '^[-$0-9]*$',
      },
      extension: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      primary: {
        type: 'boolean',
        default: false,
      },
      verified: {
        type: 'boolean',
        default: false,
      },
      status: {
        type: 'string',
      },
    },
  } as const;
};

const dd = PhoneSchema();
export type PhoneModel = FromSchema<typeof dd>;

export const PhoneUI = (): CollectionUI[] => {
  return null;
};
export const PhoneRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Phone',
  DataType.phone,
  PhoneSchema(),
  PhoneUI(),
  PhoneRules(),
  true
);
