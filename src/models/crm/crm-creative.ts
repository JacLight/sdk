import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const CreativeSchema = () => {
  return {
    type: 'object',
    required: ['name', 'contentType', 'platforms', 'isActive'],
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'basic',
        description: 'Content name',
      },
      title: {
        type: 'string',
        maxLength: 200,
        group: 'basic',
        description: 'Content title',
      },
      description: {
        type: 'string',
        maxLength: 1000,
        'x-control-variant': 'textarea',
        group: 'basic',
        description: 'Content description',
      },
      contentType: {
        type: 'string',
        enum: ['text', 'image', 'video', 'audio', 'document', 'html'],
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'content',
        description: 'Type of content',
      },
      contentSubtype: {
        type: 'string',
        enum: ['headline', 'description', 'cta', 'body', 'subject', 'banner', 'story', 'reel', 'carousel', 'display', 'native'],
        'x-control': ControlType.selectMany,
        maxItems: 1,
        group: 'content',
        description: 'Specific subtype of content',
      },
      textContent: TextContentSchema(),
      mediaContent: MediaContentSchema(),
      platforms: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'pinterest', 'snapchat'],
        },
        minItems: 1,
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'targeting',
        description: 'Target platforms',
      },
      adFormats: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['image', 'video', 'carousel', 'story', 'reel', 'banner', 'native', 'display', 'text', 'audio', 'print'],
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'targeting',
        description: 'Compatible ad formats',
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
        description: 'Content tags',
      },
      performanceMetrics: CreativePerformanceSchema(),
      abTestResults: {
        type: 'array',
        items: ABTestResultSchema(),
        group: 'testing',
        description: 'A/B test results',
      },
      aiGenerated: {
        type: 'boolean',
        default: false,
        group: 'metadata',
        description: 'Whether content was AI generated',
      },
      isActive: {
        type: 'boolean',
        default: true,
        group: 'metadata',
        description: 'Whether content is active',
      },
      isArchived: {
        type: 'boolean',
        default: false,
        group: 'metadata',
        description: 'Whether content is archived',
      },
    },
  } as const;
};

export const TextContentSchema = () => {
  return {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        minLength: 1,
        maxLength: 5000,
        'x-control-variant': 'textarea',
        description: 'Text content',
      },
      language: {
        type: 'string',
        default: 'en',
        description: 'Content language',
      },
      characterCount: {
        type: 'number',
        minimum: 0,
        readOnly: true,
        description: 'Character count',
      },
      variations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            text: { type: 'string' },
            performanceScore: {
              type: 'number',
              minimum: 0,
              maximum: 100,
            },
          },
        },
        description: 'Text variations',
      },
    },
    group: 'content',
    description: 'Text-specific properties (when contentType is text)',
  } as const;
};

export const MediaContentSchema = () => {
  return {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        format: 'uri',
        description: 'Media file URL',
      },
      thumbnailUrl: {
        type: 'string',
        format: 'uri',
        description: 'Thumbnail URL',
      },
      format: {
        type: 'string',
        description: 'File format (jpg, mp4, mp3, pdf, etc.)',
      },
      fileSize: {
        type: 'number',
        minimum: 0,
        description: 'File size in bytes',
      },
      dimensions: {
        type: 'object',
        properties: {
          width: { type: 'number', minimum: 0 },
          height: { type: 'number', minimum: 0 },
        },
        description: 'Media dimensions',
      },
      duration: {
        type: 'number',
        minimum: 0,
        description: 'Duration in seconds for video/audio',
      },
      altText: {
        type: 'string',
        maxLength: 500,
        description: 'Alt text for accessibility',
      },
    },
    group: 'content',
    description: 'Media-specific properties (when contentType is not text)',
  } as const;
};

export const CreativePerformanceSchema = () => {
  return {
    type: 'object',
    collapsible: true,
    properties: {
      impressions: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'performance',
        description: 'Content impressions',
      },
      clicks: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'performance',
        description: 'Content clicks',
      },
      ctr: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        default: 0,
        group: 'performance',
        description: 'Click-through rate',
      },
      conversions: {
        type: 'number',
        minimum: 0,
        default: 0,
        group: 'performance',
        description: 'Content conversions',
      },
      engagementRate: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        default: 0,
        group: 'performance',
        description: 'Engagement rate',
      },
    },
  } as const;
};

export const ABTestResultSchema = () => {
  return {
    type: 'object',
    properties: {
      variant: { type: 'string' },
      impressions: { type: 'number', minimum: 0 },
      clicks: { type: 'number', minimum: 0 },
      conversions: { type: 'number', minimum: 0 },
      confidence: { type: 'number', minimum: 0, maximum: 100 },
    },
  } as const;
};

// Group all creative models to avoid name clashes
export namespace CreativeModels {
  export type CreativeModel = FromSchema<ReturnType<typeof CreativeSchema>>;
  export type TextContentModel = FromSchema<ReturnType<typeof TextContentSchema>>;
  export type MediaContentModel = FromSchema<ReturnType<typeof MediaContentSchema>>;
  export type CreativePerformanceModel = FromSchema<ReturnType<typeof CreativePerformanceSchema>>;
  export type ABTestResultModel = FromSchema<ReturnType<typeof ABTestResultSchema>>;
}

registerCollection(
  'Creative',
  DataType.creative, // Using post as the closest existing data type for creative content
  CreativeSchema(),
);