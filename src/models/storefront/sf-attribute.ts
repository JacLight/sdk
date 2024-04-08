import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
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
        enum: ['selection', 'number', 'date', 'text'],
        group: 'name',
      },
      display: {
        type: 'string',
        enum: ['checkbox', 'select', 'radio', 'range-input', 'range-slider', 'image', 'color'],
        group: 'minmax',
        rules: [
          { operation: 'notIn', valueA: ['price', 'date'], valueB: '{{type}}', action: 'set-property', property: [{ key: 'enum', value: ['checkbox', 'select', 'radio', 'image', 'color'] }] },
          { operation: 'in', valueA: ['price', 'date'], valueB: '{{type}}', action: 'set-property', property: [{ key: 'enum', value: ['checkbox', 'select', 'radio', 'range-input', 'range-slider'] }] },
        ]
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
            param: { type: 'string' },
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

export const SFAttributeRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Attribute',
  DataType.sf_attribute,
  SFAttributeSchema(),
  null,
  SFAttributeRules(),
  true
);
