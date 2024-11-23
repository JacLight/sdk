import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const SocialActivitySchema = () => {
  return {
    type: "object",
    properties: {
      platform: {
        type: "string"
      },
      profileImage: {
        type: "string"
      },
      name: {
        type: "string"
      },
      sourceType: {
        type: "string"
      },
      sourceId: {
        type: "string"
      },
      likes: {
        type: "integer"
      },
      comments: {
        type: "integer"
      },
      shares: {
        type: "integer"
      },
      mentions: {
        type: "integer"
      },
      clicks: {
        type: "integer"
      },
      views: {
        type: "integer"
      },
      engagementRate: {
        type: "number"
      },
      followers: {
        type: "integer"
      },
      reach: {
        type: "integer"
      },
      impressions: {
        type: "integer"
      },
      audienceGrowthRate: {
        type: "number"
      },
      clickThroughRate: {
        type: "number"
      },
      conversionRate: {
        type: "number"
      },
      bounceRate: {
        type: "number"
      },
      videoViews: {
        type: "integer"
      },
      averageWatchTime: {
        type: "number"
      },
      completionRate: {
        type: "number"
      },
      replays: {
        type: "integer"
      },
      costPerClick: {
        type: "number"
      },
      costPerThousandImpressions: {
        type: "number"
      },
      returnOnAdSpend: {
        type: "number"
      },
      costPerAcquisition: {
        type: "number"
      },
      positiveSentiment: {
        type: "integer"
      },
      negativeSentiment: {
        type: "integer"
      },
      neutralSentiment: {
        type: "integer"
      },
      timestamp: {
        type: "string",
        format: "date-time"
      },
    },
    required: ["activityId", "platform", "type", "timestamp", "userId"],
    additionalProperties: false
  } as const;
};

const ts = SocialActivitySchema();
export type SocialActivityModel = FromSchema<typeof ts>;
registerCollection(
  'social_activity',
  DataType.social_activity,
  SocialActivitySchema(),
  null,
  null
);


