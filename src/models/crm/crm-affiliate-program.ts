import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

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
      displayName: {
        type: 'string',
        description: 'Public-facing program name (e.g., "Acme Partner Program")',
        group: 'general',
      },
      title: {
        type: 'string',
        description: 'Display title',
        group: 'general',
      },
      tagline: {
        type: 'string',
        description: 'Short tagline for program page (e.g., "Earn up to 35% commission")',
        group: 'general',
      },
      description: {
        type: 'string',
        'x-control-variant': 'richtext',
        description: 'Full program description — shown on signup page',
      },
      logo: FileInfoSchema(),
      coverImage: FileInfoSchema(),
      // Benefits — what affiliates get
      benefits: {
        type: 'array',
        description: 'Program benefits displayed on signup page',
        group: 'benefits',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Benefit title (e.g., "25% Commission")' },
            description: { type: 'string', description: 'Benefit details' },
            icon: { type: 'string', description: 'Icon name' },
          },
        },
      },

      // Performance bonuses
      bonuses: {
        type: 'array',
        description: 'Milestone bonuses (e.g., $300 at $5k sales, +3% lifetime at $30k)',
        group: 'benefits',
        items: {
          type: 'object',
          properties: {
            threshold: { type: 'number', description: 'Sales amount to qualify' },
            thresholdType: { type: 'string', enum: ['sales_amount', 'sales_count', 'referral_count'], default: 'sales_amount' },
            reward: { type: 'string', description: 'What they get (e.g., "$300 bonus", "+3% lifetime commission")' },
            rewardType: { type: 'string', enum: ['cash_bonus', 'commission_increase', 'product_credit', 'custom'], default: 'cash_bonus' },
            rewardValue: { type: 'number', description: 'Numeric value of reward' },
          },
        },
      },

      // Terms and agreements
      terms: {
        type: 'object',
        description: 'Program terms and conditions',
        group: 'terms',
        properties: {
          agreementText: {
            type: 'string',
            'x-control-variant': 'richtext',
            description: 'Full affiliate agreement text',
          },
          agreementUrl: {
            type: 'string',
            format: 'uri',
            description: 'URL to hosted agreement document',
          },
          requiresAgreement: {
            type: 'boolean',
            default: true,
            description: 'Affiliates must accept terms before joining',
          },
          autoApprove: {
            type: 'boolean',
            default: false,
            description: 'Automatically approve new affiliates',
          },
          maxAffiliates: {
            type: 'number',
            description: 'Cap on total affiliates (e.g., first 100 founding affiliates)',
          },
          applicationDeadline: {
            type: 'string',
            format: 'date',
            description: 'Deadline to join the program',
          },
        },
      },

      // Product info for affiliates
      products: {
        type: 'array',
        description: 'Products affiliates can promote with pricing and per-item commission',
        group: 'products',
        items: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            name: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string', default: 'USD' },
            commissionOverride: { type: 'number', description: 'Per-product commission % (overrides program default)' },
            image: { type: 'string', format: 'uri' },
          },
        },
      },

      // Marketing resources for affiliates
      resources: {
        type: 'array',
        description: 'Marketing materials, banners, copy for affiliates to use',
        group: 'resources',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            type: { type: 'string', enum: ['banner', 'email_template', 'social_post', 'landing_page', 'video', 'document', 'other'] },
            url: { type: 'string', format: 'uri' },
            description: { type: 'string' },
            dimensions: { type: 'string', description: 'For banners (e.g., "728x90")' },
          },
        },
      },

      // Contact info
      contactEmail: {
        type: 'string',
        format: 'email',
        description: 'Program manager contact email',
        group: 'contact',
      },
      contactName: {
        type: 'string',
        description: 'Program manager name',
        group: 'contact',
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
      trackingCookieAge: {
        type: 'number',
        default: 30,
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

registerCollection(
  'Affiliate Program',
  DataType.affiliate_program,
  AffiliateProgramSchema()
);
