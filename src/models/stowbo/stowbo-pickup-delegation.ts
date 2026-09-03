import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * A delegated pickup — one hand-off of one or more items on a booking to a
 * person who is not the customer: the buyer of the cookies, a colleague, a
 * courier.
 *
 * Its own record because a booking can hold several units and each can go to
 * a different person: one booking, many hand-offs. Each carries its OWN pickup
 * code (the QR the collector shows) and its own pass-link token, so the public
 * pass can be looked up by token and the host's reports can query hand-offs by
 * listing, period and status.
 *
 * Rules: an item is on at most one active hand-off; while it is, the owner's
 * booking `pickupCode` no longer releases it; `validUntil` never passes the
 * booking end. The outcome (who collected, what was verified, refusals) is
 * recorded on the booking ITEM, where custody already lives — this record only
 * says who may collect and how.
 */
export const StowboPickupDelegationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', readOnly: true, group: 'link' },
      booking: { type: 'string', group: 'link' },
      items: { type: 'array', items: { type: 'string' }, group: 'link' },
      customer: { type: 'string', group: 'link' },
      listing: { type: 'string', group: 'link' },

      delegate: {
        type: 'object',
        group: 'who',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          email: { type: 'string', format: 'email' },
        },
      },
      // What the host must check before handing over — set by the owner, like
      // shipping options. `qr_id` = QR plus photo ID.
      verify: { type: 'string', enum: ['qr', 'qr_name', 'qr_id'], default: 'qr_id', group: 'who' },
      validUntil: { type: 'string', format: 'date-time', group: 'who' },
      note: { type: 'string', 'x-control-variant': 'textarea', group: 'who' },
      photo: { type: 'string', group: 'who' },

      code: { type: 'string', readOnly: true, group: 'handoff' },
      token: { type: 'string', readOnly: true, group: 'handoff' },
      sentAt: { type: 'string', format: 'date-time', readOnly: true, group: 'handoff' },
      sentVia: { type: 'string', enum: ['sms', 'email', 'both', 'none'], readOnly: true, group: 'handoff' },

      status: { type: 'string', enum: ['active', 'revoked', 'completed', 'expired'], default: 'active', group: 'status' },
      revokedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'status' },
      completedAt: { type: 'string', format: 'date-time', readOnly: true, group: 'status' },
      collectedBy: { type: 'string', readOnly: true, group: 'status' },
    },
  } as const;
};

const ps = StowboPickupDelegationSchema();
export type StowboPickupDelegationModel = FromSchema<typeof ps>;

registerCollection('Stowbo Pickup Delegation', DataType.stowbo_pickup_delegation, StowboPickupDelegationSchema());
