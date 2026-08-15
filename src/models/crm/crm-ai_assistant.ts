import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { ControlType, DataType } from '../../types';
import { VoiceField, VoiceProviderField } from '../_voice-fields';

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
      voice: { ...VoiceField().voice, group: 'behavior_voice' },
      voiceProvider: { ...VoiceProviderField().voiceProvider, group: 'behavior_voice' },
      behaviorRules: {
        type: 'array',
        items: { type: 'string' },
        group: 'behavior_rules',
      },

      // ===== Skills =====
      capabilities: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description:
                'Id of a built-in playbook, from GET /crm/ai-assistant/capabilities (e.g. qualify_leads). Attaching one injects its full step-by-step instructions into the prompt. Store this rather than relying on `name`: the lookup falls back to normalising the display name, so renaming a capability in the UI would silently detach its playbook.',
            },
            name: {
              type: 'string',
              description: 'Display name (e.g., Lead Qualification)',
            },
            description: {
              type: 'string',
              description:
                'What this capability does. With no matching built-in id, this text IS the playbook — it goes into the prompt verbatim, so it is how a tenant writes their own procedure.',
            },
          },
        },
        description:
          'What the assistant can do — built-in instruction playbooks by id, or custom ones written as a description',
      },
      tools: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: {
              type: 'string',
              description: 'Tool key from GET /crm/ai-assistant/tools. Free text, so only those values do anything.',
            },
            description: { type: 'string' },
            enabled: { type: 'boolean', default: true },
          },
          required: ['key'],
        },
        description:
          'The actions this assistant may take. Enforced at execution, not merely in the prompt. NOTE the three-state behaviour: omitted means EVERY tool is allowed, [] means none, and a list means only those — so a form that initialises this to [] ships an assistant that can talk but never act.',
      },

      // ===== Interaction =====
      triggers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              description:
                'What wakes the assistant, from GET /crm/ai-assistant/triggers. Free text, so only those values actually fire — `message.received` covers email, chat, DMs and comments, while SMS has its own `sms.received`. Removing the trigger is how auto-reply is turned off.',
            },
            action: {
              type: 'string',
              description: 'The task handed to the assistant when this fires, e.g. "Read the customer\'s message and help them".',
            },
            context: {
              type: 'string',
              title: 'Extra Instructions',
              description:
                'Instructions given to the assistant whenever this trigger fires, on top of its personality and behaviour rules. Same field the IVR sets as aiAssistantConfig.context.',
              'x-control-variant': 'textarea',
            },
            filters: {
              type: 'object',
              description:
                'Which messages this trigger answers. Every condition must match (AND). Empty means ALL of them. Matched against the inbound event: channel, from, activityType, conversationId, postId. Each value is either a literal or one of {equals}, {contains}, {startsWith}, {in:[…]} — so {"channel":{"in":["facebook","instagram"]}} answers Meta only, and {"activityType":"message"} answers private DMs while leaving public comments alone.',
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
        description:
          'Stated in the system prompt as guidance. NOT a security boundary — nothing checks it at execution. To actually stop an action, remove the tool from `tools`, which IS enforced. Do not present this to users as a permission gate.',
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
          retryCount: {
            type: 'number',
            default: 0,
            description: 'Not currently enforced — stored but never read. Do not surface it as a working control.',
          },
          timeoutSeconds: { type: 'number', default: 30, description: 'How long a single run may take before it is abandoned.' },
        },
        description:
          'Run limits. There is NO cap on how many messages an assistant answers — a thousand inbound comments produce a thousand replies. Rate limiting, if wanted, has to come from trigger filters.',
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
  AIAssistantSchema()
);
