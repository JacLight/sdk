import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
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

      price: { type: 'number', group: 'price' },
      priceUnit: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['hour', 'day', 'month'] },
        group: 'price',
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
