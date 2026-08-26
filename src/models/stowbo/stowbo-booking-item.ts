import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

/**
 * One thing booked, with its own life.
 *
 * The booking is an ORDER — it centralises what the customer pays. A booking
 * item is what actually happens at one unit, and the two do not share a
 * timeline.
 *
 * Book twelve units and you have one booking and twelve booking items. Two are
 * checked out on Tuesday, three more on Friday, one is disputed because the
 * door would not open, and the rest run on. A single `checkedInAt` /
 * `checkedOutAt` on the booking could express none of that.
 *
 * Money on the booking, operations here. The host works items; the customer
 * pays a booking.
 */
export const StowboBookingItemSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', readOnly: true },

      /** The order this belongs to. One booking, many items. */
      booking: { type: 'string', group: 'link' },
      /** Denormalised so a host can query items without joining every time. */
      customer: { type: 'string', group: 'link' },
      listing: { type: 'string', group: 'link' },
      /** Which line of the booking's bill paid for this one. */
      line: { type: 'number', group: 'link' },

      /**
       * Where it is. Assigned when the space has numbered units, and
       * re-assignable — where a thing sits changes while it is there.
       */
      unit: { type: 'string', group: 'space' },
      /**
       * What names it when there is no unit to assign — a plate, a tag, a
       * tracking reference. Both may be present: a valet assigns a bay AND
       * records the plate.
       */
      identifier: { type: 'string', group: 'space' },
      label: { type: 'string', group: 'space' },

      /**
       * This item's own window. Items in one booking need not share one — a
       * customer may take another unit a week later, or give one back early.
       */
      startDate: { type: 'string', format: 'date-time', group: 'when' },
      endDate: { type: 'string', format: 'date-time', group: 'when' },

      /**
       * The session, per item. A move-out is not a check-out: things go in and
       * out as often as they like while the space stays held.
       */
      checkedInAt: { type: 'string', format: 'date-time', readOnly: true, group: 'when' },
      checkedOutAt: { type: 'string', format: 'date-time', readOnly: true, group: 'when' },

      status: {
        type: 'string',
        // reserved  paid for, not yet occupied
        // active    the session is open
        // ended     checked out; the space is back on the market
        // disputed  something went wrong here and only here
        enum: ['reserved', 'active', 'ended', 'disputed', 'cancelled'],
        default: 'reserved',
        'x-control': 'label',
        group: 'meta',
      },

      /** Who may collect, when that is not whoever booked it. */
      collector: { type: 'string', group: 'meta' },

      /**
       * In and out, unlimited, append-only. Presence is the direction of the
       * last entry — never a stored flag, because being out at 2pm means at
       * lunch, not finished.
       *
       * Everything past `by` is available and optional; the server stores what
       * it is given and demands nothing.
       */
      movements: {
        type: 'array',
        'x-control': ControlType.table,
        items: {
          type: 'object',
          properties: {
            at: { type: 'string', format: 'date-time' },
            direction: { type: 'string', enum: ['in', 'out'] },
            by: { type: 'string' },
            photos: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
            note: { type: 'string' },
            condition: { type: 'string' },
            signature: { type: 'string' },
            id: { type: 'string' },
            declaredValue: { type: 'number' },
            releasedTo: { type: 'string' },
          },
        },
      },
    },
  } as const;
};

const ps = StowboBookingItemSchema();
export type StowboBookingItemModel = FromSchema<typeof ps>;

registerCollection('Stowbo Booking Item', DataType.stowbo_booking_item, StowboBookingItemSchema());
