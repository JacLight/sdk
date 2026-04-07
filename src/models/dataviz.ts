import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';

// ============================================================================
// DataViz Models — Two separate collections
// ============================================================================
//
//   DataViz       — the dashboard layout (sections → columns → item refs)
//   dataview_item  — reusable items (text, table, chart) referenced by layouts
//
// Structure:
//   dataview (dashboard)
//     └── sections[]
//           └── columns[]
//                 └── itemRefs[] (references to dataview_item records)
//
//   dataview_item
//     name, description, type (text|table|chart), content
//     - text: { text: "..." }
//     - table/chart: { mongoQuery, viewConfig }
// ============================================================================

// ----------------------------------------------------------------------------
// DataView Item — reusable text, table, or chart
// ----------------------------------------------------------------------------
export const DataVizItemSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 80,
        unique: true,
        transform: 'uri',
      },
      title: { type: 'string' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      type: {
        type: 'string',
        enum: ['text', 'table', 'chart'],
        default: 'text',
      },
      content: {
        type: 'object',
        additionalProperties: true,
        description: 'For text: { text: "..." }. For table/chart: { mongoQuery, viewConfig }',
      },
      tags: { type: 'array', items: { type: 'string' } },
    },
    required: ['name', 'type'],
  } as const;
};

// ----------------------------------------------------------------------------
// DataView Layout sub-schemas
// ----------------------------------------------------------------------------
const DataVizColumnSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string', hidden: true },
      width: { type: 'string', description: 'full, half, third, quarter, or CSS value' },
      items: {
        type: 'array',
        description: 'References to dataviz_item records',
        items: {
          type: 'string',
          'x-control-variant': 'chip',
          'x-control': ControlType.selectMany,
          dataSource: {
            source: 'collection',
            collection: DataType.dataviz_item,
            value: 'sk',
            label: 'name',
          },
        },
      },
      classes: { type: 'string', hidden: true },
    },
  } as const;
};

const DataVizSectionSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string', hidden: true },
      title: { type: 'string' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      layout: { type: 'string', enum: ['grid', 'row', 'tabs', 'accordion'], default: 'grid' },
      gridCols: { type: 'number', default: 12 },
      columns: { type: 'array', items: DataVizColumnSchema() },
      classes: { type: 'string', hidden: true },
    },
  } as const;
};

// ----------------------------------------------------------------------------
// DataViz — dashboard layout
// ----------------------------------------------------------------------------
export const DataVizSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 80,
        unique: true,
        transform: 'uri',
      },
      title: { type: 'string' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      tags: { type: 'array', items: { type: 'string' } },

      sections: {
        type: 'array',
        items: DataVizSectionSchema(),
      },

      filters: {
        type: 'object',
        properties: {
          dateRange: {
            type: 'object',
            properties: {
              startDate: { type: 'string' },
              endDate: { type: 'string' },
            },
          },
          custom: { type: 'object', additionalProperties: true },
        },
      },

      classes: { type: 'string', hidden: true },
      style: { type: ['string', 'object'], hidden: true },
    },
    required: ['name'],
  } as const;
};

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
const dvItem = DataVizItemSchema();
export type DataVizItemModel = FromSchema<typeof dvItem>;

const dvColumn = DataVizColumnSchema();
export type DataVizColumnModel = FromSchema<typeof dvColumn>;

const dvSection = DataVizSectionSchema();
export type DataVizSectionModel = FromSchema<typeof dvSection>;

const dvMain = DataVizSchema();
export type DataVizModel = FromSchema<typeof dvMain>;

// Legacy aliases

// ----------------------------------------------------------------------------
// Register collections
// ----------------------------------------------------------------------------
registerCollection('DataViz', DataType.dataviz, DataVizSchema());
registerCollection('DataVizItem', DataType.dataviz_item, DataVizItemSchema());
