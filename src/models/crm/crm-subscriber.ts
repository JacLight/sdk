import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SubscriberSchema = () => {
  return {
    type: 'object',
    properties: {
      // Primary contact - link by email OR phone, not customer ID
      email: {
        type: 'string',
        format: 'email',
        description: 'Subscriber email',
        group: 'contact',
      },
      phone: {
        type: 'string',
        description: 'Subscriber phone',
        group: 'contact',
      },
      name: {
        type: 'string',
        description: 'Subscriber name (optional)',
        group: 'contact',
      },
      // What they subscribed to
      promotion: {
        type: 'string',
        description: 'Promotion subscribed to',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.promotion,
          value: 'name',
          label: 'title',
        },
        group: 'subscription',
      },
      channel: {
        type: 'string',
        enum: ['email', 'sms'],
        default: 'email',
        description: 'Communication channel',
        group: 'subscription',
      },
      // Status
      status: {
        type: 'string',
        enum: ['pending', 'active', 'unsubscribed', 'bounced', 'complained'],
        default: 'pending',
        'x-control': ControlType.label,
        group: 'subscription',
      },
      // Timeline
      subscribedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        group: 'timeline',
      },
      confirmedAt: {
        type: 'string',
        format: 'date-time',
        description: 'Double opt-in confirmation time',
        group: 'timeline',
      },
      unsubscribedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      // Incentive tracking
      incentive: {
        type: 'object',
        collapsible: true,
        properties: {
          sent: {
            type: 'boolean',
            default: false,
            description: 'Incentive was sent',
          },
          sentAt: {
            type: 'string',
            format: 'date-time',
          },
          code: {
            type: 'string',
            description: 'Discount code sent',
          },
          claimed: {
            type: 'boolean',
            default: false,
            description: 'Incentive was used',
          },
          claimedAt: {
            type: 'string',
            format: 'date-time',
          },
          orderId: {
            type: 'string',
            description: 'Order where incentive was used',
          },
        },
      },
      // Source tracking
      source: {
        type: 'string',
        description: 'Where they subscribed from',
        group: 'tracking',
      },
      sourceUrl: {
        type: 'string',
        description: 'Page URL where they subscribed',
        group: 'tracking',
      },
      utmSource: {
        type: 'string',
        group: 'tracking',
      },
      utmMedium: {
        type: 'string',
        group: 'tracking',
      },
      utmCampaign: {
        type: 'string',
        group: 'tracking',
      },
      // Compliance
      ipAddress: {
        type: 'string',
        description: 'IP address at subscription',
        group: 'compliance',
      },
      userAgent: {
        type: 'string',
        description: 'Browser user agent',
        hideIn: ['table'],
        group: 'compliance',
      },
      consentText: {
        type: 'string',
        description: 'Consent text shown at signup',
        hideIn: ['table'],
        group: 'compliance',
      },
      // Confirmation token for double opt-in
      confirmationToken: {
        type: 'string',
        hidden: true,
      },
      confirmationExpires: {
        type: 'string',
        format: 'date-time',
        hidden: true,
      },
      // History
      history: {
        type: 'array',
        hideIn: ['form', 'table'],
        items: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['subscribed', 'confirmed', 'unsubscribed', 'bounced', 'complained', 'resubscribed'],
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            reason: {
              type: 'string',
            },
          },
        },
      },
    },
    required: ['promotion'],
  } as const;
};

const schema = SubscriberSchema();
export type SubscriberModel = FromSchema<typeof schema>;

registerCollection('Subscriber', DataType.subscriber, SubscriberSchema());
