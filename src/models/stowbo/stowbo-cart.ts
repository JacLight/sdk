import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * A cart — a pending purchase, and how far through buying it they got.
 *
 * Separate from `stowbo_booking` on purpose. A booking is a commitment: something
 * was paid for and a host is expected to honour it. A cart is neither of
 * those yet, and most of them are abandoned. Keeping them apart means a booking
 * row always means a real booking — nothing has to remember to filter drafts out
 * of earnings, custody lists or availability.
 *
 * ONE cart can buy SEVERAL different things: a driveway bay for the car, a
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
export const StowboCartSchema = () => {
  return {
    type: 'object',
    properties: {
      // Generated like every other record's key (booking, listing) — a cart
      // needs an id of its own. Without a transform it was left null on create,
      // which the write rejects.
      name: {
        type: 'string',
        unique: true,
        transform: ['random-string::10', 'uri'],
        readOnly: true,
      },

      /** Email or id of whoever is buying. One open cart per customer. */
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
            label: { type: 'string' },
            code: { type: 'string' },
            /** SIGNED — a discount is negative, so summing needs no rules. */
            amount: { type: 'number' },
            by: { type: 'string', enum: ['host', 'platform'], default: 'host' },
            meta: { type: 'object', properties: {} },

            price: { type: 'number' },
            addOnTotal: { type: 'number' },
            subtotal: { type: 'number' },
            /** This line's share of the cart discount, and the goods net of it. */
            discount: { type: 'number' },
            net: { type: 'number' },
            /** Fees applied to this line, each snapshotted at order time, and
             *  their sum. Dynamic rows, never named columns. */
            feeTotal: { type: 'number' },
            fees: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  label: { type: 'string' },
                  amount: { type: 'number' },
                  by: { type: 'string', enum: ['host', 'platform'] },
                  taxable: { type: 'boolean' },
                },
              },
            },
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

      /**
       * The promo code the customer applied, kept so resuming re-applies it —
       * a code, unlike its effect, cannot be reconstructed from the lines. The
       * discount AMOUNT is not stored here; it is a line in `items` (kind
       * 'discount'), which is the whole point of the line-based model.
       */
      discountCode: { type: 'string', group: 'money' },

      /**
       * Derived from the line items in `items`, exactly as on the booking this
       * becomes. A cart is a pending order, so it carries the same lines —
       * space, add-ons, fees, tax, discounts — and `total` is their sum.
       *
       * The flat money fields this replaces (`subtotal`, `addOnTotal`,
       * `discount`, `serviceFee`, `protectionFee`, `tax` and their companions)
       * were the same mistake made twice: a named column per kind of charge, so
       * every new charge was a schema change and a cart and the booking it
       * became described money differently.
       */
      total: { type: 'number', group: 'money', readOnly: true },

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

const ps = StowboCartSchema();
export type StowboCartModel = FromSchema<typeof ps>;

registerCollection('Stowbo Cart', DataType.stowbo_cart, StowboCartSchema());
