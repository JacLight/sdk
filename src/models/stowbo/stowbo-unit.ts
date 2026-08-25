import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

/**
 * A physical, numbered unit — locker A-142, bay 7, room 3B.
 *
 * Storage-unit model: the customer books a LISTING (the unit type: "small
 * locker", "10x10 climate controlled"), and is assigned a UNIT at drop-off.
 * The owner never authors 1000 listings — they author the type once with a
 * capacity, and units are the physical inventory behind it.
 *
 * Units are optional. A shelf that holds 20 bags has capacity 20 and no unit
 * records. Create units only where the physical slot has an identity the
 * operation needs: a door to open, a number to write on a ticket, a lock to cut.
 */
export const StowboUnitSchema = () => {
  return {
    type: 'object',
    properties: {
      // unique within its listing — "A1" exists in every other bank too
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        uniqueScope: ['listing'],
        transform: 'uri',
        group: 'name',
      },
      // what the customer sees on the door: A-142, Bay 7
      unitNumber: { type: 'string', group: 'name' },

      // the bookable listing this unit belongs to (the unit type)
      listing: {
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

      status: {
        type: 'string',
        enum: ['vacant', 'reserved', 'occupied', 'maintenance', 'overlocked'],
        default: 'vacant',
        group: 'status',
      },
      // set while occupied — which booking is sitting in it
      booking: { type: 'string', group: 'status' },

      // A unit's own spot — the pad you back onto, the bay, the rack. Sites big
      // enough to need a map are exactly the sites where "which one is B-014"
      // is a real question, so the coordinate belongs on the unit, not just the
      // listing it hangs off.
      location: {
        type: 'object',
        properties: {
          lat: { type: 'number', group: 'location-coords' },
          lng: { type: 'number', group: 'location-coords' },
          placeId: { type: 'string', group: 'location-place' },
          placeName: { type: 'string', group: 'location-place' },
        },
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
      accessCode: { type: 'string', group: 'access' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
  } as const;
};

const ps = StowboUnitSchema();
export type StowboUnitModel = FromSchema<typeof ps>;

registerCollection('Stowbo Unit', DataType.stowbo_unit, StowboUnitSchema());
