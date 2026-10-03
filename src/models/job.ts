import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * One run of long work in the background — an import, an export, indexing a
 * site. The record holds everything about the run: what it is, who asked, what
 * it was given, how far it got (and where to carry on from), what came of it,
 * and who is told when it ends.
 *
 * The job queue runs it in batches: each batch saves `progress` and `cursor`,
 * so a restart carries on where it stopped and a cancel stops after the batch
 * in hand.
 */
export const JobSchema = () => {
  return {
    type: 'object',
    properties: {
      kind: { type: 'string', notes: 'What the job does — import, export, index-site …; the server runs it by this.' },
      title: { type: 'string', notes: 'What the person sees, e.g. "Import 1,000,000 contacts".' },
      requestedBy: { type: 'string', notes: 'Email of whoever started it.' },
      status: {
        type: 'string',
        enum: ['queued', 'running', 'done', 'failed', 'cancelled'],
        default: 'queued',
      },
      cancelRequested: { type: 'boolean', default: false, notes: 'Asked to stop: the batch in hand finishes, no further batch runs.' },
      args: { type: 'object', notes: 'What the job was given — the file, the collection, the site …' },
      cursor: { type: 'object', notes: 'Where the next batch starts. Saved after every batch.' },
      progress: {
        type: 'object',
        properties: {
          total: { type: 'number', notes: 'How many items in all, when known.' },
          processed: { type: 'number', default: 0 },
          created: { type: 'number', default: 0 },
          updated: { type: 'number', default: 0 },
          failed: { type: 'number', default: 0 },
          skipped: { type: 'number', default: 0 },
          batchesDone: { type: 'number', default: 0 },
          eta: { type: 'string', format: 'date-time', notes: 'When it should finish, from the pace so far.' },
        },
      },
      result: { type: 'object', notes: 'What came of it — a download link, pages indexed …' },
      errors: {
        type: 'array',
        notes: 'The first problems, with reasons (up to 100).',
        items: {
          type: 'object',
          properties: {
            item: { type: 'string', notes: 'Which row, page or record.' },
            reason: { type: 'string' },
          },
        },
      },
      error: { type: 'string', notes: 'Why the job as a whole failed.' },
      attempts: { type: 'number', default: 0, notes: 'Tries of the current batch.' },
      notify: {
        type: 'object',
        notes: 'Who is told when it ends, and how. Both by default: an email and a platform notice.',
        properties: {
          email: { type: 'boolean', default: true },
          emails: { type: 'array', items: { type: 'string' }, notes: 'Who gets the email — the requester when empty.' },
          notice: { type: 'boolean', default: true, notes: 'A platform notice in the app.' },
          on: {
            type: 'array',
            items: { type: 'string', enum: ['done', 'failed', 'cancelled'] },
            default: ['done', 'failed', 'cancelled'],
          },
        },
      },
      notified: { type: 'object', notes: 'What was sent at the end, and when.' },
      queuedAt: { type: 'string', format: 'date-time' },
      startedAt: { type: 'string', format: 'date-time' },
      finishedAt: { type: 'string', format: 'date-time' },
    },
    required: ['kind'],
  } as const;
};

const js = JobSchema();
export type JobModel = FromSchema<typeof js>;
registerCollection('Job', DataType.job, JobSchema());
