import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const SFPaymentButtonSchema = () => {
  return {
    type: 'object',
    properties: {
      // Button Identification
      buttonId: {
        type: 'string',
        pattern: '^[a-zA-Z0-9]*$',
        minLength: 8,
        maxLength: 12,
        unique: true,
        transform: ['random-string::8'],
        description: 'Unique button identifier',
        group: 'identification',
      },

      // Button Configuration
      buttonType: {
        type: 'string',
        enum: ['buy_now', 'donate', 'pay', 'subscribe', 'custom'],
        default: 'buy_now',
        group: 'type',
      },
      buttonText: {
        type: 'string',
        default: 'Pay Now',
        group: 'display',
      },
      buttonSize: {
        type: 'string',
        enum: ['small', 'medium', 'large'],
        default: 'medium',
        group: 'display',
      },

      // Linked Payment Link
      paymentLinkId: {
        type: 'string',
        description: 'Payment link this button uses',
        group: 'link',
      },
      paymentLinkCode: {
        type: 'string',
        group: 'link',
      },

      // Amount (can override payment link)
      amount: {
        type: 'number',
        minimum: 0,
        description: 'Fixed amount in cents (overrides payment link if set)',
        group: 'amount',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },

      // Product Info
      productName: {
        type: 'string',
        group: 'product',
      },
      productDescription: {
        type: 'string',
        group: 'product',
      },
      productImageUrl: {
        type: 'string',
        format: 'uri',
        group: 'product',
      },

      // Styling
      style: {
        type: 'object',
        title: 'Button Style',
        collapsible: true,
        properties: {
          backgroundColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', default: '#000000', group: 'colors' },
          textColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', default: '#FFFFFF', group: 'colors' },
          borderRadius: { type: 'number', default: 4, description: 'Border radius in pixels', group: 'shape' },
          borderWidth: { type: 'number', default: 0, group: 'shape' },
          borderColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', group: 'shape' },
          fontFamily: { type: 'string', group: 'font' },
          fontSize: { type: 'number', default: 16, group: 'font' },
          fontWeight: { type: 'string', enum: ['normal', 'bold', '500', '600'], default: 'bold', group: 'font' },
          padding: { type: 'string', default: '12px 24px', group: 'spacing' },
          width: { type: 'string', description: 'e.g., "100%", "200px", "auto"', default: 'auto', group: 'size' },
          height: { type: 'string', default: 'auto', group: 'size' },
          boxShadow: { type: 'string', group: 'effects' },
          hoverBackgroundColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', group: 'hover' },
          hoverTextColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', group: 'hover' },
        },
      },

      // Embed Options
      embedType: {
        type: 'string',
        enum: ['inline', 'popup', 'redirect'],
        default: 'popup',
        description: 'How checkout appears when button clicked',
        group: 'embed',
      },
      popupWidth: {
        type: 'number',
        default: 500,
        group: 'embed',
      },
      popupHeight: {
        type: 'number',
        default: 700,
        group: 'embed',
      },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'paused', 'archived'],
        default: 'active',
        group: 'status',
      },

      // Generated Code
      embedCode: {
        type: 'string',
        readOnly: true,
        description: 'Generated HTML embed code',
        'x-control-variant': 'textarea',
        group: 'code',
      },
      scriptUrl: {
        type: 'string',
        readOnly: true,
        format: 'uri',
        description: 'URL to button script',
        group: 'code',
      },

      // Analytics
      analytics: {
        type: 'object',
        title: 'Analytics',
        collapsible: true,
        readOnly: true,
        properties: {
          impressions: { type: 'number', default: 0, group: 'views' },
          clicks: { type: 'number', default: 0, group: 'clicks' },
          conversions: { type: 'number', default: 0, group: 'conversions' },
          conversionRate: { type: 'number', default: 0, group: 'conversions' },
          totalRevenue: { type: 'number', default: 0, description: 'Total revenue in cents', group: 'revenue' },
        },
      },

      // Allowed Domains
      allowedDomains: {
        type: 'array',
        items: { type: 'string' },
        description: 'Domains where this button can be embedded (empty = all)',
        group: 'security',
      },

      // Metadata
      createdAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
    },
    required: ['buttonId', 'buttonType', 'paymentLinkId'],
  } as const;
};

const sc = SFPaymentButtonSchema();
export type SFPaymentButtonModel = FromSchema<typeof sc>;

registerCollection('Payment Button', DataType.sf_payment_button, SFPaymentButtonSchema());
