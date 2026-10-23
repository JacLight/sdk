import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * One person's way through a multi-page post — a course they are taking, an
 * application or multi-stage form they are filling in. One record per person
 * per post; the person is the record's BaseModel `owner`.
 * `progress` holds what the person has done, keyed by page id.
 */
export const PostProgressSchema = () =>
  ({
    type: 'object',
    properties: {
      postId: { type: 'string', description: 'sk of the post' },
      status: { type: 'string', enum: ['active', 'completed', 'withdrawn'], default: 'active' },
      enrolledAt: { type: 'string', format: 'date-time' },
      dueAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      accessUntil: { type: 'string', format: 'date-time', description: 'Bought for a time (product contentAccessDays): open until then. Empty: for good.' },
      percent: { type: 'number', description: 'Kept by the server on every save: % of the post done, so learners sort and filter in the database.' },
      waitingReview: { type: 'array', items: { type: 'string' }, description: 'Kept by the server on every save: the items sent in and waiting for a reviewer.' },
      source: {
        type: 'object',
        description: 'Where it came from when it was bought: the order and the product.',
        properties: { orderId: { type: 'string' }, product: { type: 'string' } },
      },
      progress: {
        type: 'object',
        description: 'Keyed by toc node id.',
        additionalProperties: {
          type: 'object',
          properties: {
            done: { type: 'boolean' },
            at: { type: 'string', format: 'date-time' },
            score: { type: 'number' },
            percent: { type: 'number', description: 'Watched % for video content.' },
            answerRef: { type: 'string', description: 'datatype/sk of the record the page saved (form answer, upload).' },
            certificate: {
              type: 'object',
              description: 'A certificate page: the signed_document issued for this person.',
              properties: {
                envelopeId: { type: 'string' },
                number: { type: 'string' },
                status: { type: 'string', enum: ['issued', 'waiting'], description: 'waiting: sent to a signer who signs each one.' },
                issuedAt: { type: 'string', format: 'date-time' },
              },
            },
            review: {
              type: 'object',
              description: 'Set when the item needs approval: the decision is recorded here, no workflow.',
              properties: {
                status: { type: 'string', enum: ['pending', 'approved', 'changes'] },
                by: { type: 'string' },
                at: { type: 'string', format: 'date-time' },
                note: { type: 'string' },
              },
            },
          },
        },
      },
    },
    required: ['postId'],
  }) as const;

const pp = PostProgressSchema();
export type PostProgressModel = FromSchema<typeof pp>;

registerCollection('Post Progress', DataType.post_progress, PostProgressSchema());
