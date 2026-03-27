import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';

export const BroadcastDeliverySchema = () => {
  return {
    type: 'object',
    properties: {
      // Link to broadcast
      broadcastId: {
        type: 'string',
        title: 'Broadcast ID',
        dataSource: {
          collection: DataType.email_broadcast,
          valueField: 'sk',
          labelField: 'broadcastName',
        },
        group: 'identity',
      },

      // Channel
      channel: {
        type: 'string',
        enum: ['email', 'sms', 'whatsapp', 'push', 'voice'],
        title: 'Channel',
        default: 'email',
        group: 'identity',
      },

      // Recipient
      recipient: {
        type: 'string',
        title: 'Recipient',
        description: 'Email address, phone number, or device token',
        group: 'recipient',
      },
      recipientName: {
        type: 'string',
        title: 'Recipient Name',
        group: 'recipient',
      },
      recipientId: {
        type: 'string',
        title: 'Recipient Record ID',
        description: 'ID of subscriber, lead, or customer record',
        group: 'recipient',
      },

      // Sender
      accountId: {
        type: 'string',
        title: 'Sender Account ID',
        description: 'Email account used to send',
        group: 'sender',
      },
      from: {
        type: 'string',
        title: 'From',
        description: 'Sender email, phone, or identifier',
        group: 'sender',
      },

      // Content summary (not the full body — that lives on the broadcast)
      subject: {
        type: 'string',
        title: 'Subject',
        group: 'content',
      },

      // Delivery status
      status: {
        type: 'string',
        enum: ['pending', 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed', 'complained', 'unsubscribed', 'rejected'],
        title: 'Status',
        default: 'pending',
        'x-control': ControlType.label,
        group: 'delivery',
      },

      // Provider reference
      messageId: {
        type: 'string',
        title: 'Provider Message ID',
        description: 'Message ID from SendGrid/Mailgun/SES/Twilio',
        group: 'delivery',
      },
      provider: {
        type: 'string',
        title: 'Provider',
        description: 'Which provider sent this (ses, sendgrid, mailgun, resend, twilio)',
        group: 'delivery',
      },

      // Error tracking
      error: {
        type: 'string',
        title: 'Error Message',
        group: 'delivery',
      },
      errorType: {
        type: 'string',
        enum: ['hard_bounce', 'soft_bounce', 'spam', 'invalid_recipient', 'rate_limit', 'provider_error', 'other'],
        title: 'Error Type',
        group: 'delivery',
      },

      // Engagement (updated by webhook events)
      openCount: {
        type: 'number',
        title: 'Opens',
        default: 0,
        group: 'engagement',
      },
      clickCount: {
        type: 'number',
        title: 'Clicks',
        default: 0,
        group: 'engagement',
      },
      firstOpenedAt: {
        type: 'string',
        format: 'date-time',
        title: 'First Opened',
        group: 'engagement',
      },
      lastClickedAt: {
        type: 'string',
        format: 'date-time',
        title: 'Last Clicked',
        group: 'engagement',
      },
      clickedUrls: {
        type: 'array',
        title: 'Clicked URLs',
        items: { type: 'string' },
        group: 'engagement',
      },

      // Timestamps
      sentAt: {
        type: 'string',
        format: 'date-time',
        title: 'Sent At',
        group: 'timestamps',
      },
      deliveredAt: {
        type: 'string',
        format: 'date-time',
        title: 'Delivered At',
        group: 'timestamps',
      },
      bouncedAt: {
        type: 'string',
        format: 'date-time',
        title: 'Bounced At',
        group: 'timestamps',
      },
      failedAt: {
        type: 'string',
        format: 'date-time',
        title: 'Failed At',
        group: 'timestamps',
      },

      // Retention / TTL
      expiresAt: {
        type: 'string',
        format: 'date-time',
        title: 'Expires At',
        description: 'Auto-delete after this date (configurable retention)',
        group: 'retention',
      },
    },
    required: ['broadcastId', 'channel', 'recipient', 'status'],
  } as const;
};

const ms = BroadcastDeliverySchema();
export type BroadcastDeliveryModel = FromSchema<typeof ms>;

registerCollection(
  'broadcastDelivery',
  DataType.broadcast_delivery,
  BroadcastDeliverySchema(),
);
