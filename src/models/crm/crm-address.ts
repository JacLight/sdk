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
        transform: 'uri',
        group: 'general',
      },
      company: {
        type: 'string',
        group: 'general',
      },
      email: {
        type: 'string',
        hidden: true,
        group: 'email',
      },
      phone: {
        type: 'string',
        hidden: true,
        group: 'email',
      },
      street1: {
        type: 'string',
      },
      street2: {
        type: 'string',
      },
      city: {
        type: 'string',
        group: 'city',
      },
      zip: {
        type: 'string',
        group: 'city',
      },
      state: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          value: 'getCountryStates',
          source: 'function',
          filter: {
            value: '{{address/country}}',
          },
        },
        group: 'state',
      },
      country: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: getCountryDropDownOptions(),
        },
        group: 'state',
      },
      type: {
        type: 'string',
        enum: ['Home', 'Work'],
        default: 'Home',
        group: 'type',
      },
      mailing: {
        type: 'boolean',
        group: 'type',
      },
      primary: {
        type: 'boolean',
        group: 'type',
      },
    },
  } as const;
};

const dd = AddressSchema();
export type AddressModel = FromSchema<typeof dd>;
registerCollection('Address', DataType.address, AddressSchema());
