import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

export enum CommentStatus {
  visible = 'visible',
  hidden = 'hidden',
  removed = 'removed',
}

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
      status: { // moderation state (set by CommentsService on create)
        type: 'string',
        enum: ['visible', 'hidden', 'removed'],
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
