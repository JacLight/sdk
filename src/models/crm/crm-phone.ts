import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType } from '../../types';

export const PhoneSchema = () => {
  return {
    type: 'object',
    layout: 'horizontal',
    properties: {
      countryCode: {
        type: 'string',
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

registerCollection(
  'Phone',
  DataType.phone,
  PhoneSchema(),
);
