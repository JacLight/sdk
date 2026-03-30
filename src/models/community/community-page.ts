import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityPageSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['random-string::10', 'uri'],
        title: 'Page ID',
      },
      title: {
        type: 'string',
        title: 'Page Name',
      },
      slug: {
        type: 'string',
        pattern: '^[a-z0-9-]+$',
        unique: true,
        title: 'URL Slug',
      },
      type: {
        type: 'string',
        enum: ['event', 'group', 'brand', 'topic', 'venue', 'organization', 'personal', 'other'],
        default: 'group',
      },

      // Content
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
        collapsible: true,
      },
      shortDescription: {
        type: 'string',
        'x-control-variant': 'textarea',
        maxLength: 500,
      },
      coverImage: FileInfoSchema(),
      logo: FileInfoSchema(),
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        collapsible: true,
      },

      // Ownership
      owner: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Settings
      visibility: {
        type: 'string',
        enum: ['public', 'private', 'invite_only'],
        default: 'public',
      },
      joinPolicy: {
        type: 'string',
        enum: ['open', 'approval_required', 'invite_only'],
        default: 'open',
      },
      postingPolicy: {
        type: 'string',
        enum: ['anyone', 'members', 'admins_only'],
        default: 'members',
      },
      moderationLevel: {
        type: 'string',
        enum: ['none', 'flagged_only', 'pre_approve'],
        default: 'none',
      },

      // Linked entity (e.g. event)
      linkedEntity: {
        type: 'string',
        title: 'Linked Entity ID',
        description: 'SK of the linked record (e.g. event)',
      },
      linkedEntityType: {
        type: 'string',
        title: 'Linked Entity Type',
        description: 'DataType of linked entity (e.g. event)',
      },

      // Classification
      category: { type: 'string' },
      tags: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },

      // Links
      website: { type: 'string', format: 'uri' },
      socialLinks: {
        type: 'object',
        collapsible: true,
        properties: {
          twitter: { type: 'string' },
          linkedin: { type: 'string', format: 'uri' },
          instagram: { type: 'string' },
          facebook: { type: 'string', format: 'uri' },
          youtube: { type: 'string', format: 'uri' },
          tiktok: { type: 'string' },
        },
      },

      // Stats (computed)
      stats: {
        type: 'object',
        readOnly: true,
        properties: {
          memberCount: { type: 'number', default: 0 },
          postCount: { type: 'number', default: 0 },
          followerCount: { type: 'number', default: 0 },
        },
      },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'archived', 'suspended'],
        default: 'active',
      },

      // Features toggle
      features: {
        type: 'object',
        collapsible: true,
        properties: {
          feedEnabled: { type: 'boolean', default: true },
          storiesEnabled: { type: 'boolean', default: true },
          chatEnabled: { type: 'boolean', default: false },
          announcementsEnabled: { type: 'boolean', default: true },
          mediaGalleryEnabled: { type: 'boolean', default: true },
        },
      },
    },
    required: ['title'],
  } as const;
};

const cps = CommunityPageSchema();
export type CommunityPageModel = FromSchema<typeof cps>;

registerCollection('CommunityPage', DataType.community_page, CommunityPageSchema());
