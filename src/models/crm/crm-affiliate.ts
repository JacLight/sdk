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
      /**
       * Where to text them.
       *
       * Affiliate mail was email-only, which is the wrong default for the one
       * message that matters most — "your code is live, here it is" is read on
       * a phone, next to the link they are about to paste. Taken from the
       * linked customer when they enrol; nothing is sent if it is absent.
       */
      phone: {
        type: 'string',
        description: 'Mobile number for affiliate texts',
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
      /**
       * Every code this affiliate has, live or not.
       *
       * One affiliate legitimately holds several: a personal code they say out
       * loud, a campaign code for one promotion, and whatever they used before
       * the last rename. A single `code` field forced all of that into one
       * string and made a change destructive — the old code is already in links
       * and printed on cards, and whoever shared it cannot recall it.
       *
       * Codes are unique across the organization case-insensitively, so
       * `SARAH` and `sarah` cannot belong to two different people.
       *
       * Status is what a code can still do, not merely how old it is:
       *   active   — advertised, resolves, can be handed out
       *   retired  — replaced; no longer advertised, but still resolves so
       *              everything already in the wild keeps crediting them
       *   disabled — deliberately killed (leaked, abused); resolves to nobody
       *
       * A code stays on the affiliate that owned it whatever its status, so it
       * can never be reassigned to someone else and quietly redirect the first
       * one's attribution.
       */
      codes: {
        type: 'array',
        group: 'general',
        description: 'All referral codes for this affiliate, live and retired',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'The code as it was typed — this is what gets displayed and shared' },
            /**
             * The same code folded to lower case. Every lookup matches on this,
             * which is what makes `SARAH`, `Sarah` and `sarah` one code rather
             * than three: nobody typing it into a checkout box should have to
             * get the capitals right, and nobody entering it should have theirs
             * overwritten. Maintained by the server; never set by hand.
             */
            match: {
              type: 'string',
              unique: true,
              readOnly: true,
              description: 'Lower-cased form used for matching. Unique across the organization — enforced by the database.',
            },
            status: {
              type: 'string',
              enum: ['active', 'retired', 'disabled'],
              default: 'active',
            },
            /** What it is for, in the operator's words — "Spring flyer", "Podcast read". */
            label: { type: 'string' },
            isPrimary: {
              type: 'boolean',
              default: false,
              description: 'The one shown to the affiliate and used to build links',
            },
            createdAt: { type: 'string', format: 'date-time' },
            createdBy: { type: 'string' },
            retiredAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      status: {
        type: 'string',
        // `rejected` is a decision, not a suspension: an application that was
        // never approved. Telling someone their account is "suspended" when
        // they never had one is both wrong and confusing, and the
        // affiliate-rejected mail already existed with nothing able to send it.
        enum: ['pending', 'active', 'suspended', 'rejected'],
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
    required: ['email', 'name'],
  } as const;
};

const schema = AffiliateSchema();
export type AffiliateModel = FromSchema<typeof schema>;

registerCollection('Affiliate', DataType.affiliate, AffiliateSchema());
