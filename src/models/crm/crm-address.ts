import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
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

export const AddressRules = (): CollectionRule[] => {
  return [
    {
      name: 'Manual Selection',
      action: [
        {
          operation: 'script',
          value:
            ' schema.properties.region.dataSource.json = context.getCountryRegions(data.country) ',
          targetField: '/properties/region',
          sourceField: '/properties/country',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/country',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ];
};

const dd = AddressSchema();
export type AddressModel = FromSchema<typeof dd>;
export const AddressUI = (): CollectionUI[] => {
  return null;
};
registerCollection(
  'Address',
  DataType.address,
  AddressSchema(),
  AddressUI(),
  AddressRules(),
  true
);
