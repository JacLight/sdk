import { registerCollection } from '../../default-schema';
import { ControlType, DataType, NotificationChannels } from '../../types';
import { FromSchema } from 'json-schema-to-ts';
import { toTitleCase } from '../../utils';

export const CampaignSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'basic',
        description: 'Campaign name',
      },
      description: {
        type: 'string',
        maxLength: 1000,
        'x-control-variant': 'textarea',
        group: 'basic',
        description: 'Campaign description',
      },
      type: {
        type: 'string',
        enum: [
          'email',
          'social',
          'ppc',
          'display',
          'video',
          'radio',
          'billboard',
          'newspaper',
          'magazine',
          'tv',
          'website',
        ],
        group: 'basic',
        description: 'Campaign type',
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'paused', 'completed', 'scheduled'],
        default: 'draft',
        group: 'basic',
        description: 'Campaign status',
      },
      budget: {
        type: 'number',
        minimum: 0,
        group: 'budget',
        description: 'Total campaign budget',
      },
      spent: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'budget',
        description: 'Amount spent so far',
      },
      dailyBudget: {
        type: 'number',
        minimum: 0,
        group: 'budget',
        description: 'Daily budget limit',
      },
      objective: {
        type: 'string',
        minLength: 1,
        group: 'basic',
        description: 'Campaign objective',
      },
      platforms: {
        type: 'array',
        items: {
          type: 'string',
        },
        minItems: 1,
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(NotificationChannels).map(key => ({
            value: key,
            label: toTitleCase(key),
          })),
        },
        group: 'targeting',
        description: 'Target platforms',
      },
      adFormat: {
        type: 'string',
        group: 'creative',
        description: 'Ad format type',
      },
      audienceIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.audience,
          value: 'name',
          label: 'title',
        },
        group: 'targeting',
        description: 'Referenced audience segment IDs',
      },
      creativeIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        group: 'creative',
        description: 'Associated creative asset IDs',
      },
      scheduledAt: {
        type: 'string',
        format: 'date-time',
        group: 'schedule',
        description: 'Scheduled start date',
      },
      scheduledEndAt: {
        type: 'string',
        format: 'date-time',
        group: 'schedule',
        description: 'Scheduled end date',
      },
      timezone: {
        type: 'string',
        default: 'UTC',
        group: 'schedule',
        description: 'Campaign timezone',
      },
      landingPage: {
        type: 'string',
        format: 'uri',
        group: 'tracking',
        description: 'Landing page URL',
      },
      utmParameters: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          medium: { type: 'string' },
          campaign: { type: 'string' },
          term: { type: 'string' },
          content: { type: 'string' },
        },
        group: 'tracking',
        description: 'UTM tracking parameters',
      },
      callbackNumber: {
        type: 'string',
        group: 'tracking',
        description: 'Tracking phone number',
      },
      location: {
        type: 'string',
        group: 'traditional',
        description: 'Campaign location (for traditional media)',
      },
      timeSlots: {
        type: 'array',
        items: {
          type: 'string',
        },
        group: 'traditional',
        description: 'Time slots for traditional media',
      },
      frequency: {
        type: 'string',
        group: 'traditional',
        description: 'Campaign frequency',
      },
      duration: {
        type: 'string',
        group: 'traditional',
        description: 'Campaign duration',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        default: [],
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'metadata',
        description: 'Campaign tags',
      },
      aiGenerated: {
        type: 'boolean',
        default: false,
        group: 'metadata',
        description: 'Whether campaign was AI generated',
      },
      variants: {
        type: 'array',
        items: CampaignVariantSchema(),
        group: 'variants',
        description: 'Campaign variants with individual performance tracking',
      },
      notes: {
        type: 'string',
        maxLength: 2000,
        'x-control-variant': 'textarea',
        group: 'metadata',
        description: 'Campaign notes',
      },
      performance: CampaignPerformanceSchema(),
    },
  } as const;
};

export const CampaignVariantSchema = () => {
  return {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Variant identifier',
      },
      name: {
        type: 'string',
        description: 'Variant name',
      },
      isControl: {
        type: 'boolean',
        default: false,
        description: 'Whether this is the control variant',
      },
      trafficAllocation: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        description: 'Traffic percentage for this variant',
      },
      creativeIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Creative assets for this variant',
      },
      audienceIds: {
        type: 'array',
        items: {
          type: 'string',
        },
        description: 'Audience segments for this variant',
      },
      customSettings: {
        type: 'object',
        description: 'Variant-specific campaign settings',
      },
      performance: CampaignPerformanceSchema(),
    },
  } as const;
};

export const CampaignPerformanceSchema = () => {
  return {
    type: 'object',
    collapsible: true,
    properties: {
      reach: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'reach',
        description: 'Campaign reach',
      },
      impressions: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'reach',
        description: 'Total impressions',
      },
      clicks: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'engagement',
        description: 'Total clicks',
      },
      conversions: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'conversions',
        description: 'Total conversions',
      },
      ctr: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        default: 0,
        group: 'rates',
        description: 'Click-through rate percentage',
      },
      cpc: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'costs',
        description: 'Cost per click',
      },
      cpm: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'costs',
        description: 'Cost per mille',
      },
      roas: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'returns',
        description: 'Return on ad spend',
      },
      likes: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'social',
        description: 'Social media likes',
      },
      shares: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'social',
        description: 'Social media shares',
      },
      followers: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'social',
        description: 'New followers gained',
      },
      emailsSent: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'email',
        description: 'Emails sent',
      },
      emailsOpened: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'email',
        description: 'Emails opened',
      },
      emailsClicked: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'email',
        description: 'Email clicks',
      },
      emailsBounced: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'email',
        description: 'Email bounces',
      },
      emailComplaints: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'email',
        description: 'Email complaints',
      },
      leads: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'conversions',
        description: 'Leads generated',
      },
      spend: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'conversions',
        description: 'Sales generated',
      },
      sales: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'conversions',
        description: 'Sales generated',
      },
      revenue: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'returns',
        description: 'Total revenue generated',
      },
    },
  } as const;
};

// Group all campaign models to avoid name clashes
export namespace CampaignModels {
  export type CampaignModel = FromSchema<ReturnType<typeof CampaignSchema>>;
  export type CampaignVariantModel = FromSchema<
    ReturnType<typeof CampaignVariantSchema>
  >;
  export type CampaignPerformanceModel = FromSchema<
    ReturnType<typeof CampaignPerformanceSchema>
  >;
}

registerCollection(
  'Campaign',
  DataType.campaign,
  CampaignSchema(),
  null,
  null,
  false,
  false
);
