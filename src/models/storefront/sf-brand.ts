import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { ControlType, DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const SFBrandSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      products: {
        type: 'array',
        'x-control': ControlType.table,
        operations: ['pick', 'add', 'remove'],
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        items: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      logo: FileInfoSchema(),
      contacts: {
        type: 'array',
        'x-control': ControlType.table,
        operations: ['pick', 'add', 'remove'],
        dataSource: {
          source: 'collection',
          collection: DataType.address,
          value: 'name',
          label: ['name', 'street1', 'city', 'zip'],
        },
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            street1: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            email: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            zip: {
              type: 'string',
            },
          },
        },
      },
      status: {
        type: 'string',
      },
    },
  } as const;
};

const ms = SFBrandSchema();
export type SFBrandModel = FromSchema<typeof ms>;

registerCollection(
  'Store Brand',
  DataType.sf_brand,
  SFBrandSchema(),
);
