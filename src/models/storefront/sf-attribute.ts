import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { DataType, ControlType } from '../../types';

export const SFAttributeSchema = () => {
  return {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_attribute,
          value: 'name',
          label: 'name',
        },
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      title: {
        group: 'name',
        type: 'string',
      },
      type: {
        type: 'string',
        // 'file' = shopper uploads one or more files at purchase (artwork,
        // print instructions, spec sheets). 'text' = free-text input. Both are
        // customer-supplied rather than preset choices, so they carry no
        // `options[]`; a `file` attribute is configured with the file fields
        // below and stores FileInfo objects on the line item.
        enum: ['selection', 'number', 'date', 'text', 'file'],
        group: 'name',
      },
      display: {
        type: 'string',
        enum: ['checkbox', 'select', 'radio', 'range-input', 'range-slider', 'image', 'color'],
        group: 'minmax',
        rules: [
          // text/file are direct inputs with no widget choice — hide display.
          { operation: 'in', valueA: ['text', 'file'], valueB: '{{type}}', action: 'hide' },
          { operation: 'notIn', valueA: ['price', 'date'], valueB: '{{type}}', action: 'set-property', property: [{ key: 'enum', value: ['checkbox', 'select', 'radio', 'image', 'color'] }] },
          { operation: 'in', valueA: ['price', 'date'], valueB: '{{type}}', action: 'set-property', property: [{ key: 'enum', value: ['checkbox', 'select', 'radio', 'range-input', 'range-slider'] }] },
        ]
      },
      // ---- file attribute config (only shown when type === 'file') ----
      multiple: {
        type: 'boolean',
        group: 'file',
        hint: 'Allow the shopper to upload more than one file (e.g. artwork + a spec sheet).',
        rules: [{ operation: 'notEqual', valueA: 'file', valueB: '{{type}}', action: 'hide' }],
      },
      accept: {
        type: 'string',
        group: 'file',
        hint: 'Comma-separated accepted file types, e.g. ".png,.jpg,.pdf,.ai,.svg". Blank = any.',
        rules: [{ operation: 'notEqual', valueA: 'file', valueB: '{{type}}', action: 'hide' }],
      },
      maxFiles: {
        type: 'number',
        group: 'file',
        hint: 'Maximum number of files (only applies when multiple is on). Blank = unlimited.',
        rules: [{ operation: 'notEqual', valueA: 'file', valueB: '{{type}}', action: 'hide' }],
      },
      maxValue: {
        type: 'string',
        group: 'minmax',
        rules: [
          { operation: 'notIn', valueA: ['date', 'number'], valueB: '{{type}}', action: 'hide' },
        ]
      },
      minValue: {
        group: 'minmax',
        type: 'string',
        rules: [
          { operation: 'notIn', valueA: ['date', 'number'], valueB: '{{type}}', action: 'hide' },
        ]
      },
      minIncrement: {
        type: 'number',
        group: 'minmax',
        rules: [
          { operation: 'notIn', valueA: ['checkbox', 'select', 'radio'], valueB: '{{display}}', action: 'hide' },
        ]
      },
      options: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            label: { type: 'string' },
            value: { type: 'string' },
            // Free-form metadata: prep-station override, SKU mapping, etc.
            param: { type: 'string' },
            // Price adjustment when this option is picked, added to the line
            // base price (positive = upcharge, negative = discount). Empty/0 =
            // no adjustment. Used by the order config drawer to compute line
            // totals.
            priceDelta: { type: 'number' },
          },
        },
        rules: [
          { operation: 'notEqual', valueA: 'selection', valueB: '{{type}}', action: 'hide' },
        ]
      },
    },
  } as const;
};



const ms = SFAttributeSchema();
export type SFAttributeModel = FromSchema<typeof ms>;

registerCollection(
  'Store Attribute',
  DataType.sf_attribute,
  SFAttributeSchema(),
);
