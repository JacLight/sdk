import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';

export const AIAssistantSchema = () => {
  return {
    type: 'object',
    required: ['name', 'title'],
    properties: {
      // ===== Identity =====
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'identity_name',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'archived'],
        default: 'active',
        group: 'identity_name',
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
      },

      // ===== Behavior =====
      personality: {
        type: 'string',
        'x-control': ControlType.richtext,
        group: 'behavior_personality',
      },
      behaviorRules: {
        type: 'array',
        items: { type: 'string' },
        group: 'behavior_rules',
      },

      // ===== Skills =====
      capabilities: {
        type: 'array',
        items: { type: 'string' },
      },
      tools: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            description: { type: 'string' },
            enabled: { type: 'boolean', default: true },
          },
          required: ['key'],
        },
      },

      // ===== Interaction =====
      triggers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            event: { type: 'string' },
            action: { type: 'string' },
            filters: {
              type: 'object',
              description: 'Conditions that must match for this trigger to activate',
              additionalProperties: true,
            },
          },
          required: ['event', 'action'],
        },
        group: 'interaction_triggers',
      },
      interactionRules: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            when: { type: 'string' },
            then: { type: 'string' },
          },
          required: ['when', 'then'],
        },
        group: 'interaction_rules',
      },

      // ===== Knowledge =====
      knowledgeSources: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            sourceType: {
              type: 'string',
              enum: ['collection', 'document', 'url', 'custom'],
            },
            reference: { type: 'string' },
          },
          required: ['sourceType', 'reference'],
        },
        group: 'knowledge_sources',
      },
      memory: {
        type: 'object',
        properties: {
          enabled: { type: 'boolean', default: true },
          retentionDays: { type: 'number', default: 30 },
          scope: {
            type: 'string',
            enum: ['conversation', 'user', 'team', 'global'],
            default: 'conversation',
          },
        },
        group: 'knowledge_memory',
      },

      // ===== Security =====
      permissions: {
        type: 'array',
        items: { type: 'string' },
        group: 'security_permissions',
      },
      safety: {
        type: 'object',
        properties: {
          restrictedTopics: { type: 'array', items: { type: 'string' } },
          escalationContact: { type: 'string' },
        },
        group: 'security_safety',
      },
      limits: {
        type: 'object',
        properties: {
          retryCount: { type: 'number', default: 0 },
          timeoutSeconds: { type: 'number', default: 30 },
        },
        group: 'security_limits',
      },

      // ===== Advanced =====
      config: {
        type: 'object',
        additionalProperties: true,
        group: 'advanced_config',
      },

      visibility: {
        type: 'string',
        enum: ['owner', 'team', 'organization', 'global'],
        default: 'owner',
        group: 'advanced_visibility',
      },

      // ===== Collaboration & Onboarding =====
      onboardingPrompt: {
        type: 'string',
        'x-control': ControlType.richtext,
        group: 'onboarding_prompt',
      },

      collaborators: {
        type: 'array',
        items: { type: 'string' },
        group: 'collaboration_collaborators',
      },
    },
  } as const;
};

const cs = AIAssistantSchema();
export type CrmAIAssistantModel = FromSchema<typeof cs>;

registerCollection(
  'CRM AI Assistant',
  DataType.ai_assistant,
  AIAssistantSchema
);
