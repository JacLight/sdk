import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * A pending purchase — the customer's cart and how far through checkout they got.
 *
 * Separate from `stowbo_booking` on purpose. A booking is a commitment: something
 * was paid for and a host is expected to honour it. A checkout is neither of
 * those yet, and most of them are abandoned. Keeping them apart means a booking
 * row always means a real booking — nothing has to remember to filter drafts out
 * of earnings, custody lists or availability.
 *
 * ONE checkout can buy SEVERAL different things: a driveway bay for the car, a
 * bag drop at a shop round the corner and a locker at the station are three
 * lines on one purchase, each with its own listing, window, quantity and price.
 * That is the point of the product — one trip, one payment — so every line
 * carries its own everything and the totals are the sum across them.
 *
 * Lifecycle:
 *   open      — a saved cart. Occupies nothing; it is a bookmark.
 *   held      — capacity is claimed for a few minutes while they pay.
 *   converted — became a booking. `booking` points at it.
 *   abandoned — released by the customer, or superseded.
 *   expired   — the hold lapsed. The cart survives; the claim did not.
 */
export const StowboCheckoutSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', readOnly: true },

      /** Email or id of whoever is buying. One open checkout per customer. */
      customer: { type: 'string', group: 'who' },

      /**
       * The things being bought. Different listings, different item types,
       * different windows — all on one purchase.
       */
      items: {
        type: 'array',
        title: 'Lines',
        items: {
          type: 'object',
          properties: {
            listing: { type: 'string' },
            listingTitle: { type: 'string' },
            /** Denormalized so the cart can be rendered without N lookups. */
            spaceType: { type: 'string' },
            hostId: { type: 'string' },
            startDate: { type: 'string', format: 'date-time' },
            endDate: { type: 'string', format: 'date-time' },
            quantity: { type: 'number', default: 1 },
            addOns: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  chargeEvery: { type: 'string' },
                  quantity: { type: 'number' },
                  subtotal: { type: 'number' },
                },
              },
            },
            /** Per-line money, kept apart so a multi-jurisdiction cart adds up. */
            price: { type: 'number' },
            addOnTotal: { type: 'number' },
            subtotal: { type: 'number' },
            /** This line's share of the cart discount, and the goods net of it. */
            discount: { type: 'number' },
            net: { type: 'number' },
            serviceFee: { type: 'number' },
            protectionFee: { type: 'number' },
            taxRate: { type: 'number' },
            taxJurisdiction: { type: 'string' },
            tax: { type: 'number' },
            total: { type: 'number' },
            /** Availability at last quote — advisory until the hold is taken. */
            available: { type: 'number' },
            sufficient: { type: 'boolean' },
            cancellationPolicy: {
              type: 'object',
              properties: {
                policy: { type: 'string' },
                freeUntil: { type: 'string', format: 'date-time' },
                refundablePortion: { type: 'number' },
              },
            },
          },
        },
      },

      currency: { type: 'string', default: 'USD', group: 'money' },
      subtotal: { type: 'number', group: 'money' },
      addOnTotal: { type: 'number', group: 'money' },
      /** Applied by DiscountService — the platform's one promotion engine. */
      discountCode: { type: 'string', group: 'money' },
      discount: { type: 'number', default: 0, group: 'money' },
      discounts: {
        type: 'array',
        group: 'money',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            identifier: { type: 'string' },
            type: { type: 'string' },
            amount: { type: 'number' },
            message: { type: 'string' },
          },
        },
      },
      serviceFee: { type: 'number', group: 'money' },
      protectionFee: { type: 'number', group: 'money' },
      tax: { type: 'number', group: 'money' },
      taxLines: {
        type: 'array',
        group: 'money',
        items: {
          type: 'object',
          properties: {
            listing: { type: 'string' },
            jurisdiction: { type: 'string' },
            rate: { type: 'number' },
            taxable: { type: 'number' },
            amount: { type: 'number' },
          },
        },
      },
      total: { type: 'number', group: 'money' },

      status: {
        type: 'string',
        enum: ['open', 'held', 'converted', 'abandoned', 'expired'],
        default: 'open',
        'x-control': 'label',
        group: 'meta',
        readOnly: true,
      },

      /** How far through the flow they got, so they can be dropped back there. */
      step: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['cart', 'details', 'payment', 'confirmed'] },
        default: 'cart',
        group: 'progress',
      },
      /** Client route or deep link to resume at. */
      returnTo: { type: 'string', group: 'progress' },
      /** Whatever the client needs to rebuild its form — vehicle, contact, notes. */
      context: { type: 'object', properties: {}, group: 'progress' },

      /** Set only while capacity is claimed. Null for a plain saved cart. */
      holdExpiresAt: { type: 'string', format: 'date-time', readOnly: true, group: 'meta' },
      /** The booking this became, once confirmed. */
      booking: { type: 'string', readOnly: true, group: 'meta' },
      abandonReason: { type: 'string', readOnly: true, group: 'meta' },

      startedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'meta' },
      lastActiveAt: { type: 'string', format: 'date-time', readOnly: true, group: 'meta' },
    },
  } as const;
};

const ps = StowboCheckoutSchema();
export type StowboCheckoutModel = FromSchema<typeof ps>;

registerCollection('Stowbo Checkout', DataType.stowbo_checkout, StowboCheckoutSchema());
