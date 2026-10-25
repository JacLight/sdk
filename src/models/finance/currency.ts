import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { getCurrencies } from '../../data/countries/search';

/**
 * One currency the org has approved to sell in, besides its base currency
 * (`company.data.businessProfile.currency`). A currency without a record is not
 * offered anywhere — sites, products, orders and price lists list only these.
 *
 * The org sets the markup and, if it wants, a locked rate; the server writes the
 * market rate and the rate in use, on every save and after the daily refresh.
 * Rates are "1 base = rate × this currency".
 */
export const CurrencySchema = () => {
  return {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        title: 'Currency',
        enum: getCurrencies(),
        description: 'ISO 4217 code, e.g. EUR',
        group: 'currency',
      },
      markupPercent: {
        type: 'number',
        title: 'Markup %',
        default: 0,
        minimum: 0,
        maximum: 100,
        description: 'Added on top of the rate, e.g. 2 to cover card conversion fees',
        group: 'rate',
      },
      lockedRate: {
        type: 'number',
        title: 'Locked rate',
        exclusiveMinimum: 0,
        description: 'Use this rate instead of the market rate. Empty = the market rate.',
        group: 'rate',
      },
      lockedUntil: {
        type: 'string',
        format: 'date',
        title: 'Locked until',
        description: 'The lock ends after this day and the market rate is used again. Empty = until it is removed.',
        group: 'rate',
      },
      rounding: {
        type: 'string',
        title: 'Rounding',
        enum: ['none', 'x.99', 'x.95', 'whole'],
        default: 'none',
        description: 'How converted prices end: none (to the cent), .99, .95, or whole units',
        group: 'rate',
      },
      driftAlertPercent: {
        type: 'number',
        title: 'Drift alert %',
        default: 3,
        minimum: 0,
        description: 'Flag a locked rate that is this far from the market rate (0 = never)',
        group: 'rate',
      },
      baseCurrency: {
        type: 'string',
        title: 'Base currency',
        readOnly: true,
        description: 'The org base currency the rates are from, as of the last save or refresh',
        group: 'server',
      },
      marketRate: {
        type: 'number',
        title: 'Market rate',
        readOnly: true,
        description: '1 base = this many units, from the daily rates',
        group: 'server',
      },
      marketRateDate: {
        type: 'string',
        format: 'date',
        title: 'Market rate date',
        readOnly: true,
        group: 'server',
      },
      rateSource: { type: 'string', title: 'Rate source', readOnly: true, group: 'server' },
      locked: {
        type: 'boolean',
        title: 'Locked',
        readOnly: true,
        description: 'The locked rate is in use (set, and not past its date)',
        group: 'server',
      },
      drift: {
        type: 'number',
        title: 'Drift %',
        readOnly: true,
        description: 'How far the locked rate is from the market rate, in % (+ above, − below)',
        group: 'server',
      },
      driftAlert: {
        type: 'boolean',
        title: 'Drift alert',
        readOnly: true,
        description: 'The locked rate is at least the drift alert % away from the market rate',
        group: 'server',
      },
      rate: {
        type: 'number',
        title: 'Rate in use',
        readOnly: true,
        description: '(locked rate, or the market rate) × (1 + markup %) — what prices are converted with',
        group: 'server',
      },
    },
    required: ['code'],
  } as const;
};

const _currency = CurrencySchema();
export type CurrencyModel = FromSchema<typeof _currency>;

registerCollection('Currency', DataType.currency, CurrencySchema());

/**
 * One day of market exchange rates for the whole platform, kept in the shared
 * org. Every rate is against `pivot` (1 pivot = rate × quote); any pair is
 * rate(B) ÷ rate(A). Old days stay, so a rate used on an order can be traced.
 */
export const ExchangeRateSchema = () => {
  return {
    type: 'object',
    properties: {
      date: { type: 'string', format: 'date', title: 'Date', description: 'The day these rates were fetched for' },
      pivot: { type: 'string', title: 'Pivot', default: 'USD' },
      rates: {
        type: 'object',
        title: 'Rates',
        additionalProperties: { type: 'number' },
        description: '1 pivot = this many units of each currency code',
      },
      source: { type: 'string', title: 'Source', description: 'Where the rates came from, e.g. frankfurter' },
    },
    required: ['date', 'pivot', 'rates'],
  } as const;
};

const _exchangeRate = ExchangeRateSchema();
export type ExchangeRateModel = FromSchema<typeof _exchangeRate>;

registerCollection('Exchange Rate', DataType.exchange_rate, ExchangeRateSchema());
