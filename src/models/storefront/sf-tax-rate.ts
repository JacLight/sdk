import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { getCountryDropDownOptions } from '../../data';

/**
 * A single tax jurisdiction rate (state sales tax, a city surtax, a VAT line…).
 *
 * Rates are catalog records at org level. `TaxService.resolveRates` collects the
 * active rows effective on the order date, keeps those whose jurisdiction fields
 * all match the destination address (every field a row specifies must equal the
 * address field, case-insensitive; `zipPrefix` is a prefix match), orders them by
 * `priority` and stacks them: non-compound rates apply to the taxable base,
 * compound rates apply to base + tax already applied. A row with a
 * `businessLocationId` only applies to orders taken at that venue.
 */
export const SFTaxRateSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        description: 'Operator-facing name, e.g. "Texas State Sales Tax"',
        group: 'general',
      },
      taxName: {
        type: 'string',
        description: 'Label printed on receipts for this line, e.g. "TX State"',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        group: 'status',
      },
      rate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Percent. 6.25 = 6.25%',
        group: 'status',
      },
      jurisdictionType: {
        type: 'string',
        enum: ['country', 'state', 'county', 'city', 'zip', 'custom'],
        default: 'state',
        description: 'Which level of jurisdiction this rate belongs to',
        group: 'jurisdiction',
      },
      country: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        maxItems: 1,
        dataSource: {
          source: 'json',
          json: getCountryDropDownOptions(),
        },
        description: 'ISO 3166-1 alpha-2, e.g. US. Empty = any country',
        group: 'jurisdiction',
      },
      state: {
        type: 'string',
        description: 'State / province / region code, e.g. TX. Empty = any state',
        group: 'jurisdiction',
      },
      county: {
        type: 'string',
        description: 'County name. Empty = any county',
        group: 'jurisdiction2',
      },
      city: {
        type: 'string',
        description: 'City name. Empty = any city',
        group: 'jurisdiction2',
      },
      zipPrefix: {
        type: 'string',
        description: 'Postal-code prefix, e.g. 752 matches 75201…75299. Empty = any postal code',
        group: 'jurisdiction2',
      },
      appliesTo: {
        type: 'string',
        enum: ['goods', 'services', 'shipping', 'all'],
        default: 'all',
        description: 'Which charges this rate taxes',
        group: 'application',
      },
      priority: {
        type: 'number',
        default: 0,
        description: 'Application order, lowest first. Compound rates should come after the rates they stack on',
        group: 'application',
      },
      compound: {
        type: 'boolean',
        default: false,
        description: 'Apply on top of tax already applied by lower-priority rates (tax on tax)',
        group: 'application',
      },
      businessLocationId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        maxItems: 1,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
        description: 'Optional. Restrict this rate to orders taken at one business location',
        group: 'location',
      },
      effectiveFrom: {
        type: 'string',
        format: 'date',
        description: 'First day the rate applies (inclusive). Empty = always',
        group: 'effective',
      },
      effectiveTo: {
        type: 'string',
        format: 'date',
        description: 'Last day the rate applies (inclusive). Empty = open-ended',
        group: 'effective',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['name', 'rate'],
  } as const;
};

const schema = SFTaxRateSchema();
export type SFTaxRateModel = FromSchema<typeof schema>;

registerCollection('Tax Rate', DataType.sf_tax_rate, SFTaxRateSchema());
