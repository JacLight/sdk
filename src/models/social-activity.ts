import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';

export const SocialActivitySchema = () => {
  return {
    type: 'object',
    required: ['campaignId', 'eventType', 'timestamp', 'platform'],
    properties: {
      // Campaign Linking
      campaignId: {
        type: 'string',
        group: 'campaign',
        description: 'Referenced campaign ID',
      },
      eventType: {
        type: 'string',
        enum: [
          'impression',
          'click',
          'conversion',
          'video_view',
          'like',
          'share',
          'comment',
          'save',
          'signup',
          'purchase',
          'landing_page_view',
          'email_open',
          'email_click',
          'feed',
        ],
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'event',
        description: 'Type of event',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        group: 'event',
        description: 'Event timestamp',
      },
      platform: {
        type: 'string',
        enum: [
          'facebook',
          'instagram',
          'twitter',
          'linkedin',
          'tiktok',
          'youtube',
          'pinterest',
          'snapchat',
          'email',
          'website',
        ],
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'platform',
        description: 'Platform where event occurred',
      },

      // Creative & Placement Info
      adFormat: {
        type: 'string',
        group: 'placement',
        description: 'Ad format',
      },
      placement: {
        type: 'string',
        group: 'placement',
        description: 'Ad placement',
      },
      creativeId: {
        type: 'string',
        group: 'campaign',
        description: 'Creative asset ID that triggered the event',
      },
      audienceSegmentId: {
        type: 'string',
        group: 'campaign',
        description: 'Audience segment ID',
      },
      period:{
        type: 'string',
      },      // Financial Metrics
      cost: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'financial',
        description: 'Cost associated with this event',
      },
      revenue: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'financial',
        description: 'Revenue generated from this event',
      },
      costPerClick: {
        type: 'number',
        minimum: 0,
        group: 'financial',
        description: 'Cost per click',
      },
      costPerThousandImpressions: {
        type: 'number',
        minimum: 0,
        group: 'financial',
        description: 'Cost per thousand impressions (CPM)',
      },
      returnOnAdSpend: {
        type: 'number',
        minimum: 0,
        group: 'financial',
        description: 'Return on ad spend (ROAS)',
      },
      costPerAcquisition: {
        type: 'number',
        minimum: 0,
        group: 'financial',
        description: 'Cost per acquisition',
      },

      // Basic Social Metrics
      likes: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'engagement',
        description: 'Number of likes',
      },
      comments: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'engagement',
        description: 'Number of comments',
      },
      shares: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'engagement',
        description: 'Number of shares',
      },
      mentions: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'engagement',
        description: 'Number of mentions',
      },
      clicks: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'engagement',
        description: 'Number of clicks',
      },
      views: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'reach',
        description: 'Number of views',
      },
      reach: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'reach',
        description: 'Total reach',
      },
      impressions: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'reach',
        description: 'Total impressions',
      },

      // Calculated Metrics
      engagementRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'calculated',
        description: 'Engagement rate percentage',
      },
      clickThroughRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'calculated',
        description: 'Click-through rate percentage',
      },
      conversionRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'calculated',
        description: 'Conversion rate percentage',
      },
      bounceRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'calculated',
        description: 'Bounce rate percentage',
      },

      // Profile & Growth Metrics
      profileImage: {
        type: 'string',
        format: 'uri',
        group: 'profile',
        description: 'Profile image URL',
      },
      name: {
        type: 'string',
        group: 'profile',
        description: 'Profile/account name',
      },
      followers: {
        type: 'integer',
        minimum: 0,
        group: 'growth',
        description: 'Current followers count',
      },
      audienceGrowthRate: {
        type: 'number',
        group: 'growth',
        description: 'Audience growth rate percentage',
      },

      // Video-Specific Metrics
      videoViews: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'video',
        description: 'Video views count',
      },
      averageWatchTime: {
        type: 'number',
        minimum: 0,
        group: 'video',
        description: 'Average watch time in seconds',
      },
      completionRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'video',
        description: 'Video completion rate percentage',
      },
      replays: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'video',
        description: 'Number of video replays',
      },
      videoInfo: VideoInfoSchema(),

      // Sentiment Analysis
      positiveSentiment: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'sentiment',
        description: 'Positive sentiment count',
      },
      negativeSentiment: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'sentiment',
        description: 'Negative sentiment count',
      },
      neutralSentiment: {
        type: 'integer',
        minimum: 0,
        default: 0,
        group: 'sentiment',
        description: 'Neutral sentiment count',
      },

      // User Information (anonymized)
      userInfo: UserInfoSchema(),

      // Conversion Details
      conversionInfo: ConversionInfoSchema(),

      // UTM & Referrer Tracking
      referrer: ReferrerInfoSchema(),

      // A/B Testing
      abTestInfo: ABTestInfoSchema(),

      // Legacy fields for compatibility
      sourceType: {
        type: 'string',
        group: 'legacy',
        description: 'Legacy source type field',
      },
      sourceId: {
        type: 'string',
        group: 'legacy',
        description: 'Legacy source ID field',
      },

      // ===== Conversation =====
      // This collection holds two very different things: high-volume ad metrics
      // (everything above) and actual conversations — DMs and comments. The
      // fields below belong to the conversational rows and were being written
      // by the connectors without ever being declared here.
      standardActivityType: {
        type: 'string',
        description:
          "What kind of activity this is. 'message' (a DM) and 'comment' are the conversational ones an assistant answers; the rest are engagement and metric rows that must never wake one.",
        group: 'conversation',
      },
      compositeKey: {
        type: 'string',
        description: 'platform + sourceType + sourceId, used to dedup a webhook the platform re-delivers.',
        group: 'conversation',
      },
      authorId: {
        type: 'string',
        description:
          "Who wrote it, as the platform's own id. On an OUTBOUND row this is our own page/account id — which is also what stops our own replies being read back as new customer messages.",
        group: 'conversation',
      },
      authorName: {
        type: 'string',
        description: 'Display name of the author, when the platform provides one.',
        group: 'conversation',
      },
      recipientId: {
        type: 'string',
        description:
          'The OTHER PARTY being addressed — the person a reply is going to. Only meaningful on an outbound message; on an inbound one the other party is the author, and this is empty. Never our own account: which of our accounts is involved is `accountId`, always, in both directions.',
        group: 'conversation',
      },
      accountId: {
        type: 'string',
        description:
          "WHICH OF OUR ACCOUNTS this belongs to — the Facebook page id, Instagram account id, WhatsApp business number id, or channel id that received it or sent it. An org can have several pages linked, often one per brand, and without this a message cannot be attributed to the right one: the inbox cannot be filtered by brand, an assistant scoped to one page cannot tell whether a message is its own, and a reply can go out from the wrong account entirely.\n\nAlways OUR side, whichever way the message went — the recipient on an inbound message, the sender on an outbound one. That is what makes it usable as a filter on its own, without having to read `direction` first.",
        group: 'conversation',
      },
      accountName: {
        type: 'string',
        description:
          'Display name of that account — "Acme Support", "Acme Nigeria". What a person actually recognises: an id is unreadable in an inbox, and an org running several brands cannot tell its threads apart by number. Resolved from the connected integration when the activity is stored, because the platform webhooks carry ids only. Filter on `accountId`; show this.',
        group: 'conversation',
      },
      direction: {
        type: 'string',
        enum: ['inbound', 'outbound'],
        description:
          "Which way it went. Absent on older rows, which are all inbound — platforms only ever delivered us what the customer sent. Set explicitly on everything written from now on, because it is what lets a thread be reconstructed as a conversation rather than a list of the customer's turns.",
        group: 'conversation',
      },
      note: {
        type: 'string',
        description:
          "INTERNAL handover note left by whoever sent this — an assistant or a person. Never shown to the customer.\n\nThe message text says what was SAID; this says what was DONE or DECIDED. \"Let me check that\" reads identically whether the order was looked up and found delayed or the lookup failed and nobody followed up. Any assistant can pick up any message regardless of who answered last, so the next responder — AI or human — reads these to avoid repeating work or contradicting a promise already made. Same idea as an agent adding a note to a ticket before passing it on.",
        group: 'conversation',
      },
      aiHold: {
        type: 'boolean',
        description:
          'Set on a HOLD row to stop assistants replying on this conversation. A person turns it on when they are handling something themselves; it stays on until a person turns it off — it never expires, because an "AI stop until I say so" that silently lapses overnight is worse than not having one.\n\nHolds REPLIES ONLY. The assistant still runs and may still raise a ticket, notify a team or update a record — it simply does not speak to the customer.',
        group: 'conversation',
      },
      aiHoldReason: {
        type: 'string',
        description: 'Why the hold was put on, so the next person knows whether it is still needed.',
        group: 'conversation',
      },
      isAiGenerated: {
        type: 'boolean',
        description: 'The assistant wrote this, not a person. Distinguishes an AI reply from one a human agent sent.',
        group: 'conversation',
      },
      assistantId: {
        type: 'string',
        description: 'Which assistant wrote it, when isAiGenerated.',
        group: 'conversation',
      },
      postId: {
        type: 'string',
        description: 'For a comment, the post the thread hangs off.',
        group: 'conversation',
      },
      messageType: {
        type: 'string',
        description: 'Platform-specific message subtype, when it reports one.',
        group: 'conversation',
      },
      attachments: {
        type: 'array',
        items: { type: 'string' },
        description: 'Attachment URLs carried on the message.',
        group: 'conversation',
      },
      metadata: {
        type: 'object',
        group: 'advanced',
        description: 'Additional platform-specific or custom metadata',
      },
      original: {
        type: 'object',
      },
    },
    additionalProperties: false,
  } as const;
};

export const UserInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'Unique user identifier (hashed for privacy)',
      },
      sessionId: {
        type: 'string',
        description: 'User session identifier',
      },
      isNewUser: {
        type: 'boolean',
        description: 'Whether this is a new user',
      },
      demographics: {
        type: 'object',
        properties: {
          ageGroup: { type: 'string' },
          gender: { type: 'string' },
          location: {
            type: 'object',
            properties: {
              country: { type: 'string' },
              region: { type: 'string' },
              city: { type: 'string' },
            },
          },
        },
      },
      device: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['mobile', 'desktop', 'tablet'],
          },
          os: { type: 'string' },
          browser: { type: 'string' },
        },
      },
    },
    group: 'user',
    description: 'User information (anonymized for privacy)',
  } as const;
};

export const ConversionInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      conversionType: {
        type: 'string',
        enum: [
          'purchase',
          'signup',
          'download',
          'subscription',
          'lead',
          'custom',
        ],
        description: 'Type of conversion',
      },
      conversionValue: {
        type: 'number',
        minimum: 0,
        description: 'Monetary value of conversion',
      },
      conversionCategory: {
        type: 'string',
        description: 'Conversion category or product type',
      },
      attributionModel: {
        type: 'string',
        enum: ['first_click', 'last_click', 'multi_touch', 'time_decay'],
        description: 'Attribution model used',
      },
      timeSinceFirstInteraction: {
        type: 'number',
        minimum: 0,
        description: 'Time in seconds since first campaign interaction',
      },
    },
    group: 'conversion',
    description: 'Conversion-specific information (only for conversion events)',
  } as const;
};

export const VideoInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      videoLength: {
        type: 'number',
        minimum: 0,
        description: 'Total video length in seconds',
      },
      watchTime: {
        type: 'number',
        minimum: 0,
        description: 'Time watched in seconds',
      },
      completionPercentage: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Percentage of video watched',
      },
      milestone: {
        type: 'string',
        enum: ['25%', '50%', '75%', '100%'],
        description: 'Video milestone reached',
      },
    },
    group: 'video',
    description: 'Video-specific information (only for video events)',
  } as const;
};

export const ReferrerInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      source: { type: 'string' },
      medium: { type: 'string' },
      campaign: { type: 'string' },
      term: { type: 'string' },
      content: { type: 'string' },
    },
    group: 'tracking',
    description: 'UTM and referrer information',
  } as const;
};

export const ABTestInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      variantId: {
        type: 'string',
        description: 'A/B test variant that triggered this event',
      },
      testId: {
        type: 'string',
        description: 'A/B test identifier',
      },
    },
    group: 'testing',
    description: 'A/B test information (when applicable)',
  } as const;
};

// Group all social activity models to avoid name clashes
export namespace SocialActivityModels {
  export type SocialActivityModel = FromSchema<
    ReturnType<typeof SocialActivitySchema>
  >;
  export type UserInfoModel = FromSchema<ReturnType<typeof UserInfoSchema>>;
  export type ConversionInfoModel = FromSchema<
    ReturnType<typeof ConversionInfoSchema>
  >;
  export type VideoInfoModel = FromSchema<ReturnType<typeof VideoInfoSchema>>;
  export type ReferrerInfoModel = FromSchema<
    ReturnType<typeof ReferrerInfoSchema>
  >;
  export type ABTestInfoModel = FromSchema<ReturnType<typeof ABTestInfoSchema>>;
}

registerCollection(
  'SocialActivity',
  DataType.social_activity,
  SocialActivitySchema(),
);
