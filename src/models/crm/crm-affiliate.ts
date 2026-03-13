import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const AffiliateSchema = () => {
  return {
    type: 'object',
    properties: {
      customerId: {
        type: 'string',
        description: 'Linked customer ID',
        group: 'general',
      },
      email: {
        type: 'string',
        format: 'email',
        group: 'general',
      },
      name: {
        type: 'string',
        group: 'general',
      },
      program: {
        type: 'string',
        dataSource: {
          source: 'collection',
          collection: DataType.affiliate_program,
          value: 'name',
          label: 'title',
        },
        group: 'general',
      },
      code: {
        type: 'string',
        unique: true,
        description: 'Unique referral code',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['pending', 'active', 'suspended'],
        default: 'pending',
        group: 'type',
      },
      type: {
        type: 'string',
        enum: ['customer', 'affiliate', 'influencer', 'partner'],
        default: 'customer',
        group: 'type',
      },
      commissionOverride: {
        type: 'object',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['flat', 'percentage'],
          },
          value: {
            type: 'number',
          },
        },
      },
      referredBy: {
        type: 'string',
        description: 'Code of the affiliate who referred this affiliate',
      },
      stats: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        properties: {
          totalReferrals: {
            type: 'number',
            default: 0,
          },
          totalConversions: {
            type: 'number',
            default: 0,
          },
          totalRevenue: {
            type: 'number',
            default: 0,
          },
          totalCommission: {
            type: 'number',
            default: 0,
          },
          totalPaid: {
            type: 'number',
            default: 0,
          },
          pendingCommission: {
            type: 'number',
            default: 0,
          },
          conversionRate: {
            type: 'number',
            default: 0,
          },
        },
      },
      walletId: {
        type: 'string',
        description: 'Linked wallet ID for payouts',
      },
    },
    required: ['email', 'name', 'code'],
  } as const;
};

const schema = AffiliateSchema();
export type AffiliateModel = FromSchema<typeof schema>;

registerCollection('Affiliate', DataType.affiliate, AffiliateSchema());
