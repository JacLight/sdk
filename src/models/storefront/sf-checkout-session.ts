import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFCheckoutSessionSchema = () => {
  return {
    type: 'object',
    properties: {
      // Session Identification
      sessionId: {
        type: 'string',
        pattern: '^[a-zA-Z0-9]*$',
        minLength: 16,
        maxLength: 24,
        unique: true,
        transform: ['random-string::16'],
        description: 'Unique checkout session ID',
        group: 'identification',
      },

      // Source
      sourceType: {
        type: 'string',
        enum: ['payment_link', 'invoice', 'order', 'button', 'api', 'embed'],
        default: 'payment_link',
        group: 'source',
      },
      paymentLinkCode: {
        type: 'string',
        description: 'Payment link code if from payment link',
        group: 'source',
      },
      paymentLinkId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_payment_link,
          value: 'sk',
          label: ['code', 'title'],
        },
        group: 'source',
      },
      invoiceId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_invoice,
          value: 'sk',
          label: ['number'],
        },
        group: 'source',
      },
      orderId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_order,
          value: 'sk',
          label: ['number'],
        },
        group: 'source',
      },
      buttonId: {
        type: 'string',
        group: 'source',
      },

      // Amount
      amount: {
        type: 'number',
        minimum: 0,
        description: 'Total amount in cents',
        group: 'amount',
      },
      subtotal: {
        type: 'number',
        minimum: 0,
        description: 'Subtotal before fees/tax in cents',
        group: 'amount',
      },
      tax: {
        type: 'number',
        default: 0,
        description: 'Tax amount in cents',
        group: 'amount',
      },
      discount: {
        type: 'number',
        default: 0,
        description: 'Discount amount in cents',
        group: 'amount',
      },
      fees: {
        type: 'number',
        default: 0,
        description: 'Processing fees in cents',
        group: 'amount',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'amount',
      },

      // Line Items
      lineItems: {
        type: 'array',
        title: 'Line Items',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', group: 'item' },
            description: { type: 'string', group: 'item' },
            quantity: { type: 'number', default: 1, group: 'item' },
            unitPrice: { type: 'number', description: 'Price per unit in cents', group: 'price' },
            amount: { type: 'number', description: 'Total for line in cents', group: 'price' },
            productId: { type: 'string' },
            sku: { type: 'string' },
            imageUrl: { type: 'string', format: 'uri' },
          },
        },
      },

      // Status
      status: {
        type: 'string',
        enum: ['created', 'pending', 'processing', 'completed', 'failed', 'expired', 'abandoned'],
        default: 'created',
        group: 'status',
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
        description: 'Session expiration time (typically 30 min)',
        group: 'status',
      },

      // Customer Information
      customer: {
        type: 'object',
        title: 'Customer',
        collapsible: true,
        properties: {
          email: { type: 'string', format: 'email', group: 'contact' },
          phone: { type: 'string', group: 'contact' },
          firstName: { type: 'string', group: 'name' },
          lastName: { type: 'string', group: 'name' },
          customerId: { type: 'string', description: 'Linked customer record' },
        },
      },
      billingAddress: {
        type: 'object',
        title: 'Billing Address',
        collapsible: true,
        properties: {
          line1: { type: 'string', group: 'address' },
          line2: { type: 'string', group: 'address' },
          city: { type: 'string', group: 'location' },
          state: { type: 'string', group: 'location' },
          postalCode: { type: 'string', group: 'location' },
          country: { type: 'string', default: 'US', group: 'location' },
        },
      },
      shippingAddress: {
        type: 'object',
        title: 'Shipping Address',
        collapsible: true,
        properties: {
          line1: { type: 'string', group: 'address' },
          line2: { type: 'string', group: 'address' },
          city: { type: 'string', group: 'location' },
          state: { type: 'string', group: 'location' },
          postalCode: { type: 'string', group: 'location' },
          country: { type: 'string', default: 'US', group: 'location' },
        },
      },

      // Custom Fields (values from payment link custom fields)
      customFieldValues: {
        type: 'object',
        additionalProperties: true,
        description: 'Values for custom fields',
      },

      // Payment Information
      paymentMethod: {
        type: 'string',
        enum: ['card', 'bank_transfer', 'paypal', 'apple_pay', 'google_pay'],
        group: 'payment',
      },
      paymentMethodDetails: {
        type: 'object',
        title: 'Payment Details',
        collapsible: true,
        properties: {
          cardBrand: { type: 'string', enum: ['visa', 'mastercard', 'amex', 'discover'], group: 'card' },
          cardLast4: { type: 'string', maxLength: 4, group: 'card' },
          cardExpMonth: { type: 'number', group: 'card' },
          cardExpYear: { type: 'number', group: 'card' },
          bankName: { type: 'string', group: 'bank' },
          bankLast4: { type: 'string', maxLength: 4, group: 'bank' },
        },
      },

      // Stripe Integration
      stripePaymentIntentId: {
        type: 'string',
        description: 'Stripe PaymentIntent ID',
        group: 'stripe',
      },
      stripeCustomerId: {
        type: 'string',
        description: 'Stripe Customer ID',
        group: 'stripe',
      },
      stripeCheckoutSessionId: {
        type: 'string',
        description: 'Stripe Checkout Session ID (if using Stripe Checkout)',
        group: 'stripe',
      },

      // Discount Code
      discountCode: {
        type: 'string',
        group: 'discount',
      },
      discountId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_discount,
          value: 'sk',
          label: ['code', 'name'],
        },
        group: 'discount',
      },

      // Result
      transactionId: {
        type: 'string',
        description: 'Created sf_transaction ID on success',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_transaction,
          value: 'sk',
          label: ['transactionNumber'],
        },
        group: 'result',
      },
      receiptUrl: {
        type: 'string',
        format: 'uri',
        description: 'Receipt page URL',
        group: 'result',
      },
      receiptNumber: {
        type: 'string',
        group: 'result',
      },

      // Error Information
      errorCode: {
        type: 'string',
        group: 'error',
      },
      errorMessage: {
        type: 'string',
        group: 'error',
      },

      // Tracking
      ipAddress: {
        type: 'string',
        group: 'tracking',
      },
      userAgent: {
        type: 'string',
        group: 'tracking',
      },
      referrer: {
        type: 'string',
        format: 'uri',
        group: 'tracking',
      },
      utmSource: {
        type: 'string',
        group: 'utm',
      },
      utmMedium: {
        type: 'string',
        group: 'utm',
      },
      utmCampaign: {
        type: 'string',
        group: 'utm',
      },

      // Timeline
      createdAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      completedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      abandonedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },

      // Metadata
      metadata: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['sessionId', 'sourceType', 'amount'],
  } as const;
};

const sc = SFCheckoutSessionSchema();
export type SFCheckoutSessionModel = FromSchema<typeof sc>;

registerCollection('Checkout Session', DataType.sf_checkout_session, SFCheckoutSessionSchema());
