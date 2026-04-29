import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

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
      ...BusinessLocationField(),
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
      fromBusinessLocationId: {
        type: 'string',
        description: 'Source venue (FK to Business Location)',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        maxItems: 1,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
      toBusinessLocationId: {
        type: 'string',
        description: 'Destination venue (FK to Business Location)',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        maxItems: 1,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
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
      ...BusinessLocationField(),
    },
  } as const;
};

const is = SFInventorySchema();
export type SFInventoryModel = FromSchema<typeof is>;


const iis = SFInventoryIntakeSchema();
export type SFInventoryIntakeModel = FromSchema<typeof iis>;


const its = SFInventoryTransferSchema();
export type SFInventoryTransferModel = FromSchema<typeof its>;


registerCollection(
  'Store Inventory',
  DataType.sf_inventory,
  SFInventorySchema()
);

registerCollection(
  'Store Inventory',
  DataType.sf_inventory_transfer,
  SFInventoryIntakeSchema()
);


registerCollection(
  'Store Inventory',
  DataType.sf_inventory_intake,
  SFInventoryIntakeSchema()
);
