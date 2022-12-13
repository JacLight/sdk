import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';
import { AddressSchema } from './crm/crm-address';

export const LocationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
      },
      type: {
        type: 'string',
        enum: ['store', 'mini', 'wearhouse', 'web', 'partner', 'contact-point', 'lockbox', 'dropbox', 'corporate']
      },
      services: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        dataSource: {
          source: 'json',
          json: [{ label: 'service a', value: 'service a' }, { label: 'service b', value: 'service b' }],
        },
      },
      address: AddressSchema(),
      status: {
        type: 'string',
      }
    },
  } as const;
};

const dd = LocationSchema();
export type LocationModel = FromSchema<typeof dd>;


export const LocationRules = (): CollectionRule[] => {
  return [
    {
      name: 'Manual Selection',
      action: [
        {
          operation: 'script',
          value: `  const regions = context.getCountryRegions(data.address.country); 
                    schema.properties.address.properties.region.dataSource.json =  regions;`
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/address/properties/country',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ]
};

export const LocationUI = (): CollectionUI[] => { return null };
registerCollection('Business Location', DataType.location, LocationSchema(), LocationUI(), LocationRules())
