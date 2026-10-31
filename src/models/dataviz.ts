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
        enum: ['text', 'table', 'chart', 'query'],
        default: 'text',
      },
      content: {
        type: 'object',
        additionalProperties: true,
        description: 'For text: { text: "..." }. For table/chart: { collection, mongoQuery, viewConfig, keep } — keep: true stores the query\'s result per day (dataviz_aggregate)',
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
// DataViz Aggregate — one run of a query for one day (or month)
// ----------------------------------------------------------------------------
//
// The record's createdate is the day it stands for (00:00 UTC of the business
// date); timestamp is when the run started, modifydate when it finished. A run
// for a day replaces the one before it (`replaced`, `replacedBy`); the day's
// figures are the `meta` of its `current` (or `outdated`) run. A `skipped` run
// holds no figures: the days from its createdate to `skip.until` are left out.
export const DataVizAggregateSchema = () => {
  return {
    type: 'object',
    textSearch: false,
    properties: {
      name: { type: 'string', description: 'The run' },
      query: { type: 'string', description: 'Built-in query name, or a dataviz_item sk; * on a skip = every query' },
      span: { type: 'string', enum: ['day', 'month'], default: 'day' },
      meta: {
        type: 'object',
        additionalProperties: true,
        description: 'The summary: what the query returned for the day',
      },
      status: {
        type: 'string',
        enum: ['running', 'current', 'outdated', 'failed', 'replaced', 'skipped'],
      },
      trigger: {
        type: 'string',
        enum: ['night', 'first_night', 'outdated', 'query_changed', 'run_now', 'skip'],
      },
      queryVersion: { type: 'number' },
      read: { type: 'number', description: 'Source records the run read' },
      attempt: { type: 'number' },
      error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          reason: { type: 'string' },
          stage: { type: 'string', enum: ['read', 'compute', 'write'] },
        },
      },
      replacedBy: { type: 'string' },
      jobRun: { type: 'string', description: 'The scheduled job run it was part of' },
      remarks: { type: 'array', items: { type: 'string' } },
      skip: {
        type: 'object',
        properties: {
          reason: { type: 'string' },
          until: { type: 'string', format: 'date-time' },
          by: { type: 'string' },
        },
      },
    },
    required: ['name', 'query', 'span'],
  } as const;
};

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
const dvAggregate = DataVizAggregateSchema();
export type DataVizAggregateModel = FromSchema<typeof dvAggregate>;

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
registerCollection('DataVizAggregate', DataType.dataviz_aggregate, DataVizAggregateSchema());
