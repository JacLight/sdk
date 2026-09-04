import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * A single linked bank — one aggregator "item" (e.g. a Plaid Item). The single
 * source of truth for a connected bank: its credentials, live status, the sync
 * cursor, and an optional per-connection override of the org's bank sync policy.
 *
 * Multi-tenant: every business that signs up has its own org, so a connection
 * (and its access token) lives only in that org's data. The platform holds one
 * aggregator app; each business links its own bank.
 */
export const BankConnectionSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identity
      provider: {
        type: 'string',
        enum: ['plaid', 'manual'],
        default: 'plaid',
        description: 'Aggregator the connection was made through.',
        group: 'identity',
      },
      itemId: {
        type: 'string',
        description: "The aggregator's item id (Plaid item_id).",
        group: 'identity',
      },
      accessToken: {
        type: 'string',
        description: 'Aggregator access token for this item. Sensitive — encrypted at rest; never returned to the client.',
        hidden: true,
        group: 'identity',
      },
      institution: {
        type: 'object',
        title: 'Institution',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          logo: { type: 'string' },
        },
        group: 'identity',
      },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'error', 'disconnected', 'pending'],
        default: 'active',
        group: 'status',
      },
      error: {
        type: 'object',
        title: 'Connection error',
        description: 'Set when the bank needs attention (e.g. re-auth after ITEM_LOGIN_REQUIRED).',
        properties: {
          code: { type: 'string' },
          message: { type: 'string' },
          since: { type: 'string', format: 'date-time' },
        },
        group: 'status',
      },
      verified: {
        type: 'boolean',
        default: false,
        description: 'Auth returned account + routing numbers for at least one account on this item.',
        group: 'status',
      },

      // Sync state (engine-owned)
      cursor: {
        type: 'string',
        description: 'Transactions/sync delta cursor. Advanced by the sync engine; do not edit.',
        hidden: true,
        group: 'sync-state',
      },
      lastSyncedAt: { type: 'string', format: 'date-time', group: 'sync-state' },
      lastBalanceAt: { type: 'string', format: 'date-time', group: 'sync-state' },

      // Per-connection sync override. When a field is unset the org-level bank
      // settings apply; set a field here to override for THIS bank only.
      sync: {
        type: 'object',
        title: 'Sync override',
        description: "Overrides the org's bank sync policy for this connection only. Unset fields inherit the org setting.",
        collapsible: true,
        properties: {
          enabled: { type: 'boolean', description: 'Auto-sync on/off for this bank.' },
          paused: { type: 'boolean', description: 'Temporarily pause syncing without losing the schedule.' },
          transactions: {
            type: 'string',
            enum: ['realtime', '6h', '12h', 'daily', 'manual'],
            description: 'How often transactions sync. "realtime" leans on the webhook; the cron is a safety net.',
          },
          balances: {
            type: 'string',
            enum: ['onSync', 'daily', 'manual'],
            description: 'How often live balances refresh (billed per call, so kept separate).',
          },
          webhook: { type: 'boolean', description: 'Honor the aggregator push for this bank.' },
        },
        group: 'sync',
      },
    },
    required: ['provider'],
  } as const;
};

const sc = BankConnectionSchema();
export type BankConnectionModel = FromSchema<typeof sc>;

registerCollection('Bank Connection', DataType.bank_connection, BankConnectionSchema());
