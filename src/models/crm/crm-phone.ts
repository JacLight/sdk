import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const PhoneSchema = () => {
  return {
    type: 'object',
    properties: {
      countrycode: {
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
      typeid: {
        type: 'string',
      },
      primary: {
        type: 'boolean',
        default: false,
      },
      status: {
        type: 'string'
      }
    },
  } as const;
};

const dd = PhoneSchema();
export type PhoneModel = FromSchema<typeof dd>;

export const PhoneUI = (): CollectionUI[] => { return null };
export const PhoneRules = (): CollectionRule[] => { return null };
registerCollection('Phone', DataType.phone, PhoneSchema(), PhoneUI(), PhoneRules(), true)
