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
  null,
  null,
  false,
  false
);
