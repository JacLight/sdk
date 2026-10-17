import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * Where a comment stands. Only `approved` shows on a site; editing a comment sets it back to `new`.
 * new → pending (picked up for review) → approved | hidden | rejected, or review (passed to a person) → a final state.
 */
export enum CommentStatus {
  /** Just posted or edited, not picked up for review yet. */
  new = 'new',
  /** Picked up for review (the AI assistant is checking it); no result yet. */
  pending = 'pending',
  /** The AI could not decide and passed it to a person (also: no assistant picked, held by a rule, reported enough times). */
  review = 'review',
  /** Final: shows on the site. */
  approved = 'approved',
  /** Final: kept, not shown. */
  hidden = 'hidden',
  /** Final: never shows; `classification` says why. */
  rejected = 'rejected',
  /** Deleted by its author; kept, never shown. */
  deleted = 'deleted',
}

/** Why someone reported a comment. */
export const COMMENT_REPORT_REASONS = ['spam', 'harassment', 'inappropriate', 'other'] as const;
/** What a comment is judged to be (data.classification): fine, or why it was rejected. Spam is a classification, never a status. */
export const COMMENT_CLASSIFICATIONS = ['clean', 'spam', 'harassment', 'inappropriate', 'other'] as const;

export const CommentSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        hidden: true,
        displayStyle: 'outlined',
      },
      message: {
        type: 'string',
        'x-control-variant': 'textarea',
        displayStyle: 'outlined',
        rows: 3,
      },
      rating: { // rating the commenter gave to the owning object
        type: 'number',
        'x-control-variant': 'rating',
        max: 5,
        min: 1,
      },
      parentComment: { // sk of parent comment when this is a reply
        type: 'string',
        hidden: true,
      },
      mentions: { // @user references extracted from message
        type: 'array',
        items: { type: 'string' },
        hidden: true,
      },
      status: { // new → pending → approved | hidden | rejected, or review (a person); deleted. Only approved shows; an edit sets it back to new.
        type: 'string',
        enum: ['new', 'pending', 'review', 'approved', 'hidden', 'rejected', 'deleted'],
      },
      pinned: {
        type: 'boolean',
      },
      isEdited: {
        type: 'boolean',
        hidden: true,
      },
      editedAt: {
        type: 'string',
        format: 'date-time',
        hidden: true,
      },
      reportCount: { // denormalized count of moderation reports
        type: 'number',
        hidden: true,
      },
      verifiedPurchase: { // set by CommentsService: a rated review on a product the commenter bought
        type: 'boolean',
        readOnly: true,
        description: 'The reviewer has a paid order containing this product',
      },
    },
  } as const;
};

const cos = CommentSchema();
export type CommentModel = FromSchema<typeof cos>;

registerCollection(
  'Comment',
  DataType.comment,
  CommentSchema(),
);
