import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { RateScheduleSchema } from './stowbo-rate';
import { AvailabilitySchema } from './stowbo-availability';
import { AddressSchema } from '../crm/crm-address';
import { FileInfoSchema } from '../file-info';

export const StowboListingSchema = () => {
  return {
    type: 'object',
    properties: {
      // the listing code — generated, and the key that booking lines,
      // units and child listings all point at. `title` is the host's label.
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['random-string::6', 'uri'],
        title: 'ID',
        group: 'name',
      },
      title: { type: 'string', group: 'name' },

      // tree — a listing can sit inside another listing, any depth.
      // the locker bank is a listing; each locker is a listing with parent = the bank.
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.stowbo_listing,
          value: 'name',
          label: 'title',
        },
        group: 'name',
      },

      spaceType: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: [] },
        group: 'space',
      },

      // exclusive = one booking takes the whole thing (island, garage, the bank as a unit)
      // shared    = capacity is split across bookings (20 bags on a shelf, 3 bays)
      exclusive: { type: 'boolean', default: false, group: 'space' },
      capacity: { type: 'number', default: 1, group: 'space' },
      unitLabel: { type: 'string', group: 'space' },

      size: { type: 'string', group: 'space' },
      address: { type: 'object', properties: AddressSchema().properties },

      // Where it actually is on a map. The address is what a guest reads; this is
      // what the console pins. Same shape delivery_job.stop.location uses, so the
      // shared GoogleMap component can consume either without a translation layer.
      location: {
        type: 'object',
        properties: {
          lat: { type: 'number', group: 'location-coords' },
          lng: { type: 'number', group: 'location-coords' },
          placeId: { type: 'string', group: 'location-place' },
          placeName: { type: 'string', group: 'location-place' },
        },
      },

      accessHours: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['24/7', 'daytime', 'by arrangement'] },
        group: 'access',
      },
      staffing: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['manned', 'unmanned'] },
        group: 'access',
      },

      /**
       * How THIS host runs the hand-off — shown to the guest the moment they
       * book (confirmation, booking page, email). The platform does not invent a
       * code; each host says how it works: a gate code they set, which aisle the
       * locker is in, "text me when you're outside", front-desk hours, etc.
       */
      bookingInstructions: {
        type: 'string',
        'x-control-variant': 'textarea',
        group: 'access',
        description: "Auto-shown to the guest after they book — how to find the space, drop off and collect.",
      },

      features: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'json', json: [] },
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
      description: { type: 'string', 'x-control-variant': 'textarea' },

      /**
       * What a stay costs. One structure covering free, fixed, hourly, daily,
       * free periods and graduated bands — see RateScheduleSchema.
       */
      rates: { ...RateScheduleSchema(), group: 'price' },

      /**
       * How much of the bill is taken up front, and what is held against damage.
       * Two independent things — a host may want either, both, or neither.
       *
       * `upfront` is a percentage of the quoted total: 100 is pay-in-advance,
       * 0 is pay-on-the-way-out, 50 is half now and the balance at check-out.
       * A binary would have made "part now, rest later" inexpressible, which is
       * one of the commonest arrangements there is.
       *
       * `deposit` is not part of the bill at all. It is held against something
       * going wrong and returned when it does not, so it stands alongside any
       * `upfront` figure rather than replacing it — a valet taking nothing up
       * front and a £200 hold is `upfront: 0, deposit: 200`.
       *
       * A metered stay ignores `upfront` — nobody can be charged a percentage of
       * a total nobody knows yet — but the deposit still applies, which is
       * exactly how valets and open-ended parking work.
       *
       * A deposit marked non-refundable is a fee. It is credited against the
       * bill at check-out and never returned.
       */
      payment: {
        type: 'object',
        group: 'price',
        properties: {
          upfront: {
            type: 'number',
            default: 100,
            minimum: 0,
            maximum: 100,
            title: 'Taken up front (%)',
          },
          deposit: { type: 'number', default: 0, title: 'Deposit held' },
          depositRefundable: { type: 'boolean', default: true, title: 'Deposit refundable' },
        },
      },

      /**
       * Superseded by `rates`. Kept so existing listings keep working: when
       * `rates` has no bands these are read as a single open-ended per_period
       * band, which is exactly what they always meant. Authoring should use
       * `rates`; there is one calculation and this is adapted into it.
       */
      price: { type: 'number', group: 'price', hidden: true },
      priceUnit: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['hour', 'day', 'month'] },
        group: 'price',
        hidden: true,
      },

      // Whoever configures the listing sets its terms — these are not platform
      // constants. Parking tax in particular varies wildly by city, so a single
      // national rate would be wrong everywhere; the rate belongs to the
      // location. Swap this for a tax engine before multi-city launch.
      taxRate: {
        type: 'number',
        default: 0,
        title: 'Tax rate (%)',
        description: 'Applied to this listing`s share of the booking. Set per the location`s jurisdiction.',
        group: 'price',
      },
      taxJurisdiction: {
        type: 'string',
        title: 'Tax jurisdiction',
        description: 'Recorded on every booking for the tax ledger.',
        group: 'price',
      },
      /**
       * Fees the owner adds to every booking of this space.
       *
       * A list, because there is no end to what a host might charge for —
       * protection, cleaning, a key, an oversize vehicle, out-of-hours access,
       * a card. Each becomes a line item on the booking, which is where the
       * customer sees it. The platform adds its own the same way.
       *
       * `per` decides the arithmetic and nothing else:
       *   booking  a flat amount, once
       *   unit     the amount for each unit taken
       *   percent  a percentage of the space lines
       */
      fees: {
        type: 'array',
        title: 'Fees',
        group: 'price',
        'x-control': ControlType.table,
        operations: ['add', 'remove'],
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', title: 'Code' },
            label: { type: 'string', title: 'Shown as' },
            amount: { type: 'number', title: 'Amount' },
            per: {
              type: 'string',
              'x-control': ControlType.selectSingle,
              dataSource: { source: 'json', json: ['booking', 'unit', 'percent'] },
              default: 'booking',
            },
            taxable: { type: 'boolean', default: true },
          },
        },
      },
      cancellationPolicy: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        // flexible = free until start; moderate = free until 24h before;
        // strict   = free until 48h before, then half back.
        dataSource: { source: 'json', json: ['flexible', 'moderate', 'strict'] },
        default: 'moderate',
        group: 'booking',
      },

      bookingStyle: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['instant', 'review'] },
        group: 'booking',
      },
      // owner's call: can one booking take several of the children at once
      allowMultiUnitBooking: { type: 'boolean', default: true, group: 'booking' },

      // picked from the add-on catalog. defined once, reused everywhere.
      addOns: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: { type: 'string' },
        dataSource: {
          source: 'collection',
          collection: DataType.stowbo_addon,
          value: 'name',
          label: 'title',
        },
      },

      /**
       * Days the space cannot be sold — servicing, a repaint, the host's own holiday,
       * a unit taken out after damage.
       *
       * Availability has to honour these or the calendar is a promise the site can't
       * keep: a guest books, turns up, and the roller door is off its runners. Kept as
       * ranges rather than a per-day flag so a three-month closure is one row, and so
       * the reason travels with it — "why was this shut" is asked far more often than
       * anyone expects.
       */
      /**
       * When the host is offering this. Blackouts below are dated exceptions
       * carved out of it.
       */
      availability: { ...AvailabilitySchema(), group: 'space' },

      blackouts: {
        type: 'array',
        'x-control': ControlType.table,
        operations: ['add', 'remove'],
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', readOnly: true },
            from: { type: 'string', 'x-control': ControlType.date },
            to: { type: 'string', 'x-control': ControlType.date },
            reason: {
              type: 'string',
              enum: ['servicing', 'maintenance', 'damage', 'host_unavailable', 'seasonal_close', 'private_use', 'other'],
              default: 'servicing',
            },
            note: { type: 'string' },
            /**
             * Reduce to this many rather than closing.
             *
             * "I can take 5 bags today, not 20" is the same statement as "I am
             * shut today" with a different number in it — a host short-staffed
             * for a concert, a lot with half its bays coned off. Empty means
             * closed, which is the cap at zero.
             */
            capacity: { type: 'number' },
            /** Limit the block to specific units; empty means the whole listing. */
            units: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', readOnly: true },
            createdBy: { type: 'string', readOnly: true },
          },
        },
      },

      status: {
        type: 'string',
        enum: ['draft', 'active', 'paused', 'inactive'],
        default: 'draft',
      },
    },
  } as const;
};

const ps = StowboListingSchema();
export type StowboListingModel = FromSchema<typeof ps>;

registerCollection('Stowbo Listing', DataType.stowbo_listing, StowboListingSchema());
