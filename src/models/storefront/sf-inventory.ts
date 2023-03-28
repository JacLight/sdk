import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType } from '../../types';

export const SFInventorySchema = () => {
  return {
    type: 'object',
    properties: {
      product: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: 'sku',
        },
      },
      location: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      quantity: {
        type: 'number',
      },
    },
  } as const;
};

const dd = SFInventorySchema();
export type SFInventoryModel = FromSchema<typeof dd>;

export const SFInventoryUI = (): CollectionUI[] => {
  return null;
};
export const SFInventoryRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Inventory',
  DataType.sf_inventory,
  SFInventorySchema(),
  SFInventoryUI(),
  SFInventoryRules()
);
