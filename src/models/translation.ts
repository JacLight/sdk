import { FromSchema } from 'json-schema-to-ts';
import { getLanguages } from '../data';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

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
        transform: 'uri'
      },
      group: {
        type: 'string',
      },
      item: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            language: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'json',
                json: getLanguages(),
              },
            },
            value: {
              type: 'string',
            },
          },
        },
      },
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
                    schema.properties.address.properties.region.dataSource.json =  regions;`,
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
  ];
};

export const TranslationUI = (): CollectionUI[] => {
  return null;
};
registerCollection(
  'Translation',
  DataType.translation,
  TranslationSchema(),
  TranslationUI(),
  TranslationRules()
);
