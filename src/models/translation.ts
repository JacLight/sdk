import { FromSchema } from 'json-schema-to-ts';
import { getLanguages } from '../data';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';



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
              'x-control': ControlType.selectMany,
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


registerCollection(
  'Translation',
  DataType.translation,
  TranslationSchema()
);