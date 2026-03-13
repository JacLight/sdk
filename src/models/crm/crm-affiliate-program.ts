import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const AffiliateProgramSchema = () => {
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
        description: 'Display title',
        group: 'general',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'draft'],
        default: 'draft',
        group: 'type',
      },
      type: {
        type: 'string',
        enum: ['referral', 'affiliate', 'hybrid'],
        default: 'referral',
        group: 'type',
      },
      commission: {
        type: 'object',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['flat', 'percentage', 'tiered'],
            default: 'percentage',
          },
          flatAmount: {
            type: 'number',
          },
          percentage: {
            type: 'number',
          },
          tiers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                minConversions: { type: 'number' },
                maxConversions: { type: 'number' },
                percentage: { type: 'number' },
              },
            },
          },
          maxCommission: {
            type: 'number',
          },
        },
        group: 'commission',
      },
      referredReward: {
        type: 'object',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['discount_code', 'wallet_credit', 'none'],
            default: 'none',
          },
          discountCode: {
            type: 'string',
          },
          walletAmount: {
            type: 'number',
          },
        },
        group: 'reward',
      },
      attribution: {
        type: 'object',
        collapsible: true,
        properties: {
          windowDays: {
            type: 'number',
            default: 30,
          },
          model: {
            type: 'string',
            enum: ['first_click', 'last_click'],
            default: 'last_click',
          },
          allowSelfReferral: {
            type: 'boolean',
            default: false,
          },
        },
        group: 'attribution',
      },
      payout: {
        type: 'object',
        collapsible: true,
        properties: {
          holdDays: {
            type: 'number',
            default: 7,
          },
          minPayout: {
            type: 'number',
            default: 0,
          },
          autoCredit: {
            type: 'boolean',
            default: true,
          },
        },
        group: 'payout',
      },
      fraud: {
        type: 'object',
        collapsible: true,
        properties: {
          maxReferralsPerDay: {
            type: 'number',
            default: 50,
          },
          requireUniqueEmail: {
            type: 'boolean',
            default: true,
          },
          requirePaidOrder: {
            type: 'boolean',
            default: true,
          },
          minOrderAmount: {
            type: 'number',
            default: 0,
          },
          blockSameIP: {
            type: 'boolean',
            default: false,
          },
        },
        group: 'fraud',
      },
      stats: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        properties: {
          totalAffiliates: {
            type: 'number',
            default: 0,
          },
          totalReferrals: {
            type: 'number',
            default: 0,
          },
          totalConversions: {
            type: 'number',
            default: 0,
          },
          totalCommissionPaid: {
            type: 'number',
            default: 0,
          },
          conversionRate: {
            type: 'number',
            default: 0,
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const schema = AffiliateProgramSchema();
export type AffiliateProgramModel = FromSchema<typeof schema>;

registerCollection('Affiliate Program', DataType.affiliate_program, AffiliateProgramSchema());
