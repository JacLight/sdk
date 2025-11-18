import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const EmailBroadcastSchema = () => {
  return {
    type: "object",
    properties: {
      // Identity
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      broadcastName: {
        type: "string",
        minLength: 1,
        maxLength: 200,
        title: 'Broadcast Name',
        description: 'e.g., "Newsletter - December 2024"',
        group: 'identity',
      },
      type: {
        type: "string",
        enum: ["email", "sms", "whatsapp", "multi_channel"],
        title: 'Broadcast Type',
        default: "email",
        group: 'identity',
      },
      channels: {
        type: "array",
        title: "Active Channels",
        description: 'Channels to send through (for multi_channel type)',
        group: 'identity',
        items: {
          type: "string",
          enum: ["email", "sms", "whatsapp"],
        },
      },

      // Sending Configuration
      senderAccountIds: {
        type: "array",
        title: "Sender Accounts",
        description: 'Email accounts to rotate through',
        group: 'config',
        items: {
          type: "string",
          title: 'Account ID',
        },
      },
      rotationStrategy: {
        type: "string",
        enum: ["round_robin", "least_used", "healthiest", "random", "priority_based"],
        title: 'Rotation Strategy',
        default: "healthiest",
        group: 'config',
      },
      sendingRateLimit: {
        type: "number",
        title: 'Sending Rate (emails/minute)',
        description: 'To avoid triggering spam filters',
        minimum: 1,
        maximum: 1000,
        default: 60,
        group: 'config',
      },
      respectQuietHours: {
        type: "boolean",
        title: 'Respect Quiet Hours',
        description: 'Avoid sending during night hours',
        default: true,
        group: 'config',
      },
      quietHoursStart: {
        type: "number",
        title: 'Quiet Hours Start (24h format)',
        minimum: 0,
        maximum: 23,
        default: 22,
        group: 'config',
      },
      quietHoursEnd: {
        type: "number",
        title: 'Quiet Hours End (24h format)',
        minimum: 0,
        maximum: 23,
        default: 8,
        group: 'config',
      },

      // Recipients
      recipientType: {
        type: "string",
        enum: ["leads", "contacts", "customers", "custom_list", "segment"],
        title: 'Recipient Type',
        group: 'recipients',
      },
      recipientList: {
        type: "array",
        title: "Recipient IDs",
        description: 'Lead/Contact IDs to send to',
        group: 'recipients',
        items: {
          type: "string",
        },
      },
      recipientSegment: {
        type: "object",
        title: "Recipient Segment",
        description: 'Filter criteria for dynamic recipients',
        group: 'recipients',
        properties: {
          filters: {
            type: "array",
            items: {
              type: "object",
              properties: {
                field: { type: "string" },
                operator: { type: "string" },
                value: { type: "string" },
              },
            },
          },
        },
      },
      recipientCount: {
        type: "number",
        title: 'Total Recipients',
        default: 0,
        group: 'recipients',
      },
      excludeUnsubscribed: {
        type: "boolean",
        title: 'Exclude Unsubscribed',
        default: true,
        group: 'recipients',
      },
      excludeBounced: {
        type: "boolean",
        title: 'Exclude Previously Bounced',
        default: true,
        group: 'recipients',
      },

      // Email Content
      emailConfig: {
        type: "object",
        title: "Email Configuration",
        group: 'content',
        properties: {
          subject: {
            type: "string",
            title: 'Email Subject',
            maxLength: 200,
          },
          preheader: {
            type: "string",
            title: 'Preheader Text',
            maxLength: 150,
          },
          templateId: {
            type: "string",
            title: 'Email Template',
            description: 'Link to message template',
          },
          htmlBody: {
            type: "string",
            title: 'HTML Body',
            'x-control-variant': 'html-editor',
          },
          plainTextBody: {
            type: "string",
            title: 'Plain Text Body',
            'x-control-variant': 'textarea',
          },
          replyTo: {
            type: "string",
            format: "email",
            title: 'Reply-To Email',
          },
          trackOpens: {
            type: "boolean",
            title: 'Track Opens',
            default: true,
          },
          trackClicks: {
            type: "boolean",
            title: 'Track Clicks',
            default: true,
          },
          attachments: {
            type: "array",
            title: "Attachments",
            items: {
              type: "object",
              properties: {
                filename: { type: "string" },
                url: { type: "string" },
                contentType: { type: "string" },
              },
            },
          },
        },
      },

      // SMS Content
      smsConfig: {
        type: "object",
        title: "SMS Configuration",
        group: 'content',
        properties: {
          message: {
            type: "string",
            title: 'SMS Message',
            maxLength: 160,
            'x-control-variant': 'textarea',
          },
          senderId: {
            type: "string",
            title: 'Sender ID / Phone Number',
          },
          includeOptOutText: {
            type: "boolean",
            title: 'Include Opt-out Text',
            default: true,
          },
        },
      },

      // WhatsApp Content
      whatsappConfig: {
        type: "object",
        title: "WhatsApp Configuration",
        group: 'content',
        properties: {
          message: {
            type: "string",
            title: 'WhatsApp Message',
            maxLength: 4096,
            'x-control-variant': 'textarea',
          },
          templateId: {
            type: "string",
            title: 'WhatsApp Template ID',
            description: 'Pre-approved WhatsApp Business template',
          },
          mediaUrl: {
            type: "string",
            title: 'Media URL',
            description: 'Image, video, or document URL',
          },
          mediaType: {
            type: "string",
            enum: ["image", "video", "document", "audio"],
            title: 'Media Type',
          },
          buttonText: {
            type: "string",
            title: 'Call-to-Action Button Text',
            maxLength: 20,
          },
          buttonUrl: {
            type: "string",
            title: 'Button URL',
          },
        },
      },

      // Personalization
      personalizationFields: {
        type: "array",
        title: "Personalization Fields",
        description: 'Available merge tags: {{firstName}}, {{company}}, etc.',
        group: 'content',
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              title: 'Field Name',
            },
            defaultValue: {
              type: "string",
              title: 'Default Value',
            },
          },
        },
      },

      // Schedule
      status: {
        type: "string",
        enum: ["draft", 'pending', "scheduled", "sending", "paused", "completed", "failed", "cancelled"],
        title: 'Status',
        default: "draft",
        group: 'schedule',
      },
      sendMode: {
        type: "string",
        enum: ["immediate", "scheduled", "triggered"],
        title: 'Send Mode',
        default: "immediate",
        group: 'schedule',
      },
      scheduledAt: {
        type: "string",
        format: "date-time",
        title: 'Scheduled Send Time',
        group: 'schedule',
      },
      timezone: {
        type: "string",
        title: 'Timezone',
        default: 'America/New_York',
        group: 'schedule',
      },
      startedAt: {
        type: "string",
        format: "date-time",
        title: 'Started At',
        group: 'schedule',
      },
      completedAt: {
        type: "string",
        format: "date-time",
        title: 'Completed At',
        group: 'schedule',
      },
      pausedAt: {
        type: "string",
        format: "date-time",
        title: 'Paused At',
        group: 'schedule',
      },

      // Results & Metrics
      metrics: {
        type: "object",
        title: "Broadcast Metrics",
        group: 'metrics',
        properties: {
          // Sending Stats
          total: {
            type: "number",
            title: 'Total Recipients',
            default: 0,
          },
          sent: {
            type: "number",
            title: 'Sent',
            default: 0,
          },
          delivered: {
            type: "number",
            title: 'Delivered',
            default: 0,
          },
          failed: {
            type: "number",
            title: 'Failed',
            default: 0,
          },
          pending: {
            type: "number",
            title: 'Pending',
            default: 0,
          },

          // Bounce Stats
          bounced: {
            type: "number",
            title: 'Bounced',
            default: 0,
          },
          hardBounces: {
            type: "number",
            title: 'Hard Bounces',
            default: 0,
          },
          softBounces: {
            type: "number",
            title: 'Soft Bounces',
            default: 0,
          },

          // Engagement Stats (Email)
          opened: {
            type: "number",
            title: 'Opened',
            default: 0,
          },
          uniqueOpens: {
            type: "number",
            title: 'Unique Opens',
            default: 0,
          },
          clicked: {
            type: "number",
            title: 'Clicked',
            default: 0,
          },
          uniqueClicks: {
            type: "number",
            title: 'Unique Clicks',
            default: 0,
          },

          // Negative Actions
          unsubscribed: {
            type: "number",
            title: 'Unsubscribed',
            default: 0,
          },
          spamComplaints: {
            type: "number",
            title: 'Spam Complaints',
            default: 0,
          },

          // Calculated Rates
          deliveryRate: {
            type: "number",
            title: 'Delivery Rate (%)',
            default: 0,
          },
          openRate: {
            type: "number",
            title: 'Open Rate (%)',
            default: 0,
          },
          clickRate: {
            type: "number",
            title: 'Click Rate (%)',
            default: 0,
          },
          bounceRate: {
            type: "number",
            title: 'Bounce Rate (%)',
            default: 0,
          },
          unsubscribeRate: {
            type: "number",
            title: 'Unsubscribe Rate (%)',
            default: 0,
          },
        },
      },

      // Sending Progress
      sendingProgress: {
        type: "object",
        title: "Sending Progress",
        group: 'progress',
        properties: {
          currentBatch: {
            type: "number",
            title: 'Current Batch',
            default: 0,
          },
          totalBatches: {
            type: "number",
            title: 'Total Batches',
            default: 0,
          },
          percentComplete: {
            type: "number",
            title: 'Percent Complete',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          estimatedTimeRemaining: {
            type: "number",
            title: 'Estimated Time Remaining (seconds)',
          },
          currentAccountId: {
            type: "string",
            title: 'Current Sending Account',
          },
        },
      },

      // Error Tracking
      errors: {
        type: "array",
        title: "Errors",
        group: 'errors',
        items: {
          type: "object",
          properties: {
            recipientId: {
              type: "string",
              title: 'Recipient ID',
            },
            recipientEmail: {
              type: "string",
              title: 'Recipient Email',
            },
            errorType: {
              type: "string",
              enum: ["hard_bounce", "soft_bounce", "spam", "invalid_email", "rate_limit", "smtp_error", "other"],
              title: 'Error Type',
            },
            errorMessage: {
              type: "string",
              title: 'Error Message',
            },
            timestamp: {
              type: "string",
              format: "date-time",
              title: 'Timestamp',
            },
            accountId: {
              type: "string",
              title: 'Account ID',
            },
          },
        },
      },

      // A/B Testing
      abTestConfig: {
        type: "object",
        title: "A/B Test Configuration",
        group: 'testing',
        properties: {
          isEnabled: {
            type: "boolean",
            title: 'Enable A/B Testing',
            default: false,
          },
          variants: {
            type: "array",
            title: "Variants",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                percentage: { type: "number", minimum: 0, maximum: 100 },
                subject: { type: "string" },
                content: { type: "string" },
              },
            },
          },
          winnerCriteria: {
            type: "string",
            enum: ["open_rate", "click_rate", "conversion_rate"],
            title: 'Winner Criteria',
          },
          testDuration: {
            type: "number",
            title: 'Test Duration (hours)',
          },
        },
      },
      description: {
        type: "string",
        'x-control-variant': 'textarea',
        title: 'Description',
        group: 'additional',
      },
    },
    required: ['name', 'broadcastName', 'type', 'status'],
  } as const;
}

const ms = EmailBroadcastSchema();
export type EmailBroadcastModel = FromSchema<typeof ms>;

registerCollection(
  'broadcast',
  DataType.email_broadcast,
  EmailBroadcastSchema(),
);
