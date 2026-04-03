import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { DataType } from '../../types';

export const PhoneSchema = () => {
  return {
    type: 'object',
    layout: 'horizontal',
    properties: {
      // Core identification
      phoneNumber: {
        type: 'string',
        description: 'Phone number in E.164 format (e.g., +15551234567)',
      },
      friendlyName: {
        type: 'string',
        description: 'Display name for the phone number',
      },
      countryCode: {
        type: 'string',
        description: 'ISO country code (e.g., US, CA, GB)',
      },
      extension: {
        type: 'string',
      },

      // Classification
      phoneNumberType: {
        type: 'string',
        enum: ['local', 'toll_free', 'short_code', 'mobile', 'landline'],
        description: 'Type of phone number',
        hideIn: ['generator'],
      },
      purpose: {
        type: 'string',
        enum: ['contact', 'business', 'marketing', 'support', 'sales'],
        description: 'Purpose of this phone number',
        hideIn: ['generator'],
      },
      primary: {
        type: 'boolean',
        default: false,
        hideIn: ['generator'],
      },

      // Provider integration
      provider: {
        type: 'string',
        enum: ['twilio', 'vonage', 'bandwidth', 'telnyx', 'plivo'],
        description: 'Telephony provider',
        hideIn: ['generator'],
      },
      providerSid: {
        type: 'string',
        description: 'Provider unique identifier for this number',
        hideIn: ['generator'],
      },
      providerAccountSid: {
        type: 'string',
        description: 'Provider account identifier',
        hideIn: ['generator'],
      },

      // Status tracking
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'pending', 'suspended', 'released', 'failed'],
        default: 'pending',
        hideIn: ['generator'],
      },
      verified: {
        type: 'boolean',
        default: false,
        hideIn: ['generator'],
      },

      // Capabilities
      capabilities: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          voice: { type: 'boolean', default: false },
          sms: { type: 'boolean', default: false },
          mms: { type: 'boolean', default: false },
          fax: { type: 'boolean', default: false },
        },
      },

      // Purchase information
      purchase: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          purchasedAt: { type: 'string', format: 'date-time' },
          purchasedBy: { type: 'string' },
          monthlyPrice: { type: 'number' },
          currency: { type: 'string', default: 'USD' },
          billingCycle: { type: 'string', enum: ['monthly', 'annual'] },
          autoRenew: { type: 'boolean', default: true },
          expiresAt: { type: 'string', format: 'date-time' },
        },
      },
      // Webhook configuration
      webhooks: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          smsUrl: { type: 'string', format: 'uri' },
          voiceUrl: { type: 'string', format: 'uri' },
          statusCallbackUrl: { type: 'string', format: 'uri' },
          fallbackUrl: { type: 'string', format: 'uri' },
        },
      },
      // SMS Registration (A2P 10DLC / Toll-Free Verification)
      smsRegistration: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          status: {
            type: 'string',
            enum: ['unregistered', 'pending', 'registered', 'rejected', 'suspended'],
            default: 'unregistered',
          },
          messagingServiceSid: { type: 'string' },
          brandRegistrationSid: { type: 'string' },
          campaignId: { type: 'string' },
          useCase: {
            type: 'string',
            enum: ['marketing', 'customer_care', 'transactional', 'mixed', 'low_volume'],
          },
          requiresRegistration: { type: 'boolean', default: false },
          complianceStatus: {
            type: 'string',
            enum: ['compliant', 'non_compliant', 'pending_review'],
          },
          throughputLimit: { type: 'number', description: 'Messages per second' },
          dailyLimit: { type: 'number', description: 'Max messages per day' },
          registeredAt: { type: 'string', format: 'date-time' },
          lastCheckedAt: { type: 'string', format: 'date-time' },
          registrationErrors: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      // Voice configuration — routing is handled by ivr_routing records
      voiceConfig: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          voicemailEnabled: { type: 'boolean', default: false },
          voicemailGreeting: { type: 'string' },
          recordCalls: { type: 'boolean', default: false },
          transcribeCalls: { type: 'boolean', default: false },
        },
      },
      // SMS configuration
      smsConfig: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          autoReplyEnabled: { type: 'boolean', default: false },
          autoReplyMessage: { type: 'string' },
          triggerAutomations: { type: 'boolean', default: false },
        },
      },
      // IVR / Routing
      routingId: {
        type: 'string',
        description: 'Associated IVR or SMS routing configuration ID',
        hideIn: ['generator'],
      },
      // Marketing & tracking
      tracking: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          enabled: { type: 'boolean', default: false },
          campaignId: { type: 'string' },
          source: { type: 'string' },
          medium: { type: 'string' },
        },
      },
      // Usage statistics
      stats: {
        type: 'object',
        hideIn: ['generator'],
        properties: {
          totalCalls: { type: 'number', default: 0 },
          totalSms: { type: 'number', default: 0 },
          totalMms: { type: 'number', default: 0 },
          lastCallAt: { type: 'string', format: 'date-time' },
          lastSmsAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  } as const;
};

const dd = PhoneSchema();
export type PhoneModel = FromSchema<typeof dd>;

registerCollection(
  'Phone',
  DataType.phone,
  PhoneSchema(),
);
