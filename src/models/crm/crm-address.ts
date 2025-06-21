import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { getCountryDropDownOptions } from '../../data';

export const AddressSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      street1: {
        type: 'string',
      },
      street2: {
        type: 'string',
      },
      city: {
        type: 'string',
      },
      zip: {
        type: 'string',
      },
      company: {
        type: 'string',
      },
      email: {
        type: 'string',
        hidden: true,
      },
      phone: {
        type: 'string',
        hidden: true,
      },
      region: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          value: 'getCountryRegions',
          source: 'function',
          filter: {
            value: '{{address/country}}',
          }
        },
      },
      country: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: getCountryDropDownOptions(),
        },
      },
      type: {
        type: 'string',
        enum: ['Home', 'Work'],
      },
      mailing: {
        type: 'boolean',
      },
      primary: {
        type: 'boolean',
      },
    },
  } as const;
};


const dd = AddressSchema();
export type AddressModel = FromSchema<typeof dd>;
registerCollection(
  'Address',
  DataType.address,
  AddressSchema(),
);
