import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const AudienceSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'basic',
        description: 'Audience segment name',
      },
      description: {
        type: 'string',
        maxLength: 1000,
        'x-control-variant': 'textarea',
        group: 'basic',
        description: 'Audience segment description',
      },
      ageRange: {
        type: 'object',
        properties: {
          min: {
            type: 'number',
            minimum: 13,
            maximum: 100,
          },
          max: {
            type: 'number',
            minimum: 13,
            maximum: 100,
          },
        },
        group: 'demographics',
        description: 'Age range targeting',
      },
      gender: {
        type: 'string',
        enum: ['male', 'female', 'all'],
        default: 'all',
        group: 'demographics',
        description: 'Gender targeting',
      },
      languages: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'demographics',
        description: 'Language targeting',
      },
      locations: LocationTargetingSchema(),
      interests: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'psychographics',
        description: 'Interest-based targeting',
      },
      behaviors: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'psychographics',
        description: 'Behavioral targeting',
      },
      lifestyle: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'psychographics',
        description: 'Lifestyle targeting',
      },
      devices: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['mobile', 'desktop', 'tablet','wearables'],
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'technology',
        description: 'Device targeting',
      },
      operatingSystems: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'technology',
        description: 'Operating system targeting',
      },
      browsers: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'technology',
        description: 'Browser targeting',
      },
      incomeRange: {
        type: 'object',
        properties: {
          min: {
            type: 'number',
            minimum: 0,
          },
          max: {
            type: 'number',
            minimum: 0,
          },
        },
        group: 'demographics',
        description: 'Income range targeting',
      },
      education: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'demographics',
        description: 'Education level targeting',
      },
      occupation: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'demographics',
        description: 'Occupation targeting',
      },
      customAudiences: {
        type: 'array',
        items: CustomAudienceSchema(),
        group: 'advanced',
        description: 'Custom audience configurations',
      },
      exclusions: ExclusionTargetingSchema(),
      size: {
        type: 'number',
        minimum: 0,
        group: 'metrics',
        description: 'Estimated audience size',
      },
      aiGenerated: {
        type: 'boolean',
        default: false,
        group: 'metadata',
        description: 'Whether audience was AI generated',
      },
      isActive: {
        type: 'boolean',
        default: true,
        group: 'metadata',
        description: 'Whether audience is active',
      },
    },
  } as const;
};

export const LocationTargetingSchema = () => {
  return {
    type: 'object',
    properties: {
      countries: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
      },
      regions: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
      },
      cities: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
      },
      postalCodes: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
      },
      radius: {
        type: 'number',
        minimum: 0,
        description: 'Radius in kilometers',
      },
    },
    group: 'geographic',
    description: 'Geographic targeting',
  } as const;
};

export const CustomAudienceSchema = () => {
  return {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        enum: ['lookalike', 'custom', 'retargeting', 'email_list'],
      },
      sourceId: {
        type: 'string',
        description: 'Source identifier for the custom audience',
      },
      size: {
        type: 'number',
        minimum: 0,
        description: 'Custom audience size',
      },
    },
  } as const;
};

export const ExclusionTargetingSchema = () => {
  return {
    type: 'object',
    properties: {
      audiences: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.audience,
          value: 'name',
          label: 'name',
        },
        description: 'Exclude these audience segments',
      },
      interests: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        description: 'Exclude these interests',
      },
      behaviors: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        description: 'Exclude these behaviors',
      },
    },
    group: 'advanced',
    description: 'Exclusion targeting',
  } as const;
};

// Group all audience models to avoid name clashes
export namespace AudienceModels {
  export type AudienceModel = FromSchema<ReturnType<typeof AudienceSchema>>;
  export type LocationTargetingModel = FromSchema<ReturnType<typeof LocationTargetingSchema>>;
  export type CustomAudienceModel = FromSchema<ReturnType<typeof CustomAudienceSchema>>;
  export type ExclusionTargetingModel = FromSchema<ReturnType<typeof ExclusionTargetingSchema>>;
}

registerCollection(
  'Audience',
  DataType.audience,
  AudienceSchema(),
  null,
  null,
  false,
  false
);