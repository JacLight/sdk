import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const PromotionNotificationSchema = () => {
  return {
    type: 'object',
    properties: {
      trigger: {
        type: 'string',
        enum: [
          'subscribed',
          'confirmed',
          'unsubscribed',
          'incentive_sent',
          'reminder',
        ],
        'x-control': ControlType.selectMany,
        description: 'When to send notification',
        group: 'settings',
      },
      deliveryType: {
        type: 'string',
        enum: ['email', 'sms'],
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'settings',
      },
      template: {
        type: 'string',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'name',
          label: 'name',
        },
      },
      subject: {
        type: 'string',
        description: 'Email subject line',
      },
      html: {
        type: 'string',
        hideIn: ['form', 'table'],
        'x-control': ControlType.richtext,
        personalize: true,
      },
      text: {
        type: 'string',
        hideIn: ['form', 'table'],
        'x-control-variant': 'textarea',
        personalize: true,
      },
    },
  } as const;
};

export const PromotionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        unique: true,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        description: 'Unique identifier',
        transform: ['uri'],
        group: 'general',
      },
      title: {
        type: 'string',
        description: 'Display title (e.g., "Subscribe for 10% off")',
        group: 'general',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        group: 'type',
      },
      type: {
        type: 'string',
        enum: ['newsletter', 'offer', 'gated_content', 'waitlist', 'alert'],
        default: 'newsletter',
        description: 'Promotion type',
        group: 'settings',
      },
      channels: {
        type: 'array',
        description: 'Communication channels',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: ['email', 'sms'],
        },
        items: {
          type: 'string',
          enum: ['email', 'sms'],
        },
        group: 'settings',
      },
      requireDoubleOptIn: {
        type: 'boolean',
        default: false,
        description: 'Require email confirmation',
        group: 'settings',
      },
      discountCode: {
        type: 'string',
        description: 'Discount code to send',
      },
      downloadUrl: {
        type: 'string',
        description: 'URL for gated content download',
      },
      notifications: {
        type: 'array',
        collapsible: true,
        items: PromotionNotificationSchema(),
      },
      // Validity period
      startDate: {
        type: 'string',
        format: 'date-time',
        description: 'Promotion start date',
        group: 'validity',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        description: 'Promotion end date',
        group: 'validity',
      },
      // Display
      color: {
        type: 'string',
        'x-control': ControlType.color,
        description: 'Brand color',
        group: 'display',
      },
      icon: {
        type: 'string',
        'x-control': ControlType.icon,
        description: 'Icon',
        group: 'display',
      },
      // Stats
      stats: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        properties: {
          totalSubscribers: {
            type: 'number',
            default: 0,
          },
          activeSubscribers: {
            type: 'number',
            default: 0,
          },
          unsubscribed: {
            type: 'number',
            default: 0,
          },
          incentivesClaimed: {
            type: 'number',
            default: 0,
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const schema = PromotionSchema();
export type PromotionModel = FromSchema<typeof schema>;
export type PromotionNotificationModel = FromSchema<
  ReturnType<typeof PromotionNotificationSchema>
>;

registerCollection('Promotion', DataType.promotion, PromotionSchema());
