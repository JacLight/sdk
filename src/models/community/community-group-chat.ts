import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityGroupChatSchema = () => {
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
      title: { type: 'string', title: 'Group Name' },
      type: {
        type: 'string',
        enum: ['group', 'page_chat', 'session_chat', 'topic'],
        default: 'group',
      },

      // Context
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
      linkedEntity: { type: 'string', title: 'Linked Entity (e.g. session SK)' },
      linkedEntityType: { type: 'string' },

      // Creator
      creator: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'data.email',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Image
      image: FileInfoSchema(),
      description: { type: 'string', 'x-control-variant': 'textarea' },

      // Members
      members: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            customer: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'member'], default: 'member' },
            joinedAt: { type: 'string', format: 'date-time' },
            mutedUntil: { type: 'string', format: 'date-time' },
          },
        },
      },

      // Settings
      isPublic: { type: 'boolean', default: false },
      maxMembers: { type: 'number', default: 100 },
      allowMediaSharing: { type: 'boolean', default: true },
      onlyAdminsCanPost: { type: 'boolean', default: false },

      // Stats
      lastMessageAt: { type: 'string', format: 'date-time', readOnly: true },
      messageCount: { type: 'number', default: 0, readOnly: true },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'archived'],
        default: 'active',
      },
    },
    required: ['title', 'creator'],
  } as const;
};

const cgcs = CommunityGroupChatSchema();
export type CommunityGroupChatModel = FromSchema<typeof cgcs>;

registerCollection('CommunityGroupChat', DataType.community_group_chat, CommunityGroupChatSchema());
