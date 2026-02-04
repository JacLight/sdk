import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ControlType, DataType } from '../types';

export const ServicePricingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        description: 'Unique identifier e.g., twilio-sms, easypost-shipping',
        transform: 'uri',
        group: 'general',
      },
      title: {
        type: 'string',
        description: 'Display name e.g., "Twilio SMS"',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        group: 'general',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      provider: {
        type: 'string',
        description: 'Integration provider e.g., Twilio, EasyPost, OpenAI',
        group: 'provider',
      },
      operation: {
        type: 'string',
        description:
          'Specific operation e.g., sendSMS, getRates (leave empty for all operations)',
        group: 'provider',
      },
      requiresAgreement: {
        type: 'boolean',
        default: true,
        description: 'Require customer to accept terms before using',
      },
      pricingType: {
        type: 'string',
        enum: ['free', 'per_use', 'tiered', 'recurring'],
        default: 'per_use',
        'x-control': ControlType.selectMany,
        group: 'pricing',
      },
      costSource: {
        type: 'string',
        enum: ['provider', 'fixed'],
        default: 'fixed',
        description:
          'provider = cost from API (AI tokens, shipping rates), fixed = use costPerUse',
        group: 'pricing',
      },
      costPerUse: {
        type: 'number',
        default: 0,
        description: 'Cost per use when costSource is fixed',
        group: 'pricing',
      },
      markup: {
        type: 'object',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['none', 'percentage', 'fixed', 'both'],
            default: 'none',
            description: 'How to apply markup on base cost',
            group: 'markup',
          },
          percentage: {
            type: 'number',
            default: 0,
            description: 'Percentage markup (e.g., 20 = 20%)',
            group: 'markup',
          },
          fixedAmount: {
            type: 'number',
            default: 0,
            group: 'markup',
            description: 'Fixed amount to add (e.g., 0.05 = $0.05)',
          },
        },
      },
      tierPeriod: {
        type: 'string',
        enum: ['daily', 'weekly', 'monthly'],
        default: 'monthly',
        description: 'Period for tier calculation reset',
        group: 'pricing',
      },
      tiers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            minUsage: { type: 'number', group: 'tier' },
            maxUsage: { type: 'number', group: 'tier' },
            cost: { type: 'number', group: 'tier' },
          },
        },
      },
      agreementText: {
        type: 'string',
        'x-control': ControlType.richtext,
        description: 'Terms/agreement text shown to customer',
      },
      documentation: {
        type: 'string',
        'x-control': ControlType.richtext,
        description: 'Documentation text shown to customer',
      },
    },
    required: ['name', 'provider'],
  } as const;
};

const schema = ServicePricingSchema();
export type ServicePricingModel = FromSchema<typeof schema>;

registerCollection(
  'Service Pricing',
  DataType.service_pricing,
  ServicePricingSchema()
);
