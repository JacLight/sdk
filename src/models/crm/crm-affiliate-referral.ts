import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const AffiliateReferralSchema = () => {
  return {
    type: 'object',
    properties: {
      affiliateCode: {
        type: 'string',
        group: 'general',
      },
      affiliateId: {
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
      referredEmail: {
        type: 'string',
        format: 'email',
      },
      referredCustomerId: {
        type: 'string',
      },
      source: {
        type: 'string',
        enum: ['link', 'code', 'qr'],
        default: 'code',
        group: 'type',
      },
      attributedAt: {
        type: 'string',
        format: 'date-time',
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
      },
      status: {
        type: 'string',
        enum: ['pending', 'converted', 'qualified', 'commission_held', 'commission_paid', 'rejected', 'expired'],
        default: 'pending',
        group: 'type',
      },
      orderId: {
        type: 'string',
        group: 'order',
      },
      orderNumber: {
        type: 'string',
        group: 'order',
      },
      orderAmount: {
        type: 'number',
        group: 'order',
      },
      orderDate: {
        type: 'string',
        format: 'date-time',
        group: 'order',
      },
      commissionAmount: {
        type: 'number',
        group: 'commission',
      },
      commissionType: {
        type: 'string',
        group: 'commission',
      },
      commissionRate: {
        type: 'number',
        group: 'commission',
      },
      commissionStatus: {
        type: 'string',
        enum: ['pending', 'held', 'credited', 'reversed'],
        group: 'commission',
      },
      walletTransactionId: {
        type: 'string',
      },
      flagged: {
        type: 'boolean',
        default: false,
      },
      flagReason: {
        type: 'string',
      },
    },
    required: ['affiliateCode', 'affiliateId', 'program'],
  } as const;
};

const schema = AffiliateReferralSchema();
export type AffiliateReferralModel = FromSchema<typeof schema>;

registerCollection('Affiliate Referral', DataType.affiliate_referral, AffiliateReferralSchema());
