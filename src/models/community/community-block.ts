import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityBlockSchema = () => {
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

      // Who is blocking
      blocker: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Who is being blocked
      blocked: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      blockedInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
        },
      },

      // Reason
      reason: {
        type: 'string',
        enum: ['spam', 'harassment', 'inappropriate', 'unwanted_contact', 'other'],
        group: 'reason',
      },
      reasonDetails: {
        type: 'string',
        'x-control-variant': 'textarea',
        group: 'reason',
      },

      // Timestamp
      blockedAt: {
        type: 'string',
        format: 'date-time',
      },

      // Report (optional - if user also reported)
      reported: {
        type: 'boolean',
        default: false,
      },
      reportDetails: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      reportStatus: {
        type: 'string',
        enum: ['pending', 'reviewed', 'action_taken', 'dismissed'],
      },
      reportReviewedAt: {
        type: 'string',
        format: 'date-time',
      },
      reportReviewedBy: {
        type: 'string',
      },

      // Context (where did the blocking happen)
      context: {
        type: 'object',
        properties: {
          event: { type: 'string' },
          eventName: { type: 'string' },
          source: { type: 'string', enum: ['chat', 'connection', 'profile', 'other'] },
        },
      },
    },
    required: ['blocker', 'blocked'],
  } as const;
};

const cbs = CommunityBlockSchema();
export type CommunityBlockModel = FromSchema<typeof cbs>;

registerCollection('CommunityBlock', DataType.community_block, CommunityBlockSchema());
