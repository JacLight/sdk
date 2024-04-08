import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const SFCollectionSchema = () => {
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
      agents: { type: 'string' },
      products: {
        type: 'array',
        displayStyle: 'table',
        'x-control-variant': 'picker',
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        items: {
          type: 'object',
          properties: {
            image: {
              type: 'string',
            },
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      category: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
        },
      },
      images: {
        'x-control': ControlType.file,
        type: 'array',
        items: FileInfoSchema(),
      },
    },
  } as const;
};
const ms = SFCollectionSchema();
export type SFCollectionModel = FromSchema<typeof ms>;

export const SFCollectionUI = (): CollectionUI[] => {
  return null
};
export const SFCollectionRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Collection',
  DataType.sf_collection,
  SFCollectionSchema(),
  SFCollectionUI(),
  SFCollectionRules(),
  true
);
