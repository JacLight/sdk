import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';
import { AddressSchema } from './crm/crm-address';

export const BusinessLocationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      type: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'json', json: ['address', 'website', 'virtual'] },
        group: 'name',
      },
      title: { type: 'string' },
      services: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'json', json: [] },
      },
      address: {
        type: 'object',
        properties: AddressSchema().properties,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'address', action: 'hide' },
        ],
      },
      meetingLink: {
        type: 'string',
        rules: [
          { operation: 'notIn', valueA: ['virtual', 'website'], valueB: '{{type}}', action: 'hide' },
        ],
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        rules: [
          { operation: 'notIn', valueA: ['virtual', 'website'], valueB: '{{type}}', action: 'hide' },
        ],
      },
      gridSize: { type: 'number', default: 20 },
      // Sales tax applied to orders taken at this location (POS tabs, quick sales).
      // Percent, so 8.875 = 8.875%. The server computes and persists order tax from
      // this; clients only display it.
      taxRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Sales tax rate for orders at this location, in percent (8.875 = 8.875%). 0 or empty = no tax.',
        group: 'tax',
      },
      taxName: {
        type: 'string',
        description: 'Label printed on receipts for the tax line (e.g. "Sales Tax", "VAT").',
        group: 'tax',
      },
      // IANA time zone the location trades in. Business dates (POS sales, invoices,
      // inventory movements, ledger entries) are derived in this zone so a 7 PM local
      // sale lands on today, not on tomorrow's UTC date. Falls back to the org's
      // business profile timezone when empty.
      timezone: {
        type: 'string',
        maxLength: 64,
        description: 'IANA time zone for this location, e.g. "America/Chicago". Sales, invoices and ledger entries are dated in this zone.',
        group: 'tax',
      },
      status: { type: 'string', enum: ['active', 'inactive'] },
    },
  } as const;
};

export const LocationSchema = BusinessLocationSchema;

const ps = BusinessLocationSchema();
export type BusinessLocationModel = FromSchema<typeof ps>;
export type LocationModel = BusinessLocationModel;

registerCollection('Business Location', DataType.location, BusinessLocationSchema());
