/**
 * Shared schema fragments for multi-location separation.
 *
 * `businessLocationId` (singular) — FK to DataType.location (a "Business Location" / venue / site).
 * Use this on operational records that happen at a single venue (POS sale, clock punch,
 * reservation, fulfillment ticket, kitchen ticket, inventory level, bank deposit).
 *
 * `businessLocationIds` (array) — for records that span multiple venues
 * (a single payroll run that includes employees across 4 locations, a corporate invoice
 * covering events at 3 venues, an employee assigned to multiple sites).
 *
 * Two-record pattern: catalog records (Product, Vendor, Item, TaxRate) live at entity level
 * with no `businessLocationId`. A separate "overlay" record (LocationProduct, LocationVendor,
 * LocationTaxRate, sf_inventory) holds per-location overrides such as availability,
 * price overrides, par levels, vendor terms, and jurisdiction-specific tax rates.
 *
 * NOTE: do NOT confuse with the existing `locationId` on `bm_tab`, `bm_fulfillment`,
 * and `bm_table` — those refer to a *seat-level* spot (table/room/counter/bar/seat)
 * INSIDE a venue, not the venue itself. Both fields can coexist on the same record.
 */
import { DataType, ControlType } from '../types';

/**
 * Single business-location FK. Mark the property as required at the schema level
 * (in the schema's `required: [...]` array) for operational records.
 */
export const BusinessLocationField = () => ({
  businessLocation: {
    type: 'string',
    description: 'FK to Business Location (venue / site / branch)',
    'x-control': ControlType.selectMany,
    'x-control-variant': 'chip',
    maxItems: 1,
    dataSource: {
      source: 'collection',
      collection: DataType.location,
      value: 'name',
      label: 'name',
    },
    group: 'businessLocation',
  },
} as const);


