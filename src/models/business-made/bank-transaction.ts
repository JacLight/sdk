import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * A transaction from a connected bank's feed, stored so the books can be
 * reconciled, reported and acted on without waiting for a live aggregator call.
 * Idempotency key is `providerTransactionId` (Plaid transaction_id).
 *
 * Money is in the account's currency units (dollars), matching the rest of
 * Business Made's ledger — not cents.
 */
export const BankTransactionSchema = () => {
  return {
    type: 'object',
    properties: {
      // Links
      connectionId: {
        type: 'string',
        description: 'The bank_connection this came from.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.bank_connection, value: 'sk', label: ['institution.name'] },
        group: 'links',
      },
      bankAccountId: {
        type: 'string',
        description: 'The bank_account this transaction belongs to.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.bank_account, value: 'sk', label: ['name', 'accountName'] },
        group: 'links',
      },
      providerTransactionId: {
        type: 'string',
        description: "Aggregator transaction id (Plaid transaction_id). Idempotency key.",
        group: 'links',
      },
      providerAccountId: { type: 'string', description: 'Aggregator account id.', group: 'links' },

      // What it is
      name: { type: 'string', group: 'detail' },
      merchantName: { type: 'string', group: 'detail' },
      amount: {
        type: 'number',
        description: 'Signed amount in the account currency. Positive = money OUT of the account (Plaid convention).',
        group: 'detail',
      },
      direction: {
        type: 'string',
        enum: ['inflow', 'outflow'],
        description: 'Derived from amount for display and posting.',
        group: 'detail',
      },
      isoCurrencyCode: { type: 'string', default: 'USD', group: 'detail' },
      date: { type: 'string', format: 'date', description: 'Posted date.', group: 'detail' },
      authorizedDate: { type: 'string', format: 'date', group: 'detail' },
      pending: { type: 'boolean', default: false, group: 'detail' },
      category: { type: 'array', items: { type: 'string' }, group: 'detail' },
      paymentChannel: { type: 'string', description: 'online / in store / other.', group: 'detail' },

      // Reconciliation
      matchStatus: {
        type: 'string',
        enum: ['unmatched', 'matched', 'confirmed', 'ignored'],
        default: 'unmatched',
        description: 'unmatched = to review · matched = suggested · confirmed = reconciled · ignored.',
        group: 'reconciliation',
      },
      matchedEntryId: {
        type: 'string',
        description: 'The journal_entry this transaction is reconciled against.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.journal_entry, value: 'sk', label: ['description'] },
        group: 'reconciliation',
      },
      matchConfidence: { type: 'number', description: '0..1 auto-match score.', group: 'reconciliation' },
      reconciledAt: { type: 'string', format: 'date-time', group: 'reconciliation' },
    },
    required: ['providerTransactionId', 'amount', 'date'],
  } as const;
};

const sc = BankTransactionSchema();
export type BankTransactionModel = FromSchema<typeof sc>;

registerCollection('Bank Transaction', DataType.bank_transaction, BankTransactionSchema());
