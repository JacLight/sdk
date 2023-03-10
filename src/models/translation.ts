import { FromSchema } from 'json-schema-to-ts';
import { getCountryDropDownOptions, getLanguages } from 'src/data';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const TranslationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        title: 'Key',
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
      },
      group: {
        type: 'string',
      },
      item: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            country: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'json',
                json: getCountryDropDownOptions()
              },
            },
            language: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'json',
                json: getLanguages()
              },
            },
            value: {
              type: 'string',
            },
          },
        }
      },
      status: {
        type: 'string',
      }
    },
  } as const;
};


const dd = TranslationSchema();
export type TranslationModel = FromSchema<typeof dd>;

export const TranslationRules = (): CollectionRule[] => {
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

export const TranslationUI = (): CollectionUI[] => { return null };
registerCollection('Translation', DataType.translation, TranslationSchema(), TranslationUI(), TranslationRules())
