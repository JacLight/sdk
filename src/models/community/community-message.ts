import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityMessageSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::16', 'uri'],
      },

      // Conversation thread ID
      thread: {
        type: 'string',
      },

      // Sender
      sender: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      senderInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          image: { type: 'string' },
        },
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

      // Message content
      content: {
        type: 'string',
      },
      contentType: {
        type: 'string',
        enum: ['text', 'image', 'file', 'audio', 'link', 'contact'],
        default: 'text',
        group: 'content-type',
      },
      attachments: {
        type: 'array',
        items: FileInfoSchema(),
      },

      // Status
      status: {
        type: 'string',
        enum: ['sent', 'delivered', 'read', 'deleted'],
        default: 'sent',
      },

      // Read receipt
      readAt: {
        type: 'string',
        format: 'date-time',
        group: 'receipts',
      },
      deliveredAt: {
        type: 'string',
        format: 'date-time',
        group: 'receipts',
      },

      // Timestamp
      sentAt: {
        type: 'string',
        format: 'date-time',
      },

      // Reply to
      replyTo: {
        type: 'string',
      },
      replyPreview: {
        type: 'string',
      },

      // Context
      context: {
        type: 'object',
        properties: {
          event: { type: 'string' },
          eventName: { type: 'string' },
        },
      },

      // Moderation
      flagged: {
        type: 'boolean',
        default: false,
      },
      flagReason: {
        type: 'string',
      },
      moderatedAt: {
        type: 'string',
        format: 'date-time',
      },
      moderatedBy: {
        type: 'string',
      },

      // Deletion (soft delete for sender/recipient separately)
      deletedBySender: {
        type: 'boolean',
        default: false,
        group: 'deleted',
      },
      deletedByRecipient: {
        type: 'boolean',
        default: false,
        group: 'deleted',
      },
    },
    required: ['thread', 'sender', 'recipient', 'content'],
  } as const;
};

const cms = CommunityMessageSchema();
export type CommunityMessageModel = FromSchema<typeof cms>;

registerCollection('CommunityMessage', DataType.community_message, CommunityMessageSchema());
