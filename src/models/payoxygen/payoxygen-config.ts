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
