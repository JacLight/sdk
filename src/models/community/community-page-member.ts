import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityPageMemberSchema = () => {
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
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      email: {
        type: 'string',
        format: 'email',
        title: 'Member Email',
      },
      role: {
        type: 'string',
        enum: ['owner', 'admin', 'moderator', 'member', 'guest'],
        default: 'member',
      },
      status: {
        type: 'string',
        enum: ['active', 'invited', 'requested', 'banned', 'left'],
        default: 'active',
      },

      // Page-specific profile overrides
      displayName: {
        type: 'string',
        title: 'Display Name',
        description: 'Override display name for this page context',
      },
      bio: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Page-specific bio',
      },

      // Metadata
      joinedAt: { type: 'string', format: 'date-time' },
      invitedBy: { type: 'string' },
      source: {
        type: 'string',
        enum: ['manual', 'invitation', 'request', 'ticket_purchase', 'participant', 'auto'],
        default: 'manual',
      },

      // Preferences
      notificationPreference: {
        type: 'string',
        enum: ['all', 'mentions', 'none'],
        default: 'all',
      },
      pinned: {
        type: 'boolean',
        default: false,
        title: 'Pin this page',
      },
    },
    required: ['page', 'email'],
  } as const;
};

const cpms = CommunityPageMemberSchema();
export type CommunityPageMemberModel = FromSchema<typeof cpms>;

registerCollection('CommunityPageMember', DataType.community_page_member, CommunityPageMemberSchema());
