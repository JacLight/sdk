import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

/**
 * A booking is an order. The header is the customer and the money; every
 * thing actually booked is a line on `items` — 2 small lockers, 1 large
 * locker and a parking bay go on one booking.
 *
 * Each line carries its own window, its own assigned unit and its own custody
 * evidence, because lines are dropped off and retrieved independently.
 *
 * Lifecycle is not tracked here — set `collection.data.workflow =
 * 'stowbo-custody-pipeline'` and every booking materializes a workflow Task
 * that walks Requested -> Confirmed -> In custody -> Retrieved -> Settled.
 * The stage's SLA tiers drive overstay. `status` is mirrored back by the
 * stage's modelStatus.
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

      image: {
        type: 'string',
        hidden: true,
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        hideLabel: true,
      },

      // the order lines
      items: {
        type: 'array',
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
            listing: { type: 'string' },
            // denormalized from the listing at booking time so the apps can
            // label the line and reach the host without a second lookup
            listingTitle: { type: 'string' },
            hostId: { type: 'string' },
            hostEmail: { type: 'string' },
            // assigned at drop-off, when the listing has numbered units
            unit: { type: 'string' },
            quantity: { type: 'number', default: 1 },
            startDate: { type: 'string', 'x-control': ControlType.date },
            endDate: { type: 'string', 'x-control': ControlType.date },

            // picked from the catalog, priced at time of booking
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

            // custody evidence for this line — code + photo + count, both directions
            tags: { type: 'array', items: { type: 'string' } },
            declaredValue: { type: 'number' },
            condition: { type: 'string' },
            dropoffPhotos: { type: 'array', items: FileInfoSchema() },
            pickupPhotos: { type: 'array', items: FileInfoSchema() },
            state: {
              type: 'string',
              enum: ['booked', 'stored', 'retrieved', 'damaged', 'lost', 'abandoned'],
              default: 'booked',
            },

            price: { type: 'number' },
            subtotal: { type: 'number' },
          },
        },
      },

      // no matching code, no hand-back
      dropoffCode: { type: 'string', group: 'codes' },
      pickupCode: { type: 'string', group: 'codes' },

      currency: { type: 'string', group: 'money' },
      subtotal: { type: 'number', group: 'money' },
      addOnTotal: { type: 'number', group: 'money' },
      deposit: { type: 'number', group: 'money' },
      overstayCharge: { type: 'number', group: 'money' },
      total: { type: 'number', group: 'money' },

      /**
       * Money that happened AFTER the quote — every charge, discount, refund and waiver,
       * as its own immutable line.
       *
       * A booking is not a price, it is a running account: a bag stays three days longer,
       * a lock gets cut, a host is comped for a bad handover. Storing only a `total`
       * means the operator can change the number but nobody can ever answer "why is this
       * $40 more than they were quoted" — which is the question every dispute starts with.
       * So nothing here is ever edited; a mistake is reversed by another line.
       *
       * `bearer` is who the money moves against, because these are not the same event:
       * comping a guest costs the platform, while charging for damage pays the host.
       */
      adjustments: {
        type: 'array',
        'x-control': ControlType.table,
        operations: ['add', 'remove'],
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true },
            kind: {
              type: 'string',
              enum: ['charge', 'discount', 'refund', 'waiver'],
              description: 'charge adds, discount/refund/waiver take away',
            },
            category: {
              type: 'string',
              enum: [
                'overstay', 'damage', 'cleaning', 'lost_key', 'lock_cut', 'oversize',
                'late_cancellation', 'no_show', 'goodwill', 'price_match', 'promo',
                'service_failure', 'insurance_excess', 'disposal', 'other',
              ],
            },
            amount: { type: 'number' },
            /** guest pays it, host absorbs it, or the platform eats it. */
            bearer: { type: 'string', enum: ['guest', 'host', 'platform'], default: 'guest' },
            /** How much of this line the host keeps. Damage recovery goes to the host;
             *  a goodwill credit does not come out of their pocket. */
            hostPortion: { type: 'number', default: 0 },
            description: { type: 'string' },
            /** Evidence. A damage charge without a photo does not survive a chargeback. */
            files: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
            /** Which line of the booking it belongs to, when it is item-specific. */
            line: { type: 'number' },
            addedAt: { type: 'string', readOnly: true },
            addedBy: { type: 'string', readOnly: true },
            /** Reversal marker — the original line stays, this points at the one that undid it. */
            reversedBy: { type: 'string', readOnly: true },
            reversalOf: { type: 'string', readOnly: true },
            settled: { type: 'boolean', default: false },
          },
        },
      },

      /**
       * What actually happened, in order.
       *
       * Status is a single word and it forgets. The timeline is the record an operator
       * reads when a guest says "I dropped it off on Tuesday" — booked, authorised,
       * dropped off, accessed, window expired, extended, retrieved, settled, paid out,
       * each with who did it. Derived views can be rebuilt; this cannot.
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
                'booked', 'authorized', 'dropoff', 'access', 'extended', 'unit_changed',
                'window_expired', 'retrieve', 'adjustment', 'claim_opened', 'claim_resolved',
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
       * Damage, loss and disputes — the resolution trail.
       *
       * Kept apart from adjustments on purpose: a claim is an ARGUMENT, an adjustment is
       * MONEY. Most claims resolve to an adjustment, some are withdrawn, and a few are
       * refused; collapsing them would lose every case that never moved money, which is
       * exactly the history you need when the same guest claims again.
       */
      claims: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true },
            type: { type: 'string', enum: ['damage', 'loss', 'dispute', 'complaint', 'overcharge'] },
            openedBy: { type: 'string' },
            openedByRole: { type: 'string', enum: ['guest', 'host', 'operator'] },
            openedAt: { type: 'string', readOnly: true },
            line: { type: 'number' },
            description: { type: 'string', 'x-control-variant': 'textarea' },
            claimedAmount: { type: 'number' },
            files: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
            status: {
              type: 'string',
              enum: ['open', 'investigating', 'awaiting_evidence', 'resolved', 'refused', 'withdrawn'],
              default: 'open',
            },
            outcome: { type: 'string', 'x-control-variant': 'textarea' },
            /** The adjustment this claim produced, if it moved money. */
            adjustmentId: { type: 'string' },
            resolvedAt: { type: 'string' },
            resolvedBy: { type: 'string' },
          },
        },
      },

      /** Sum of adjustments, cached so a list does not have to fold the array. */
      adjustmentTotal: { type: 'number', group: 'money' },
      /** What the guest still owes (or is owed, when negative) after everything. */
      balanceDue: { type: 'number', group: 'money' },
      platformFee: { type: 'number', group: 'money' },
      hostEarning: { type: 'number', group: 'money' },

      status: {
        type: 'string',
        enum: ['requested', 'confirmed', 'in_custody', 'overdue', 'retrieved', 'settled', 'disputed', 'abandoned', 'cancelled', 'no_show'],
        default: 'requested',
      },
    },
  } as const;
};

const ps = StowboBookingSchema();
export type StowboBookingModel = FromSchema<typeof ps>;

registerCollection('Stowbo Booking', DataType.stowbo_booking, StowboBookingSchema());
