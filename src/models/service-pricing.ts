import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ControlType, DataType } from '../types';

export const ServicePricingSchema = () => {
  return {
    type: 'object',
    properties: {
      configVersion: {
        type: 'number',
        default: 0,
        description: 'Code-defined version. When code version > DB version, record is auto-updated on startup.',
        group: 'system',
      },
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

      // ---- Billing model ----
      billingModel: {
        type: 'string',
        enum: ['free', 'one_time', 'recurring', 'per_use', 'per_unit', 'tiered'],
        default: 'per_use',
        description: 'How this service is billed',
        'x-control': ControlType.selectMany,
        group: 'billing',
      },
      billingInterval: {
        type: 'string',
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: 'monthly',
        description: 'Charge frequency (only for recurring billing)',
        group: 'billing',
      },
      costSource: {
        type: 'string',
        enum: ['provider', 'fixed'],
        default: 'fixed',
        description: 'provider = cost from API, fixed = use price field',
        group: 'billing',
      },

      // ---- Cost ----
      price: {
        type: 'number',
        default: 0,
        description: 'Flat price for one_time, recurring, or per_use',
        group: 'cost',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'cost',
      },
      pricingDisplay: {
        type: 'string',
        description: 'Customer-facing price label',
        group: 'cost',
      },

      // ---- Unit pricing ----
      unitName: {
        type: 'string',
        description: 'Unit label (e.g., tokens, messages, emails)',
        group: 'units',
      },
      unitPrice: {
        type: 'number',
        description: 'Price per unitSize units',
        group: 'units',
      },
      unitSize: {
        type: 'number',
        description: 'Units per unitPrice (e.g., 1000)',
        group: 'units',
      },

      // ---- Markup ----
      markup: {
        type: 'object',
        collapsible: true,
        properties: {
          type: {
            type: 'string',
            enum: ['none', 'percentage', 'fixed', 'both'],
            default: 'none',
            group: 'markup',
          },
          percentage: {
            type: 'number',
            default: 0,
            description: 'e.g., 20 = 20%',
            group: 'markup',
          },
          fixedAmount: {
            type: 'number',
            default: 0,
            description: 'e.g., 0.05 = $0.05',
            group: 'markup',
          },
        },
      },

      // ---- Tiered pricing ----
      tierPeriod: {
        type: 'string',
        enum: ['daily', 'weekly', 'monthly'],
        default: 'monthly',
        description: 'Period for tier reset',
        group: 'tiers',
      },
      tiers: {
        type: 'array',
        group: 'tiers',
        items: {
          type: 'object',
          properties: {
            minUsage: { type: 'number', group: 'tier' },
            maxUsage: { type: 'number', group: 'tier' },
            cost: { type: 'number', group: 'tier' },
          },
        },
      },

      // ---- Agreement & docs ----
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

      // Legacy compat
      pricingType: {
        type: 'string',
        enum: ['free', 'per_use', 'tiered', 'recurring'],
        description: 'Deprecated - use billingModel instead',
        group: 'legacy',
      },
      costPerUse: {
        type: 'number',
        description: 'Deprecated - use price instead',
        group: 'legacy',
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
