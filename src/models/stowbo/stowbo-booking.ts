import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

/**
 * A booking is an ORDER. It centralises what the customer pays.
 *
 * What actually happens at each thing booked lives on `stowbo_booking_item` —
 * one record per unit, with its own window, its own check-in and check-out, its
 * own movements and its own status. Book twelve units and you have one booking
 * and twelve items: two end on Tuesday, three on Friday, one is disputed
 * because the door would not open, and the rest run on.
 *
 * Money here, operations there. Nothing about a session belongs on this record.
 *
 * Two things are deliberately NOT stored:
 *
 *   payments   `PaymentService` writes an `sf_transaction` for every charge,
 *              authorization, capture and refund, carrying `metadata.booking`.
 *              There are many per booking — part paid at check-in, a deposit
 *              held, the balance at check-out, a refund the week after — and a
 *              copy here would hide them from every cross-booking question.
 *                find(sf_transaction, { 'data.metadata.booking': <sk> })
 *
 *   balance    `total` minus what those transactions come to. Any stored copy
 *              is wrong the moment money moves from anywhere else.
 */
export const StowboBookingSchema = () => {
  return {
    type: 'object',
    properties: {
      // the booking reference — generated, and unique across the platform
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['random-string::10', 'uri'],
        title: 'ID',
        group: 'name',
      },
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'name',
          label: 'name',
        },
        group: 'name',
      },

      image: { type: 'string', hidden: true },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        hideLabel: true,
      },

      /**
       * The bill. Every charge is a line — the space itself, an add-on, a fee,
       * tax, a discount, damage added later.
       *
       * A fee is a line item, not a column beside them. `serviceFee` and
       * `protectionFee` as their own fields meant a host wanting a cleaning
       * fee, a key fee or an oversize fee had nowhere to put it, and every
       * charge anyone thought of was a schema change.
       *
       * Nothing here is ever edited. A mistake is reversed by another line, so
       * "why is this $40 more than I was quoted" — the question every dispute
       * opens with — stays answerable.
       */
      items: {
        type: 'array',
        title: 'Bill',
        'x-control': ControlType.table,
        operations: ['pick', 'add', 'remove'],
        dataSource: {
          source: 'collection',
          collection: DataType.stowbo_listing,
          value: 'name',
          label: 'title',
        },
        items: {
          type: 'object',
          properties: {
            kind: {
              type: 'string',
              enum: ['space', 'addon', 'fee', 'tax', 'discount', 'adjustment', 'overstay'],
              default: 'space',
            },
            /** What the customer reads on the bill. */
            label: { type: 'string' },
            /**
             * Stable key for reporting — 'protection', 'cleaning', 'damage',
             * 'parking_tax', anything. Free text: a fixed list is a host with a
             * charge nobody anticipated and nowhere to put it.
             */
            code: { type: 'string' },
            /** SIGNED — a discount is negative, so summing needs no rules. */
            amount: { type: 'number' },
            /** Whose charge it is. The platform adds its own the same way. */
            by: { type: 'string', enum: ['host', 'platform'], default: 'host' },
            /**
             * Who absorbs it — not the same as who charged it. Comping a guest
             * costs the platform; charging for damage pays the host.
             */
            bearer: { type: 'string', enum: ['guest', 'host', 'platform'], default: 'guest' },
            /** How much of this line the host keeps. */
            hostPortion: { type: 'number', default: 0 },
            /** Rate, jurisdiction, band breakdown — whatever the kind needs. */
            meta: { type: 'object', properties: {} },
            /** Evidence. A damage charge without a photo does not survive a chargeback. */
            files: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
            /** When it was added. Damage lands long after the quote. */
            at: { type: 'string', format: 'date-time' },
            addedBy: { type: 'string' },
            /**
             * Reversals do not delete. The original stays and these point at
             * the line that undid it.
             */
            reversedBy: { type: 'string', readOnly: true },
            reversalOf: { type: 'string', readOnly: true },
            settled: { type: 'boolean', default: false },

            // --- `space` lines only ------------------------------------------
            listing: { type: 'string' },
            // denormalized at booking time so apps can label the line and reach
            // the host without a second lookup
            listingTitle: { type: 'string' },
            hostId: { type: 'string' },
            hostEmail: { type: 'string' },
            quantity: { type: 'number', default: 1 },
            startDate: { type: 'string', 'x-control': ControlType.date },
            endDate: { type: 'string', 'x-control': ControlType.date },
            /** Picked from the catalog, priced at time of booking. */
            addOns: {
              type: 'array',
              'x-control': ControlType.table,
              operations: ['pick', 'add', 'remove'],
              dataSource: {
                source: 'collection',
                collection: DataType.stowbo_addon,
                value: 'name',
                label: 'title',
              },
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number', default: 0 },
                  chargeEvery: { type: 'string' },
                  quantity: { type: 'number', default: 1 },
                },
              },
            },
          },
        },
      },

      currency: { type: 'string', group: 'money' },

      /**
       * The sum of `items[].amount`. Stored only because list screens sort and
       * filter on it, and Mongo cannot sort on something computed at read time.
       * A pure function of fields on this same record.
       */
      total: { type: 'number', group: 'money', readOnly: true },

      /**
       * Not revenue. Held against something going wrong and returned when it
       * does not, so it is tracked apart from what was earned — booking a
       * returned deposit as a refund makes every revenue figure wrong.
       *
       * The gateway holds the money and records its own transactions; this is
       * the outcome, so a list screen need not re-derive it.
       */
      deposit: {
        type: 'object',
        group: 'money',
        properties: {
          amount: { type: 'number', default: 0 },
          refundable: { type: 'boolean', default: true },
          status: {
            type: 'string',
            enum: ['none', 'held', 'applied', 'returned'],
            default: 'none',
            readOnly: true,
          },
          method: { type: 'string', enum: ['authorized', 'charged'], readOnly: true },
          applied: { type: 'number', default: 0, readOnly: true },
          returned: { type: 'number', default: 0, readOnly: true },
          heldAt: { type: 'string', format: 'date-time', readOnly: true },
          returnedAt: { type: 'string', format: 'date-time', readOnly: true },
        },
      },

      /**
       * Payout withheld while something is unresolved. Settlement still runs;
       * the host is simply not paid yet.
       */
      paymentHold: {
        type: 'object',
        group: 'money',
        readOnly: true,
        properties: {
          reason: { type: 'string' },
          note: { type: 'string' },
          heldAt: { type: 'string', format: 'date-time' },
          heldBy: { type: 'string' },
        },
      },

      /** The terms in force when this booking was confirmed. */
      cancellationPolicy: {
        type: 'object',
        group: 'money',
        readOnly: true,
        properties: {
          policy: { type: 'string' },
          freeUntil: { type: 'string', format: 'date-time' },
          refundablePortion: { type: 'number' },
        },
      },

      /**
       * Which door this was opened through — the app, a host taking someone on
       * the spot, a scanned code. Free text; the engine never branches on it.
       */
      intakeDoor: { type: 'string', readOnly: true, group: 'meta' },

      /**
       * The pending purchase this came from — a `stowbo_cart` record.
       *
       * "Check-out" means ending a session here, and nothing else. What a
       * customer fills before they buy is a cart.
       */
      cart: { type: 'string', readOnly: true, group: 'meta' },

      cancelledAt: { type: 'string', format: 'date-time', readOnly: true, group: 'meta' },
      cancelReason: { type: 'string', readOnly: true, group: 'meta' },

      /**
       * What happened to the ORDER, in order — booked, authorised, adjusted,
       * settled, paid out, cancelled. Per-unit events belong on the booking
       * item's own record.
       *
       * Status is a single word and it forgets. This is what an operator reads
       * when a customer says "I paid that on Tuesday".
       */
      timeline: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            at: { type: 'string' },
            type: {
              type: 'string',
              enum: [
                'booked', 'authorized', 'adjustment', 'extended',
                'settled', 'paid_out', 'cancelled', 'note',
              ],
            },
            actor: { type: 'string' },
            /** 'guest' | 'host' | 'operator' | 'system' — who moved it. */
            actorRole: { type: 'string' },
            line: { type: 'number' },
            amount: { type: 'number' },
            detail: { type: 'string' },
          },
        },
      },

      /**
       * The ORDER's state. What is happening at each unit is on the booking
       * item — twelve units can be in twelve different places at once.
       */
      status: {
        type: 'string',
        enum: ['requested', 'confirmed', 'active', 'completed', 'settled', 'cancelled'],
        default: 'requested',
        group: 'meta',
      },
    },
  } as const;
};

const ps = StowboBookingSchema();
export type StowboBookingModel = FromSchema<typeof ps>;

registerCollection('Stowbo Booking', DataType.stowbo_booking, StowboBookingSchema());
