import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityCommentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::12', 'uri'],
      },

      // Target — what is being commented on
      post: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.community_post,
          value: 'sk',
          label: 'name',
        },
      },

      // Author
      author: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'data.email',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      authorInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          image: FileInfoSchema(),
        },
      },

      // Content
      content: {
        type: 'string',
        maxLength: 2000,
      },

      // Threading
      parentComment: {
        type: 'string',
        title: 'Parent Comment',
        description: 'SK of parent comment for replies. Null = top-level comment.',
      },

      // Social
      mentions: {
        type: 'array',
        items: { type: 'string' },
      },
      media: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },

      // Edit tracking
      edited: { type: 'boolean', default: false, readOnly: true },
      editedAt: { type: 'string', format: 'date-time', readOnly: true },

      // Stats (computed)
      stats: {
        type: 'object',
        readOnly: true,
        properties: {
          reactions: { type: 'number', default: 0 },
          replies: { type: 'number', default: 0 },
        },
      },

      // Moderation
      status: {
        type: 'string',
        enum: ['active', 'flagged', 'removed'],
        default: 'active',
      },
    },
    required: ['post', 'author', 'content'],
  } as const;
};

const ccs = CommunityCommentSchema();
export type CommunityCommentModel = FromSchema<typeof ccs>;

registerCollection('CommunityComment', DataType.community_comment, CommunityCommentSchema());
