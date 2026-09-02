import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * A fee — a row of money on a booking that is neither the space nor an add-on:
 * a booking fee, a cleaning fee, trust & support, a tax, a card-processing
 * charge, a cancellation fee.
 *
 * Its own record, exactly like an add-on: defined ONCE, then attached to any
 * listing by NAME (listing.data.fees holds names). Change it here and every
 * listing carrying it follows. Platform fees (`type: 'platform'`, `'tax'`,
 * `'processing'`) apply org-wide without being attached.
 *
 * Who        type      platform | host | tax | processing  — whose money it is
 *            paidBy    guest → a row on the bill; host → deducted from the payout
 * When       trigger   booking | cancellation | late_pickup | no_show
 * How        appliesTo checkout (once per order) | item (× quantity)
 *            basis     fixed (amount is money) | percent (amount is % of goods)
 * Limits     priceFrom / priceTo   order-subtotal band it applies within
 *            minFee / maxFee       floor / cap on the computed fee
 * Scope      channels, spaceTypes  optional filters (empty = all)
 * Validity   validFrom / validTo   date window (empty = always)
 */
export const StowboFeeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 2,
        maxLength: 100,
        transform: 'uri',
        group: 'name',
      },
      title: { type: 'string', group: 'name' },
      description: { type: 'string' },
      // accounting / ledger reference (optional)
      code: { type: 'string', group: 'name' },

      type: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['host', 'platform', 'tax', 'processing'] },
        default: 'host',
        group: 'who',
      },
      paidBy: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['guest', 'host'] },
        default: 'guest',
        group: 'who',
      },

      trigger: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['booking', 'cancellation', 'late_pickup', 'no_show'] },
        default: 'booking',
        group: 'when',
      },

      appliesTo: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['checkout', 'item'] },
        default: 'checkout',
        group: 'charge',
      },
      basis: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'json', json: ['fixed', 'percent'] },
        default: 'fixed',
        group: 'charge',
      },
      amount: { type: 'number', default: 0, group: 'charge' },

      priceFrom: { type: 'number', title: 'Applies when subtotal ≥', group: 'limits' },
      priceTo: { type: 'number', title: 'Applies when subtotal ≤', group: 'limits' },
      minFee: { type: 'number', title: 'Fee at least', group: 'limits' },
      maxFee: { type: 'number', title: 'Fee at most', group: 'limits' },

      channels: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: { type: 'string' },
        dataSource: { source: 'json', json: ['web', 'app', 'walkin', 'reservation'] },
        group: 'scope',
      },
      spaceTypes: {
        type: 'array',
        items: { type: 'string' },
        group: 'scope',
      },

      validFrom: { type: 'string', format: 'date-time', group: 'validity' },
      validTo: { type: 'string', format: 'date-time', group: 'validity' },

      taxable: { type: 'boolean', default: true, group: 'rules' },
      refundable: { type: 'boolean', default: false, group: 'rules' },

      sortOrder: { type: 'number', default: 100 },
      status: { type: 'string', enum: ['active', 'inactive'], default: 'active' },
    },
  } as const;
};

const ps = StowboFeeSchema();
export type StowboFeeModel = FromSchema<typeof ps>;

registerCollection('Stowbo Fee', DataType.stowbo_fee, StowboFeeSchema());
