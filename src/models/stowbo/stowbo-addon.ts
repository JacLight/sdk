import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

/**
 * An extra the owner sells — wifi, camera view, charging, a padlock,
 * insurance, a trolley.
 *
 * Defined ONCE for the whole account, then attached to any listing. Change
 * the price here and every listing offering it follows.
 *
 * `price: 0` is free. `chargeEvery` is how the owner bills it — a plain
 * string with suggestions, not a closed list.
 */
export const StowboAddOnSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        transform: 'uri',
        group: 'name',
      },
      title: { type: 'string', group: 'name' },
      description: { type: 'string' },
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
      // 0 = free
      price: { type: 'number', default: 0, group: 'charge' },
      chargeEvery: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: {
          source: 'json',
          json: ['once', 'hour', 'day', 'week', 'month', 'item', 'person'],
        },
        default: 'once',
        group: 'charge',
      },
      // the guest cannot decline it (resort-fee style)
      required: { type: 'boolean', default: false },
      // TRUE when the owner physically does something to fulfil it (priority
      // retrieval, fitting a padlock, a wash-down) rather than it being passive
      // cover (insurance, a camera). Buying a service add-on raises a fulfilment
      // request on the booking so it lands in the owner's queue.
      service: { type: 'boolean', default: false, group: 'charge' },
      status: { type: 'string', enum: ['active', 'inactive'], default: 'active' },
    },
  } as const;
};

const ps = StowboAddOnSchema();
export type StowboAddOnModel = FromSchema<typeof ps>;

registerCollection('Stowbo Add-on', DataType.stowbo_addon, StowboAddOnSchema());
