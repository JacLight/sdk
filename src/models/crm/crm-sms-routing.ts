import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * SMS Routing Schema
 *
 * Routes SMS messages based on phone numbers, keywords, and business hours.
 * Supports auto-replies, keyword-based actions, opt-out handling, and forwarding.
 */

export const SMSRoutingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
        unique: true,
      },
      displayName: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        group: 'identity',
      },
      description: {
        type: 'string',
        maxLength: 500,
        group: 'identity',
        'x-control-variant': 'textarea',
      },

      // Phone Numbers
      phoneNumbers: {
        type: 'array',
        description: 'Phone numbers to route (E.164 format: +15551234567)',
        group: 'phone',
        items: {
          type: 'string',
          format: 'phone',
        },
        minItems: 1,
      },

      // ===== BUSINESS HOURS =====
      businessHours: {
        type: 'object',
        group: 'schedule',
        properties: {
          enabled: {
            type: 'boolean',
            description: 'Send different auto-replies based on time of day',
            default: false,
          },
          officeHours: {
            type: 'array',
            description: 'Define when your business is open',
            items: {
              type: 'object',
              properties: {
                dayOfWeek: {
                  type: 'array',
                  'x-control': 'ControlType.selectMany',
                  'x-control-variant': 'chip',
                  items: { type: 'string' },
                  dataSource: {
                    source: 'json',
                    json: ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                  },
                },
                timezone: {
                  type: 'string',
                  'x-control': 'ControlType.select',
                  dataSource: { source: 'function', value: 'timezones' },
                  default: '{{fn:Intl.DateTimeFormat().resolvedOptions().timeZone}}',
                },
                startTime: {
                  type: 'string',
                  'x-control-variant': 'time',
                  'x-control': 'ControlType.date',
                  description: 'Opening time (e.g., 09:00)',
                },
                endTime: {
                  type: 'string',
                  'x-control-variant': 'time',
                  'x-control': 'ControlType.date',
                  description: 'Closing time (e.g., 17:00)',
                },
              },
              required: ['dayOfWeek', 'timezone', 'startTime', 'endTime'],
            },
          },
          holidays: {
            type: 'array',
            description: 'Special dates when business is closed',
            items: {
              type: 'object',
              properties: {
                date: { type: 'string', format: 'date' },
                name: { type: 'string', maxLength: 100 },
              },
              required: ['date', 'name'],
            },
          },
        },
      },

      // ===== RESPONSE FLOWS (like IVR Menus) =====
      // Define all flows once, reference them by ID for different time periods
      responseFlows: {
        type: 'array',
        description: 'Define all SMS response flows here, then assign to time periods below',
        group: 'routing',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier (e.g., main-flow, after-hours-flow)',
            },
            name: {
              type: 'string',
              description: 'Descriptive name for this flow',
            },
            // Auto-reply for this flow
            autoReply: {
              type: 'object',
              properties: {
                enabled: {
                  type: 'boolean',
                  default: true,
                },
                message: {
                  type: 'string',
                  description: 'Auto-reply message for this flow. Supports {{sender}}, {{business_name}}',
                  'x-control-variant': 'textarea',
                },
                cooldownMinutes: {
                  type: 'integer',
                  minimum: 1,
                  maximum: 1440,
                  default: 60,
                },
              },
            },
            // Keywords specific to this flow
            keywords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  keyword: { type: 'string' },
                  matchType: {
                    type: 'string',
                    enum: ['exact', 'contains', 'startsWith', 'regex'],
                    default: 'exact',
                  },
                  caseSensitive: { type: 'boolean', default: false },
                  action: {
                    type: 'string',
                    enum: ['auto-reply', 'go-to-flow', 'fill-form', 'forward-sms', 'ai-assistant', 'trigger-automation', 'create-lead', 'add-tag', 'opt-out', 'opt-in'],
                  },
                  enabled: { type: 'boolean', default: true },
                  message: { type: 'string', 'x-control-variant': 'textarea' },
                  targetFlowId: { type: 'string', description: 'Target flow ID for go-to-flow action (like IVR submenu)' },
                  schemaType: { type: 'string', description: 'Schema/DataType for fill-form action - user fills this form via SMS' },
                  completionMessage: { type: 'string', description: 'Message sent after form completion', 'x-control-variant': 'textarea' },
                  to: { oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }] },
                  aiAssistantId: { type: 'string' },
                  automationId: { type: 'string' },
                  automationData: { type: 'object', additionalProperties: true },
                  leadTags: { type: 'array', items: { type: 'string' } },
                  leadSource: { type: 'string', default: 'sms' },
                },
                required: ['keyword', 'action'],
              },
            },
            // AI assistant for this flow
            aiAssistant: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: false },
                assistantId: { type: 'string' },
              },
            },
            // Forwarding for this flow
            forwarding: {
              type: 'object',
              properties: {
                enabled: { type: 'boolean', default: false },
                forwardTo: { type: 'array', items: { type: 'string' } },
                includeOriginalMessage: { type: 'boolean', default: true },
                messagePrefix: { type: 'string', default: 'SMS from {{sender}}: ' },
              },
            },
          },
          required: ['id', 'name'],
        },
      },

      // Time Period Flow Assignments (like IVR menuAssignments)
      flowAssignments: {
        type: 'object',
        description: 'Which flow to use for each time period',
        group: 'routing',
        properties: {
          normalHours: {
            type: 'string',
            description: 'Flow ID for business hours',
          },
          afterHours: {
            type: 'string',
            description: 'Flow ID for outside business hours',
          },
          holiday: {
            type: 'string',
            description: 'Flow ID for holidays',
          },
        },
        required: ['normalHours'],
      },

      // ===== LEGACY AUTO-REPLY (for simple use cases) =====
      autoReply: {
        type: 'object',
        description: 'Simple auto-reply (use responseFlows for advanced)',
        group: 'auto_reply',
        properties: {
          enabled: {
            type: 'boolean',
            description: 'Enable automatic replies',
            default: true,
          },
          normalHoursMessage: {
            type: 'string',
            description: 'Message during business hours. Supports {{sender}}, {{business_name}}',
            'x-control-variant': 'textarea',
            default: 'Thanks for texting {{business_name}}! We will get back to you shortly.',
          },
          afterHoursMessage: {
            type: 'string',
            description: 'Message outside business hours',
            'x-control-variant': 'textarea',
            default: 'Thanks for your message! We are currently closed and will respond during business hours.',
          },
          holidayMessage: {
            type: 'string',
            description: 'Message on holidays',
            'x-control-variant': 'textarea',
          },
          cooldownMinutes: {
            type: 'integer',
            description: 'Minutes between auto-replies to the same number (prevent spam)',
            minimum: 1,
            maximum: 1440,
            default: 60,
          },
        },
      },

      // ===== GLOBAL KEYWORD ROUTING (applies to all flows) =====
      keywords: {
        type: 'array',
        description: 'Keyword-based routing rules (checked before auto-reply)',
        group: 'keywords',
        items: {
          type: 'object',
          properties: {
            keyword: {
              type: 'string',
              description: 'Keyword to match (e.g., SALES, HELP, STOP)',
            },
            matchType: {
              type: 'string',
              enum: ['exact', 'contains', 'startsWith', 'regex'],
              default: 'exact',
              description: 'How to match the keyword',
            },
            caseSensitive: {
              type: 'boolean',
              default: false,
            },
            action: {
              type: 'string',
              enum: [
                'auto-reply',
                'go-to-flow',
                'fill-form',
                'forward-sms',
                'ai-assistant',
                'trigger-automation',
                'create-lead',
                'add-tag',
                'opt-out',
                'opt-in',
              ],
              description: 'Action to take when keyword matches',
            },
            enabled: {
              type: 'boolean',
              default: true,
            },

            // Action-specific fields (unified naming like missedCallActions)
            message: {
              type: 'string',
              description: 'Reply message for auto-reply action or transition message for go-to-flow',
              'x-control-variant': 'textarea',
            },
            targetFlowId: {
              type: 'string',
              description: 'Target flow ID for go-to-flow action (like IVR submenu navigation)',
            },
            schemaType: {
              type: 'string',
              description: 'Schema/DataType for fill-form action - user fills this form via SMS',
            },
            completionMessage: {
              type: 'string',
              description: 'Message sent after form completion',
              'x-control-variant': 'textarea',
            },
            to: {
              oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
              description: 'Forward to: phone number(s) or "agent:agentId"',
            },
            aiAssistantId: {
              type: 'string',
              description: 'AI Assistant ID to hand off conversation',
            },
            automationId: {
              type: 'string',
              description: 'Automation workflow ID to trigger',
            },
            automationData: {
              type: 'object',
              additionalProperties: true,
              description: 'Extra data to pass to automation',
            },
            leadTags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Tags to add to lead',
            },
            leadSource: {
              type: 'string',
              default: 'sms',
            },
          },
          required: ['keyword', 'action'],
        },
      },

      // ===== OPT-OUT HANDLING =====
      optOut: {
        type: 'object',
        description: 'Handle opt-out requests (STOP, UNSUBSCRIBE)',
        group: 'opt_out',
        properties: {
          enabled: {
            type: 'boolean',
            description: 'Enable opt-out handling',
            default: true,
          },
          keywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Keywords that trigger opt-out',
            default: ['STOP', 'UNSUBSCRIBE', 'CANCEL', 'END', 'QUIT'],
          },
          confirmationMessage: {
            type: 'string',
            description: 'Message sent after opt-out',
            default: 'You have been unsubscribed and will no longer receive messages from us. Reply START to opt back in.',
          },
          optInKeywords: {
            type: 'array',
            items: { type: 'string' },
            description: 'Keywords that trigger opt-in',
            default: ['START', 'SUBSCRIBE', 'YES'],
          },
          optInMessage: {
            type: 'string',
            description: 'Message sent after opt-in',
            default: 'You have been subscribed! Reply STOP to unsubscribe.',
          },
        },
      },

      // ===== FORWARDING =====
      forwarding: {
        type: 'object',
        description: 'Forward incoming SMS to other numbers',
        group: 'forwarding',
        properties: {
          enabled: {
            type: 'boolean',
            default: false,
          },
          forwardTo: {
            type: 'array',
            items: { type: 'string' },
            description: 'Phone numbers to forward SMS to',
          },
          includeOriginalMessage: {
            type: 'boolean',
            description: 'Include the original message in forwarded SMS',
            default: true,
          },
          messagePrefix: {
            type: 'string',
            description: 'Prefix for forwarded messages',
            default: 'SMS from {{sender}}: ',
          },
        },
      },

      // ===== AI INTEGRATION =====
      aiAssistant: {
        type: 'object',
        description: 'Default AI assistant for SMS conversations',
        group: 'ai',
        properties: {
          enabled: {
            type: 'boolean',
            description: 'Route all non-keyword SMS to AI assistant',
            default: false,
          },
          assistantId: {
            type: 'string',
            description: 'AI Assistant ID',
          },
          onlyAfterHours: {
            type: 'boolean',
            description: 'Only use AI after business hours',
            default: false,
          },
        },
      },

      // Status
      enabled: {
        type: 'boolean',
        group: 'settings',
        default: true,
      },

      // Priority (for overlapping phone numbers)
      priority: {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        description: 'Higher priority routes are checked first (0-100)',
        group: 'settings',
        default: 50,
      },

      // Stats
      stats: {
        type: 'object',
        group: 'stats',
        properties: {
          totalMessages: { type: 'integer', default: 0 },
          autoRepliesSent: { type: 'integer', default: 0 },
          keywordMatches: { type: 'integer', default: 0 },
          optOuts: { type: 'integer', default: 0 },
          lastMessageAt: { type: 'string', format: 'date-time' },
        },
      },
    },
    required: ['name', 'displayName', 'phoneNumbers', 'enabled'],
  } as const;
};

const smsRoutingSchema = SMSRoutingSchema();
export type SMSRoutingModel = FromSchema<typeof smsRoutingSchema>;

registerCollection('smsRouting', DataType.sms_routing, SMSRoutingSchema());
