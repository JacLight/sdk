import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityStorySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::10', 'uri'],
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

      // Scope
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

      // Content
      media: FileInfoSchema(),
      caption: { type: 'string', maxLength: 500 },
      backgroundColor: { type: 'string', 'x-control': ControlType.color },
      textContent: { type: 'string', maxLength: 500, title: 'Text (for text-only stories)' },
      stickers: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['text', 'emoji', 'mention', 'hashtag', 'location', 'poll', 'link'] },
            content: { type: 'string' },
            position: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } } },
          },
        },
      },

      // Display
      duration: { type: 'number', default: 5, description: 'Display time in seconds' },

      // Expiry
      expiresAt: { type: 'string', format: 'date-time', title: 'Expires At' },
      highlight: { type: 'boolean', default: false, title: 'Save as highlight (does not expire)' },
      highlightGroup: { type: 'string', title: 'Highlight category name' },

      // Engagement
      viewCount: { type: 'number', default: 0, readOnly: true },
      viewers: { type: 'array', items: { type: 'string' }, hidden: true },
      reactionSummary: { type: 'object', readOnly: true },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'expired', 'removed'],
        default: 'active',
      },
    },
    required: ['author'],
  } as const;
};

const css = CommunityStorySchema();
export type CommunityStoryModel = FromSchema<typeof css>;

registerCollection('CommunityStory', DataType.community_story, CommunityStorySchema());
