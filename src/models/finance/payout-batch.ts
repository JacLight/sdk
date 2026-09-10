import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * One ACH run: the set of bank payouts that went to the bank together, and the
 * exact file that was handed over.
 *
 * A batch used to be derived by grouping payouts that shared a `batchId`, with
 * the file regenerated on demand from a deterministic writer. That only holds
 * while the inputs cannot change, and they can — an org can edit its ACH
 * originator block, and a host can edit or disable the bank method behind a
 * queued payout — so a regeneration months later would not match what the bank
 * received. The bytes are kept here instead, and regeneration becomes a
 * cross-check rather than the only copy.
 *
 * `sent` is the state that matters to an operator: it means these entries are in
 * the file that went to the bank. A payout in a sent batch is still `processing`
 * — money is not paid until the bank settles it.
 */
export const PayoutBatchSchema = () => {
  return {
    type: 'object',
    properties: {
      batchId: {
        type: 'string',
        title: 'Batch',
        readOnly: true,
        description: 'Identifier carried on every payout in this batch',
        group: 'id',
      },
      batchNumber: {
        type: 'string',
        title: 'Batch #',
        readOnly: true,
        description: 'Monotonic per organization — the bank uses it, with the trace numbers, to spot a duplicate file',
        group: 'id',
      },
      method: {
        type: 'string',
        enum: ['bank'],
        default: 'bank',
        description: 'The rail this batch belongs to. Only ACH sends money as a file.',
        group: 'id',
      },

      status: {
        type: 'string',
        enum: ['built', 'sent', 'settled', 'partly_returned', 'cancelled'],
        default: 'built',
        description:
          'built = the file exists but nobody has taken it to the bank; sent = it is with the bank; ' +
          'settled = the bank confirmed it; partly_returned = at least one entry bounced',
        group: 'status',
      },

      entryCount: { type: 'number', default: 0, readOnly: true, group: 'totals' },
      totalAmount: { type: 'number', default: 0, readOnly: true, group: 'totals' },
      currency: { type: 'string', default: 'USD', group: 'totals' },
      returnedCount: { type: 'number', default: 0, readOnly: true, group: 'totals' },
      returnedAmount: { type: 'number', default: 0, readOnly: true, group: 'totals' },

      payoutIds: {
        type: 'array',
        items: { type: 'string' },
        description: 'The payouts in this batch, in trace order',
        group: 'entries',
      },

      // The file as it was handed to the bank. Kept verbatim: it is the record of
      // what was instructed, not a rendering of current data.
      file: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          content: { type: 'string', description: 'The NACHA file, exactly as generated' },
          checksum: { type: 'string', description: 'SHA-256 of the content, so a later copy can be proven identical' },
          lineCount: { type: 'number' },
          createdAt: { type: 'string', format: 'date-time' },
        },
        group: 'file',
      },

      // The bank's side of the conversation.
      sentAt: { type: 'string', format: 'date-time', group: 'bank' },
      sentBy: { type: 'string', description: 'Who took it to the bank', group: 'bank' },
      sentNote: { type: 'string', description: 'How it was delivered — portal upload, SFTP, courier', group: 'bank' },
      settledAt: { type: 'string', format: 'date-time', group: 'bank' },
      settledBy: { type: 'string', group: 'bank' },
      bankReference: { type: 'string', description: 'Whatever the bank called it on their side', group: 'bank' },
      responseFile: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          content: { type: 'string', description: 'Acknowledgement or return file the bank sent back' },
          receivedAt: { type: 'string', format: 'date-time' },
        },
        group: 'bank',
      },

      history: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            timestamp: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
            actor: { type: 'string' },
            notes: { type: 'string' },
          },
        },
        group: 'history',
      },
    },
    required: ['batchId', 'method'],
  } as const;
};

const sc = PayoutBatchSchema();
export type PayoutBatchModel = FromSchema<typeof sc>;

registerCollection('Payout Batch', DataType.payout_batch, PayoutBatchSchema());
