import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFPaymentLinkSchema = () => {
  return {
    type: 'object',
    properties: {
      // Link Identification
      code: {
        type: 'string',
        pattern: '^[a-zA-Z0-9]*$',
        minLength: 8,
        maxLength: 12,
        unique: true,
        transform: ['random-string::8'],
        description: 'Shareable payment link code',
        group: 'identification',
      },

      // Link Type
      linkType: {
        type: 'string',
        enum: ['standalone', 'invoice', 'order', 'product', 'donation', 'subscription', 'custom'],
        default: 'standalone',
        group: 'type',
      },

      // Linked Resources
      linkedInvoice: {
        type: 'string',
        description: 'Reference to sf_invoice',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_invoice,
          value: 'sk',
          label: ['number', 'billTo'],
        },
        group: 'linked',
      },
      linkedOrder: {
        type: 'string',
        description: 'Reference to sf_order',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_order,
          value: 'sk',
          label: ['number', 'customer'],
        },
        group: 'linked',
      },
      linkedProduct: {
        type: 'string',
        description: 'Reference to sf_product',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          value: 'sk',
          label: ['name', 'sku'],
        },
        group: 'linked',
      },
      linkedSubscriptionPlan: {
        type: 'string',
        description: 'Reference to sf_subscription_plan',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_subscription_plan,
          value: 'sk',
          label: ['name'],
        },
        group: 'linked',
      },

      // Amount Configuration
      amountType: {
        type: 'string',
        enum: ['fixed', 'variable', 'customer_entered'],
        default: 'fixed',
        group: 'amount',
      },
      amount: {
        type: 'number',
        minimum: 0,
        description: 'Amount in cents (for fixed amount)',
        group: 'amount',
      },
      minAmount: {
        type: 'number',
        minimum: 0,
        description: 'Minimum amount in cents (for customer_entered)',
        group: 'amount',
      },
      maxAmount: {
        type: 'number',
        minimum: 0,
        description: 'Maximum amount in cents (for customer_entered)',
        group: 'amount',
      },
      suggestedAmounts: {
        type: 'array',
        items: { type: 'number' },
        description: 'Suggested amounts in cents (for donations)',
        group: 'amount',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },

      // Quantity
      allowQuantity: {
        type: 'boolean',
        default: false,
        group: 'quantity',
      },
      minQuantity: {
        type: 'number',
        default: 1,
        minimum: 1,
        group: 'quantity',
      },
      maxQuantity: {
        type: 'number',
        group: 'quantity',
      },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'paused', 'expired', 'archived'],
        default: 'active',
        group: 'status',
      },

      // Expiration & Limits
      expiresAt: {
        type: 'string',
        format: 'date-time',
        group: 'limits',
      },
      maxUses: {
        type: 'number',
        description: 'Maximum number of successful payments',
        group: 'limits',
      },
      usageCount: {
        type: 'number',
        default: 0,
        description: 'Number of successful payments',
        readOnly: true,
        group: 'limits',
      },

      // Display Information
      title: {
        type: 'string',
        description: 'Display title on checkout page',
        group: 'display',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        description: 'Display description on checkout page',
        group: 'display',
      },
      imageUrl: {
        type: 'string',
        format: 'uri',
        description: 'Product/service image',
        group: 'display',
      },

      // Branding
      branding: {
        type: 'object',
        title: 'Branding',
        collapsible: true,
        properties: {
          logoUrl: { type: 'string', format: 'uri', group: 'logo' },
          faviconUrl: { type: 'string', format: 'uri', group: 'logo' },
          primaryColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', group: 'colors' },
          accentColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', group: 'colors' },
          backgroundColor: { type: 'string', pattern: '^#[0-9A-Fa-f]{6}$', group: 'colors' },
          buttonStyle: { type: 'string', enum: ['rounded', 'square', 'pill'], default: 'rounded' },
          fontFamily: { type: 'string' },
        },
      },

      // Customer Data Collection
      collectEmail: {
        type: 'boolean',
        default: true,
        group: 'collection',
      },
      collectPhone: {
        type: 'boolean',
        default: false,
        group: 'collection',
      },
      collectName: {
        type: 'boolean',
        default: true,
        group: 'collection',
      },
      collectAddress: {
        type: 'boolean',
        default: false,
        group: 'collection',
      },
      collectShippingAddress: {
        type: 'boolean',
        default: false,
        group: 'collection',
      },
      customFields: {
        type: 'array',
        title: 'Custom Fields',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', group: 'field' },
            label: { type: 'string', group: 'field' },
            type: { type: 'string', enum: ['text', 'textarea', 'select', 'checkbox', 'date'], group: 'field' },
            required: { type: 'boolean', default: false },
            options: { type: 'array', items: { type: 'string' }, description: 'Options for select type' },
          },
        },
      },

      // Payment Methods
      paymentMethods: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: [
            { value: 'card', label: 'Card' },
            { value: 'bank_transfer', label: 'Bank Transfer' },
            { value: 'paypal', label: 'PayPal' },
            { value: 'apple_pay', label: 'Apple Pay' },
            { value: 'google_pay', label: 'Google Pay' },
          ],
        },
        items: { type: 'string' },
        group: 'payments',
      },

      // Redirects
      successUrl: {
        type: 'string',
        format: 'uri',
        description: 'Redirect after successful payment',
        group: 'redirects',
      },
      cancelUrl: {
        type: 'string',
        format: 'uri',
        description: 'Redirect if customer cancels',
        group: 'redirects',
      },

      // Terms & Policies
      termsUrl: {
        type: 'string',
        format: 'uri',
        group: 'legal',
      },
      privacyUrl: {
        type: 'string',
        format: 'uri',
        group: 'legal',
      },
      refundPolicy: {
        type: 'string',
        'x-control-variant': 'textarea',
        group: 'legal',
      },

      // Notifications
      notifications: {
        type: 'object',
        title: 'Notifications',
        collapsible: true,
        properties: {
          sendReceipt: { type: 'boolean', default: true, group: 'email' },
          receiptTemplate: { type: 'string', group: 'email' },
          notifyOnPayment: { type: 'boolean', default: true, group: 'notify' },
          notificationEmails: { type: 'array', items: { type: 'string', format: 'email' }, group: 'notify' },
        },
      },

      // Analytics
      analytics: {
        type: 'object',
        title: 'Analytics',
        collapsible: true,
        readOnly: true,
        properties: {
          views: { type: 'number', default: 0, group: 'views' },
          uniqueViews: { type: 'number', default: 0, group: 'views' },
          sessionsStarted: { type: 'number', default: 0, group: 'sessions' },
          sessionsCompleted: { type: 'number', default: 0, group: 'sessions' },
          conversionRate: { type: 'number', default: 0, group: 'conversion' },
          totalRevenue: { type: 'number', default: 0, description: 'Total revenue in cents', group: 'revenue' },
          averageOrderValue: { type: 'number', default: 0, group: 'revenue' },
        },
      },

      // Metadata
      metadata: {
        type: 'object',
        additionalProperties: true,
        description: 'Custom metadata',
      },

      // Internal
      createdBy: {
        type: 'string',
        group: 'audit',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        group: 'audit',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'audit',
      },
    },
    required: ['code', 'linkType', 'amountType'],
  } as const;
};

const sc = SFPaymentLinkSchema();
export type SFPaymentLinkModel = FromSchema<typeof sc>;

registerCollection('Payment Link', DataType.sf_payment_link, SFPaymentLinkSchema());
