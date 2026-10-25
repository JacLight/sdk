/**
 * The conversion rate a sale used. Every sale (cart, checkout, order, invoice,
 * payment, refund, booking, subscription, rental) stores the rate it was made at,
 * so its amounts can always be read back in the base currency, whatever rates do later.
 *
 * The server writes these on save when they are empty (rate 1 when the sale is in the
 * base currency). A cart keeps its rate for one day from its last update, then takes
 * the current rate; an order made from a cart keeps the cart's rate.
 */
export const SaleRateFields = () => ({
  baseCurrency: {
    type: 'string',
    title: 'Base currency',
    description: "The org's base currency when the sale was made.",
    readOnly: true,
    group: 'rate',
  },
  exchangeRate: {
    type: 'number',
    title: 'Exchange rate',
    description: '1 base = this many of the sale currency, as used for this sale (1 when the sale is in the base).',
    readOnly: true,
    group: 'rate',
  },
  rateDate: {
    type: 'string',
    title: 'Rate date',
    description: 'The market day of the rate used.',
    readOnly: true,
    group: 'rate',
  },
} as const);
