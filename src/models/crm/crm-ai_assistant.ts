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

      // ===== Routing =====
      // WHERE this assistant listens. Both are structured, not plain English,
      // because code has to decide who to wake before any model runs — and both
      // are picked from a list, so they cannot be mistyped. Everything about
      // WHETHER to act on a given message is the model's judgment, in the
      // trigger's plain-English `filter`.
      channels: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['email', 'sms', 'chat', 'facebook', 'instagram', 'whatsapp', 'tiktok', 'twitter', 'linkedin', 'voice'],
        },
        description:
          'Channels this assistant answers on. Empty means all of them. Checked first, before the trigger — a message on a channel not listed here never reaches any of its triggers.',
        group: 'routing_channels',
      },
      accounts: {
        type: 'array',
        items: { type: 'string' },
        description:
          'The accounts this assistant answers for — a Facebook/Instagram page id, a WhatsApp business number, one of your phone numbers, an inbox address. This is how two brands on one org each get their own assistant. Empty means every account.\n\nAt assistant level rather than per trigger, and NOT nested under a channel: an account only ever exists on one channel, and the trigger already says which channels it listens on — so an account on a channel no trigger covers can never fire regardless.',
        group: 'routing_accounts',
      },

      // ===== Interaction =====
      triggers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: { type: 'string' },
              'x-control': ControlType.selectMany,
              'x-control-variant': 'combo',
              // Options come from the server at runtime (`aiTriggerEvents` →
              // `GET /crm/ai-assistant/triggers`), not a static enum here. The
              // events are defined in the backend and grow with it, so a copy
              // in this schema would be stale the first time one is added —
              // same reason `aiVoices` is a function rather than a list.
              dataSource: {
                source: 'function',
                value: 'aiTriggerEvents',
                label: 'name',
              },
              description:
                'The system events this trigger listens for. Several can share one condition and one set of instructions — an inbound message and a missed call are often handled the same way, and splitting them would mean maintaining the same wording twice. Code dispatches on these, so a value outside the served list simply never fires. Removing the trigger is how you turn the assistant off for those events.',
            },
            filter: {
              type: 'string',
              description:
                'In plain English, the condition for acting on this event — "when the customer asks about a refund or returning something", "when they sound angry". Judged by the model, so wording, synonyms and typos are understood: a customer writing "can I get my money back" matches a refund condition without the word appearing. Leave empty to act on every occurrence of the event.',
              'x-control-variant': 'textarea',
            },
            instructions: {
              type: 'string',
              description:
                'In plain English, how to handle it — the steps, what to check, what to say, when to hand off to a person. Added to the assistant\'s own instructions whenever this trigger fires, so it holds what is specific to THIS situation rather than to the assistant generally.',
              'x-control-variant': 'textarea',
            },
          },
          required: ['events'],
        },
        description:
          'When this assistant acts. One entry per situation. `events` is the only structured part — code has to know which system events to dispatch on, and they are picked from a server-supplied list so they cannot be mistyped. The other two are plain language read by the model, which is what lets a condition like "asking for their money back" match without anyone listing synonyms.',
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
      handoff: {
        type: 'object',
        description:
          'Human takeover. When a person replies on a conversation this assistant is handling, the assistant stands down for this many minutes so it does not talk over them. 0 disables the pause (the assistant keeps answering even after a human replies).',
        properties: {
          pauseAfterHumanReplyMinutes: { type: 'number', default: 120 },
        },
        group: 'interaction_triggers',
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
