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
      // Everything below describes what InventoryService ACTUALLY persists
      // (`InventoryModel`, src/storefront/services/inventory.service.ts:5). The
      // schema previously declared only product/location/supplier/quantity, so
      // most of a stored inventory record had no schema at all — it rendered as
      // unknown fields in Data Explorer and couldn't be form-edited. The service
      // is the source of truth; this brings the declaration in line with it.
      //
      // `product`/`location` above are the pickers; `sku`/`locationId` are what
      // the service writes and joins on.
      sku: {
        type: 'string',
      },
      productName: {
        type: 'string',
      },
      locationId: {
        type: 'string',
      },
      locationName: {
        type: 'string',
      },
      reservedQuantity: {
        type: 'number',
      },
      availableQuantity: {
        type: 'number',
      },
      reorderPoint: {
        type: 'number',
      },
      reorderQuantity: {
        type: 'number',
      },
      lastCountDate: {
        type: 'string',
        format: 'date-time',
      },
      lastRestockDate: {
        type: 'string',
        format: 'date-time',
      },
      unitCost: {
        type: 'number',
      },
      currency: {
        type: 'string',
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
