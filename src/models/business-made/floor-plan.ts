import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const TableSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::tbl-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      number: {
        type: 'number',
        group: 'name',
      },
      floorPlanId: {
        type: 'string',
        description: 'Optional - table can exist independently',
        group: 'location',
      },
      sectionId: {
        type: 'string',
        description: 'Optional - table can belong to a section',
        group: 'location',
      },
      capacity: {
        type: 'number',
        default: 4,
        group: 'capacity',
      },
      minCapacity: {
        type: 'number',
        default: 1,
        group: 'capacity',
      },
      maxCapacity: {
        type: 'number',
        group: 'capacity',
      },
      shape: {
        type: 'string',
        enum: ['square', 'rectangle', 'round', 'oval'],
        default: 'square',
        group: 'layout',
      },
      position: {
        type: 'object',
        properties: {
          x: { type: 'number', default: 0 },
          y: { type: 'number', default: 0 },
          rotation: { type: 'number', default: 0 },
        },
        group: 'layout',
      },
      status: {
        type: 'string',
        enum: ['available', 'occupied', 'reserved', 'dirty', 'blocked'],
        default: 'available',
        group: 'status',
      },
      currentOrderId: {
        type: 'string',
        group: 'current',
      },
      currentServerId: {
        type: 'string',
        group: 'current',
      },
      currentPartySize: {
        type: 'number',
        group: 'current',
      },
      seatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'current',
      },
      estimatedEndTime: {
        type: 'string',
        format: 'date-time',
        group: 'current',
      },
      isActive: {
        type: 'boolean',
        default: true,
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['name', 'capacity'],
  } as const;
};

export const SectionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::sec-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        group: 'name',
      },
      floorPlanId: {
        type: 'string',
        description: 'Floor plan this section belongs to',
      },
      color: {
        type: 'string',
        'x-control': ControlType.color,
      },
      serverId: {
        type: 'string',
        group: 'server',
      },
      serverName: {
        type: 'string',
        group: 'server',
      },
      tableIds: {
        type: 'array',
        items: { type: 'string' },
      },
      isActive: {
        type: 'boolean',
        default: true,
      },
      sortOrder: {
        type: 'number',
        default: 0,
      },
    },
    required: ['name'],
  } as const;
};

export const FloorPlanSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::fp-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        group: 'name',
      },
      locationId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
      width: {
        type: 'number',
        default: 800,
        group: 'dimensions',
      },
      height: {
        type: 'number',
        default: 600,
        group: 'dimensions',
      },
      gridSize: {
        type: 'number',
        default: 20,
        group: 'dimensions',
      },
      backgroundImage: {
        type: 'string',
      },
      isDefault: {
        type: 'boolean',
        default: false,
        group: 'status',
      },
      isActive: {
        type: 'boolean',
        default: true,
        group: 'status',
      },
      sections: {
        type: 'array',
        collapsible: true,
        items: SectionSchema(),
      },
      tables: {
        type: 'array',
        collapsible: true,
        items: TableSchema(),
      },
    },
    required: ['name'],
  } as const;
};

const fp = FloorPlanSchema();
export type FloorPlanModel = FromSchema<typeof fp>;

const tb = TableSchema();
export type TableModel = FromSchema<typeof tb>;

const sc = SectionSchema();
export type SectionModel = FromSchema<typeof sc>;

registerCollection('Floor Plan', DataType.bm_floor_plan, FloorPlanSchema());
registerCollection('Table', DataType.bm_table, TableSchema());
registerCollection('Section', DataType.bm_section, SectionSchema());
