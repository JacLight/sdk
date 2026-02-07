import { FromSchema } from 'json-schema-to-ts';

/**
 * PayOxygen Payment Configuration
 *
 * Storage: SHARED_ORG (provider org), NOT in customer org
 * DataType: config
 * configType: 'payoxygen'
 * sk: 'payoxygen_{orgId}'
 *
 * Each config represents a merchant's Stripe Connected Account.
 * The orgId field identifies which customer org this config belongs to.
 */
export const PayOxygenConfigSchema = () => {
  return {
    type: 'object',
    properties: {
      configType: { type: 'string', const: 'payoxygen' },
      orgId: { type: 'string', description: 'Customer org ID this config belongs to' },
      stripeAccountId: { type: 'string', description: 'Stripe Connected Account ID (acct_xxx)' },
      status: { type: 'string', enum: ['pending', 'active', 'restricted', 'disabled'] },
      fees: {
        type: 'object',
        properties: {
          platformFeePercent: { type: 'number', description: 'Platform fee percentage (e.g., 2.5)' },
          platformFeeFixed: { type: 'number', description: 'Fixed platform fee in cents' },
          feeType: { type: 'string', enum: ['percent', 'fixed', 'both'] },
        },
      },
      payout: {
        type: 'object',
        properties: {
          schedule: { type: 'string', enum: ['daily', 'weekly', 'monthly', 'manual'] },
          delayDays: { type: 'number' },
          minimumAmount: { type: 'number' },
          currency: { type: 'string' },
        },
      },
      business: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string', enum: ['individual', 'company'] },
          country: { type: 'string' },
          email: { type: 'string' },
        },
      },
      capabilities: {
        type: 'object',
        properties: {
          cardPayments: { type: 'boolean' },
          transfers: { type: 'boolean' },
          payoutsEnabled: { type: 'boolean' },
        },
      },
      onboardedAt: { type: 'string', format: 'date-time' },
    },
    required: ['configType', 'orgId', 'stripeAccountId', 'status'],
  } as const;
};

const configSchema = PayOxygenConfigSchema();
export type PayOxygenConfigModel = FromSchema<typeof configSchema>;

/**
 * Merchant Account - Progressive Onboarding Model (Shopify-style)
 *
 * Flow:
 * 1. Quick signup (30 sec) -> status: 'setup', chargesEnabled: true
 * 2. Start accepting payments immediately (funds go to pending)
 * 3. Add bank account later -> payoutsEnabled: true after verification
 * 4. Full KYC only when needed (high volume, disputes, etc.)
 */
export const MerchantAccountSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identity
      merchantId: {
        type: 'string',
        description: 'Unique merchant ID (merch_xxx)',
        readOnly: true,
      },
      orgId: {
        type: 'string',
        description: 'Organization this merchant belongs to',
      },

      // Basic info (collected at quick signup)
      email: {
        type: 'string',
        format: 'email',
        group: 'email-country',
      },
      country: {
        type: 'string',
        description: 'ISO country code',
        group: 'email-country',
      },
      businessName: {
        type: 'string',
        group: 'business',
      },
      businessType: {
        type: 'string',
        enum: ['individual', 'company'],
        group: 'business',
      },

      // Stripe
      stripeAccountId: {
        type: 'string',
        description: 'Stripe Connected Account ID',
        readOnly: true,
      },

      // Progressive status
      status: {
        type: 'string',
        enum: ['setup', 'limited', 'active', 'restricted', 'disabled'],
        description: 'setup=just signed up, limited=can charge but not payout, active=fully operational',
      },
      chargesEnabled: {
        type: 'boolean',
        description: 'Can accept payments (true from start with Custom accounts)',
        group: 'enabled-flags',
      },
      payoutsEnabled: {
        type: 'boolean',
        description: 'Can receive payouts (requires bank + verification)',
        group: 'enabled-flags',
      },

      // Verification
      verificationLevel: {
        type: 'string',
        enum: ['none', 'basic', 'full'],
        description: 'none=just email, basic=identity verified, full=all requirements met',
      },

      // Requirements from Stripe
      requirements: {
        type: 'object',
        title: 'Verification Requirements',
        collapsible: true,
        properties: {
          currentlyDue: {
            type: 'array',
            items: { type: 'string' },
            description: 'Must complete to continue',
          },
          eventuallyDue: {
            type: 'array',
            items: { type: 'string' },
            description: 'Complete later for higher limits',
          },
          pastDue: {
            type: 'array',
            items: { type: 'string' },
            description: 'Overdue - action required',
          },
          pendingVerification: {
            type: 'array',
            items: { type: 'string' },
            description: 'Being reviewed by Stripe',
          },
          disabledReason: {
            type: 'string',
            description: 'Why account is disabled',
          },
        },
      },

      // Capabilities
      capabilities: {
        type: 'object',
        title: 'Payment Capabilities',
        properties: {
          cardPayments: {
            type: 'string',
            enum: ['inactive', 'pending', 'active'],
          },
          transfers: {
            type: 'string',
            enum: ['inactive', 'pending', 'active'],
          },
          bankTransferPayouts: {
            type: 'string',
            enum: ['inactive', 'pending', 'active'],
          },
        },
      },

      // Bank account (added later in progressive flow)
      bankAccount: {
        type: 'object',
        title: 'Bank Account',
        properties: {
          last4: { type: 'string' },
          bankName: { type: 'string' },
          verified: { type: 'boolean' },
        },
      },

      // Balance
      balance: {
        type: 'object',
        title: 'Account Balance',
        properties: {
          available: { type: 'number', description: 'Available for payout (cents)' },
          pending: { type: 'number', description: 'Pending clearance (cents)' },
          currency: { type: 'string' },
        },
      },

      // Timestamps
      created: { type: 'number', description: 'Unix timestamp' },
      updated: { type: 'number', description: 'Unix timestamp' },
      activatedAt: { type: 'number', description: 'When fully activated' },
    },
    required: ['merchantId', 'orgId', 'email', 'country', 'stripeAccountId', 'status'],
  } as const;
};

const merchantSchema = MerchantAccountSchema();
export type MerchantAccountModel = FromSchema<typeof merchantSchema>;
