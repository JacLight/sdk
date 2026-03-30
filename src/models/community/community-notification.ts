import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityNotificationSchema = () => {
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

      // Recipient
      recipient: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      recipientEmail: { type: 'string', format: 'email' },

      // Type
      type: {
        type: 'string',
        enum: [
          'connection_request', 'connection_accepted',
          'message', 'group_message',
          'reaction', 'comment', 'mention', 'share',
          'follow', 'page_invite', 'page_join_request',
          'announcement',
          'event_reminder', 'session_starting',
          'post_trending', 'badge_earned',
          'meeting_invite', 'meeting_reminder',
          'system',
        ],
      },

      // Who triggered it
      actor: { type: 'string' },
      actorInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          image: FileInfoSchema(),
        },
      },

      // What it references
      target: { type: 'string', title: 'Target ID' },
      targetType: { type: 'string', title: 'Target DataType' },

      // Display
      summary: { type: 'string', title: 'Human-readable summary' },
      data: { type: 'object', description: 'Flexible payload for the notification' },

      // Grouping
      groupKey: {
        type: 'string',
        description: 'Key for grouping: "reaction:post:abc123" -> "5 people liked your post"',
      },

      // State
      read: { type: 'boolean', default: false },
      readAt: { type: 'string', format: 'date-time' },

      // Push delivery
      pushed: { type: 'boolean', default: false },
      pushSentAt: { type: 'string', format: 'date-time' },
      pushChannel: { type: 'string', enum: ['fcm', 'apns', 'web', 'email'] },
    },
    required: ['recipient', 'type', 'summary'],
  } as const;
};

const cns = CommunityNotificationSchema();
export type CommunityNotificationModel = FromSchema<typeof cns>;

registerCollection('CommunityNotification', DataType.community_notification, CommunityNotificationSchema());
