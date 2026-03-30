import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityAnnouncementSchema = () => {
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

      // Page scope
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

      // Author
      author: { type: 'string' },
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
      title: { type: 'string' },
      content: {
        type: 'string',
        'x-control': ControlType.richtext,
      },
      media: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },

      // Priority
      priority: {
        type: 'string',
        enum: ['normal', 'important', 'urgent'],
        default: 'normal',
      },

      // Audience
      targetAudience: {
        type: 'string',
        enum: ['all', 'admins', 'moderators'],
        default: 'all',
        description: 'Which page members see this',
      },
      targetRoles: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific roles (overrides targetAudience if set)',
      },

      // Display
      pinned: { type: 'boolean', default: false },
      publishedAt: { type: 'string', format: 'date-time' },
      expiresAt: { type: 'string', format: 'date-time' },

      // Tracking
      readBy: { type: 'array', items: { type: 'string' }, hidden: true },
      readCount: { type: 'number', default: 0, readOnly: true },

      // Status
      status: {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
      },
    },
    required: ['page', 'title', 'content'],
  } as const;
};

const cas = CommunityAnnouncementSchema();
export type CommunityAnnouncementModel = FromSchema<typeof cas>;

registerCollection('CommunityAnnouncement', DataType.community_announcement, CommunityAnnouncementSchema());
