import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityPostSchema = () => {
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
          company: { type: 'string' },
          jobTitle: { type: 'string' },
        },
      },

      // Scope — which page this post belongs to (null = personal/global)
      page: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.community_page,
          value: 'sk',
          label: 'title',
        },
      },
      pageName: {
        type: 'string',
        readOnly: true,
      },

      // Content
      content: {
        type: 'string',
        'x-control-variant': 'textarea',
        maxLength: 5000,
        title: 'Post Content',
      },
      contentType: {
        type: 'string',
        enum: ['text', 'image', 'video', 'link', 'poll', 'article', 'share'],
        default: 'text',
      },

      // Media
      media: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },

      // Link preview
      link: {
        type: 'object',
        collapsible: true,
        properties: {
          url: { type: 'string', format: 'uri' },
          title: { type: 'string' },
          description: { type: 'string' },
          thumbnail: FileInfoSchema(),
          siteName: { type: 'string' },
        },
      },

      // Poll
      poll: {
        type: 'object',
        collapsible: true,
        properties: {
          question: { type: 'string' },
          options: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                text: { type: 'string' },
                votes: { type: 'number', default: 0 },
                voters: { type: 'array', items: { type: 'string' }, hidden: true },
              },
            },
          },
          totalVotes: { type: 'number', default: 0, readOnly: true },
          expiresAt: { type: 'string', format: 'date-time' },
          allowMultiple: { type: 'boolean', default: false },
        },
      },

      // Social
      hashtags: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },
      mentions: {
        type: 'array',
        description: 'Customer SKs mentioned in the post',
        items: { type: 'string' },
      },

      // Visibility
      visibility: {
        type: 'string',
        enum: ['public', 'page', 'connections', 'private'],
        default: 'public',
      },

      // Share/Repost
      sharedPost: {
        type: 'string',
        title: 'Original Post',
        description: 'SK of the post being shared/reposted',
      },
      shareComment: {
        type: 'string',
        title: 'Quote/Comment when sharing',
      },

      // Context link (optional — e.g. post about a session)
      linkedEntity: { type: 'string' },
      linkedEntityType: { type: 'string' },

      // Flags
      pinned: { type: 'boolean', default: false },
      edited: { type: 'boolean', default: false, readOnly: true },
      editedAt: { type: 'string', format: 'date-time', readOnly: true },

      // Engagement stats (computed)
      stats: {
        type: 'object',
        readOnly: true,
        properties: {
          reactions: { type: 'number', default: 0 },
          comments: { type: 'number', default: 0 },
          shares: { type: 'number', default: 0 },
          views: { type: 'number', default: 0 },
        },
      },

      // Reaction breakdown (computed)
      reactionSummary: {
        type: 'object',
        readOnly: true,
        description: 'Count per reaction type: { like: 5, love: 2, fire: 1 }',
      },

      // Moderation
      status: {
        type: 'string',
        enum: ['active', 'flagged', 'removed', 'draft'],
        default: 'active',
      },
      moderatedAt: { type: 'string', format: 'date-time' },
      moderatedBy: { type: 'string' },
      moderationReason: { type: 'string' },
    },
    required: ['author', 'content'],
  } as const;
};

const cpos = CommunityPostSchema();
export type CommunityPostModel = FromSchema<typeof cpos>;

registerCollection('CommunityPost', DataType.community_post, CommunityPostSchema());
