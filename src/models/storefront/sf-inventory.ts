import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType } from '../../types';

export const SFInventorySchema = () => {
  return {
    type: 'object',
    properties: {
      product: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sku',
          label: ['sku', 'name'],
        },
      },
      location: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      supplier: {
        type: 'string',
      },
      quantity: {
        type: 'number',
      },
    },
  } as const;
};

export const SFInventoryTransferSchema = () => {
  return {
    type: 'object',
    properties: {
      transferDate: {
        type: 'string',
        format: 'date-time',
      },
      from: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      to: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      products: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            product: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.sf_product,
                value: 'sku',
                label: ['sku', 'name'],
              },
            },
            quantity: {
              type: 'number',
            },
          },
        },
      },
      approvedBy: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: ['name', 'email'],
        },
      },
    },
  } as const;
};


export const SFInventoryIntakeSchema = () => {
  return {
    type: 'object',
    properties: {
      supplier: {
        type: 'string',
      },
      receivedBy: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: ['name', 'email'],
        },
      },
      status: {
        type: 'string',
        enum: ['pending', 'received', 'cancelled'],
      },
      products: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            product: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.sf_product,
                value: 'sku',
                label: ['sku', 'name'],
              },
            },
            quantity: {
              type: 'number',
            },
          },
        },
      },
      location: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
    },
  } as const;
};

const is = SFInventorySchema();
export type SFInventoryModel = FromSchema<typeof is>;
export const SFInventoryUI = (): CollectionUI[] => null
export const SFInventoryRules = (): CollectionRule[] => null


const iis = SFInventoryIntakeSchema();
export type SFInventoryIntakeModel = FromSchema<typeof iis>;
export const SFInventoryIntakeUI = (): CollectionUI[] => null
export const SFInventoryIntakeRules = (): CollectionRule[] => null


const its = SFInventoryTransferSchema();
export type SFInventoryTransferModel = FromSchema<typeof its>;
export const SFInventoryTransferUI = (): CollectionUI[] => null
export const SFInventoryTransferRules = (): CollectionRule[] => null


registerCollection('Store Inventory', DataType.sf_inventory, SFInventorySchema(), SFInventoryUI(), SFInventoryRules());
registerCollection('Store Inventory', DataType.sf_inventory_intake, SFInventoryIntakeSchema(), SFInventoryIntakeUI(), SFInventoryIntakeRules());
registerCollection('Store Inventory', DataType.sf_inventory_transfer, SFInventoryTransferSchema(), SFInventoryTransferUI(), SFInventoryTransferRules());
