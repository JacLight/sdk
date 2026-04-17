import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * Phone Routing Schema
 *
 * Routes phone numbers to IVR flows based on business hours, holidays, and off days.
 * Supports different flows for normal hours, after hours, and holidays.
 */

export const IVRRoutingSchema = () => {
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

      // Business Hours Configuration
      businessHours: {
        type: 'object',
        group: 'schedule',
        properties: {
          enabled: {
            type: 'boolean',
            description: 'Route to different flows based on time of day',
            default: false,
          },

          // Office Hours
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
                  items: {
                    type: 'string',
                  },
                  dataSource: {
                    source: 'json',
                    json: [
                      'All',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ],
                  },
                },
                timezone: {
                  type: 'string',
                  'x-control': 'ControlType.select',
                  dataSource: {
                    source: 'function',
                    value: 'timezones',
                  },
                  default:
                    '{{fn:Intl.DateTimeFormat().resolvedOptions().timeZone}}',
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

          // Holidays
          holidays: {
            type: 'array',
            description:
              'Special dates when business is closed or has different hours',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'date',
                  description: 'Holiday date (YYYY-MM-DD)',
                },
                name: {
                  type: 'string',
                  maxLength: 100,
                  description: 'e.g., Christmas, New Year',
                },
                closed: {
                  type: 'boolean',
                  description: 'Business is completely closed on this day',
                  default: true,
                },
              },
              required: ['date', 'name'],
            },
          },

          // Off Days
          offDays: {
            type: 'array',
            description:
              'Specific dates when business is closed (not holidays)',
            items: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  format: 'date',
                  description: 'Off day date (YYYY-MM-DD)',
                },
                description: {
                  type: 'string',
                  maxLength: 200,
                  description:
                    'Why business is closed (e.g., Team retreat, Early closure)',
                },
              },
              required: ['date', 'description'],
            },
          },
        },
      },

      // Routing Type
      routingType: {
        type: 'string',
        enum: ['forward', 'ai-assistant', 'simple_menu', 'automation_flow'],
        description:
          'forward = ring targets, ai-assistant = AI answers and routes, simple_menu = press buttons, automation_flow = full workflow',
        default: 'forward',
        group: 'routing',
      },

      // ===== SIMPLE MENU CONFIGURATION =====
      // Define all menus once, reference them by ID for different time periods

      // Menu Definitions (reusable menus)
      menus: {
        type: 'array',
        description: 'Define all menus here, then assign to time periods below',
        group: 'routing',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique identifier (e.g., main-menu, sales-menu)',
            },
            name: {
              type: 'string',
              description: 'Descriptive name for this menu',
            },
            greeting: {
              type: 'string',
              maxLength: 500,
              description:
                'What callers hear via TTS (ignored if greetingAudioUrl is set)',
              'x-control-variant': 'textarea',
            },
            aiInstructions: {
              type: 'string',
              maxLength: 1000,
              description:
                'Instructions for AI assistant — when to route callers to this menu group, what this department handles',
              'x-control-variant': 'textarea',
            },
            greetingAudioUrl: {
              type: 'string',
              format: 'uri',
              description:
                'Pre-recorded audio file URL (MP3/WAV) — overrides TTS greeting for professional sound',
            },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  digit: {
                    type: 'string',
                    enum: [
                      '1',
                      '2',
                      '3',
                      '4',
                      '5',
                      '6',
                      '7',
                      '8',
                      '9',
                      '0',
                      '*',
                      '#',
                    ],
                  },
                  label: {
                    type: 'string',
                    maxLength: 100,
                    description: 'e.g., Sales, Support, Billing',
                  },
                  action: {
                    type: 'string',
                    enum: [
                      'transfer-phone',
                      'transfer-user',
                      'transfer-group',
                      'transfer-queue',
                      'forward',
                      'ai-assistant',
                      'voicemail',
                      'send-sms',
                      'trigger-automation',
                      'collect-payment',
                      'verify-caller',
                      'play-consent',
                      'custom-webhook',
                      'menu',
                      'start-recording',
                      'pause-recording',
                      'resume-recording',
                      'hangup',
                    ],
                    default: 'transfer-phone',
                    description:
                      'Action to take. Use "transfer-user" to route to an individual user/agent, "transfer-group" to route to a user group (rings all/round-robin based on groupStrategy).',
                  },
                  actionParams: {
                    type: 'string',
                    description:
                      'Target identifier based on action type: phone number (transfer-phone), user name or sk (transfer-user), user group name or sk (transfer-group), queue name (transfer-queue), menu ID, automation ID, SMS message, etc.',
                  },
                  groupStrategy: {
                    type: 'string',
                    enum: ['ring-all', 'round-robin', 'longest-idle', 'skill-based', 'sequential'],
                    description: 'Only used when action is "transfer-group". How to pick which group member to ring.',
                    default: 'ring-all',
                  },
                },
                required: ['digit', 'label', 'action'],
              },
            },
            // Behavior settings
            timeout: {
              type: 'integer',
              minimum: 3,
              maximum: 30,
              description: 'How long to wait for caller input',
              default: 5,
            },
            maxRetries: {
              type: 'integer',
              minimum: 1,
              maximum: 5,
              description: 'Times to repeat menu before hanging up',
              default: 3,
            },
            invalidMessage: {
              type: 'string',
              maxLength: 200,
              description: 'What to say for invalid selections',
              default: 'Invalid selection. Please try again.',
            },
            defaultAction: {
              type: 'object',
              description: 'What to do if no key is pressed after all retries',
              properties: {
                action: {
                  type: 'string',
                  enum: [
                    'forward',
                    'transfer-phone',
                    'transfer-user',
                    'transfer-group',
                    'transfer-queue',
                    'voicemail',
                    'ai-assistant',
                    'trigger-automation',
                    'hangup',
                  ],
                  default: 'voicemail',
                },
                actionParams: {
                  type: 'string',
                  description:
                    'Target identifier: phone number, user name/sk, group name/sk, queue name, etc. based on action type.',
                },
                groupStrategy: {
                  type: 'string',
                  enum: ['ring-all', 'round-robin', 'longest-idle', 'skill-based', 'sequential'],
                  description: 'Only used when action is "transfer-group".',
                  default: 'ring-all',
                },
                message: {
                  type: 'string',
                  maxLength: 200,
                  description: 'Message before executing default action',
                  default: 'We did not receive your selection.',
                },
              },
            },
          },
          required: ['id', 'name', 'greeting', 'options'],
        },
      },

      // Time Period Menu Assignments
      menuAssignments: {
        type: 'object',
        description: 'Which menu to use for each time period',
        group: 'routing',
        properties: {
          normalHours: {
            type: 'string',
            description: 'Menu ID for business hours',
          },
          afterHours: {
            type: 'string',
            description: 'Menu ID for outside business hours',
          },
          holiday: {
            type: 'string',
            description: 'Menu ID for holidays',
          },
        },
        required: ['normalHours'],
      },

      // Global Settings
      menuSettings: {
        type: 'object',
        group: 'routing',
        properties: {
          language: {
            type: 'string',
            'x-control': 'ControlType.select',
            enum: [
              'en-US',
              'en-GB',
              'es-ES',
              'fr-FR',
              'de-DE',
              'pt-BR',
              'it-IT',
              'ja-JP',
              'ko-KR',
              'zh-CN',
            ],
            default: 'en-US',
          },
          voice: {
            type: 'string',
            'x-control': 'ControlType.select',
            description:
              'TTS voice — use Neural/WaveNet for natural-sounding speech',
            enum: [
              'Polly.Joanna-Neural',
              'Polly.Matthew-Neural',
              'Polly.Amy-Neural',
              'Polly.Brian-Neural',
              'Polly.Lupe-Neural',
              'Polly.Pedro-Neural',
              'Polly.Lea-Neural',
              'Polly.Remi-Neural',
              'Polly.Vicki-Neural',
              'Polly.Daniel-Neural',
              'Google.en-US-Wavenet-F',
              'Google.en-US-Wavenet-D',
              'Google.es-US-Wavenet-A',
              'Google.fr-FR-Wavenet-A',
              'Polly.Joanna',
              'Polly.Matthew',
              'alice',
            ],
            default: 'Polly.Joanna-Neural',
          },
          recording: {
            type: 'object',
            description: 'Call recording configuration',
            properties: {
              enabled: {
                type: 'boolean',
                description: 'Enable call recording globally',
                default: false,
              },
              mode: {
                type: 'string',
                enum: [
                  'all',
                  'inbound_only',
                  'outbound_only',
                  'menu_triggered',
                ],
                description: 'When to record calls',
                default: 'all',
              },
              transcriptionEnabled: {
                type: 'boolean',
                description: 'Auto-transcribe recordings',
                default: true,
              },
              notifyCallers: {
                type: 'boolean',
                description: 'Play recording disclosure to callers',
                default: true,
              },
              notificationMessage: {
                type: 'string',
                description: 'Recording disclosure message',
                default: 'This call may be recorded for quality purposes.',
              },
              pauseResumeEnabled: {
                type: 'boolean',
                description:
                  'Allow pausing/resuming recording (e.g., for PCI compliance)',
                default: false,
              },
              retentionDays: {
                type: 'integer',
                minimum: 1,
                maximum: 365,
                description: 'Days to keep recordings before auto-delete',
                default: 90,
              },
            },
          },
          voicemailEnabled: {
            type: 'boolean',
            default: true,
          },
          voicemailEmail: {
            type: 'string',
            format: 'email',
            description: 'Where to send voicemail notifications',
          },
          maxRecordingDuration: {
            type: 'integer',
            minimum: 30,
            maximum: 600,
            default: 120,
          },
        },
      },

      // ===== AUTOMATION FLOW CONFIGURATION =====
      // For advanced scenarios requiring automation workflows

      automationAssignments: {
        type: 'object',
        description: 'Use automation workflows instead of simple menus',
        group: 'routing',
        properties: {
          normalHours: {
            type: 'string',
            description: 'Automation workflow ID for business hours',
          },
          afterHours: {
            type: 'string',
            description: 'Automation workflow ID for after hours',
          },
          holiday: {
            type: 'string',
            description: 'Automation workflow ID for holidays',
          },
        },
      },

      // ===== FORWARDING GROUPS =====
      // Define reusable forwarding groups, then reference by ID from:
      //   - routingType "forward" → forwardingGroupId
      //   - menu option action "forward" → actionParams = group ID
      //   - defaultAction "forward" → actionParams = group ID
      forwardingGroups: {
        type: 'array',
        description:
          'Define forwarding/ring groups. Reference by ID from routing or menu actions.',
        group: 'forwarding',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique ID (e.g., sales-team, on-call)',
            },
            name: {
              type: 'string',
              description: 'Display name',
            },
            strategy: {
              type: 'string',
              enum: ['simultaneous', 'sequential', 'round-robin'],
              description:
                'simultaneous = ring all at once, sequential = one by one in order, round-robin = rotate starting target each call',
              default: 'simultaneous',
            },
            targets: {
              type: 'array',
              description: 'Numbers/agents to ring',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['phone', 'agent', 'queue', 'sip'],
                    default: 'phone',
                  },
                  value: {
                    type: 'string',
                    description:
                      'Phone number, agent ID, queue name, or SIP URI',
                  },
                  label: {
                    type: 'string',
                    description: 'Display name (e.g., "John Mobile")',
                  },
                },
                required: ['type', 'value'],
              },
            },
            ringDuration: {
              type: 'integer',
              minimum: 5,
              maximum: 60,
              description: 'Seconds to ring before giving up or trying next',
              default: 20,
            },
            whisper: {
              type: 'object',
              description: 'Whisper announcement to person answering',
              properties: {
                enabled: { type: 'boolean', default: false },
                message: {
                  type: 'string',
                  default: 'Incoming call from {{caller}}',
                },
              },
            },
            screening: {
              type: 'object',
              description: 'Require key press to accept call',
              properties: {
                enabled: { type: 'boolean', default: false },
                message: {
                  type: 'string',
                  default:
                    'Press 1 to accept this call, or hang up to decline.',
                },
              },
            },
            fallback: {
              type: 'string',
              enum: ['voicemail', 'ai-assistant', 'automation', 'hangup'],
              description: 'What to do if no one answers',
              default: 'voicemail',
            },
            fallbackAutomationId: {
              type: 'string',
              description: 'Automation to run if fallback is "automation"',
            },
          },
          required: ['id', 'name', 'targets'],
        },
      },

      // ===== FORWARD ROUTING CONFIG =====
      // Used when routingType is "forward"
      forwardConfig: {
        type: 'object',
        description:
          'Config for routingType "forward" — which group to ring, optional greeting',
        group: 'forwarding',
        properties: {
          forwardingGroupId: {
            type: 'string',
            description: 'ID of forwarding group to ring',
          },
          greeting: {
            type: 'string',
            maxLength: 500,
            description:
              'Optional greeting before ringing (leave empty to skip)',
            'x-control-variant': 'textarea',
          },
        },
      },

      // ===== AI ASSISTANT CONFIG =====
      // Used when routingType is "ai-assistant"
      aiAssistantConfig: {
        type: 'object',
        description:
          'Config for AI-powered call handling — AI answers, converses, and routes',
        group: 'routing',
        properties: {
          assistantId: {
            type: 'string',
            description: 'AI assistant ID to handle the call',
          },
          greeting: {
            type: 'string',
            maxLength: 500,
            description:
              'Initial greeting the AI speaks (e.g., "Hi, thanks for calling Acme. How can I help you?")',
            'x-control-variant': 'textarea',
          },
          context: {
            type: 'string',
            maxLength: 2000,
            description:
              'System prompt / context for the AI (business info, what it can help with, transfer rules)',
            'x-control-variant': 'textarea',
          },
          voice: {
            type: 'string',
            title: 'AI Voice',
            description: 'Voice for OpenAI Realtime API',
            enum: [
              'alloy',
              'echo',
              'shimmer',
              'ash',
              'ballad',
              'coral',
              'sage',
              'verse',
            ],
            default: 'coral',
          },
          language: {
            type: 'string',
            description: 'Language code (e.g., en-US, es-ES)',
            default: 'en-US',
          },
          canTransfer: {
            type: 'boolean',
            description:
              'Allow AI to transfer calls to forwarding groups (AI derives routing from menus and forwarding groups config)',
            default: true,
          },
          fallbackForwardingGroupId: {
            type: 'string',
            description: 'Forwarding group if AI cannot resolve the request',
          },
          maxDuration: {
            type: 'integer',
            minimum: 30,
            maximum: 600,
            description: 'Max seconds for AI conversation before transferring',
            default: 120,
          },
          phoneConfigId: {
            type: 'string',
            description: 'Phone config reference for WebSocket connection',
          },
        },
      },

      // ===== MISSED CALL ACTIONS =====
      // Array of actions to execute when a call is missed
      missedCallActions: {
        type: 'array',
        description: 'Actions to execute on missed call',
        group: 'missed_call',
        items: {
          type: 'object',
          properties: {
            // Common fields
            type: {
              type: 'string',
              enum: ['sms', 'email', 'lead', 'automation', 'webhook'],
            },
            name: {
              type: 'string',
            },
            enabled: {
              type: 'boolean',
              default: true,
            },
            businessHoursOnly: {
              type: 'boolean',
              default: false,
            },

            // SMS: to (string: "caller" or phone), message, cooldownMinutes
            // Email: to (array of emails), subject, message, template
            // Lead: leadAssignTo, leadTags, leadSource, leadStatus
            // Automation: automationId, automationData
            // Webhook: webhookUrl, webhookMethod, webhookHeaders

            to: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } },
              ],
              description:
                'SMS: "caller" or phone number. Email: array of email addresses',
            },
            message: {
              type: 'string',
              description:
                'Message content (SMS body or Email body HTML). Supports {{caller}}, {{business_name}}, {{time}}',
              'x-control-variant': 'textarea',
            },
            cooldownMinutes: {
              type: 'integer',
              minimum: 1,
              maximum: 1440,
              default: 60,
              description:
                'SMS: minutes between sending repeated messages to same number',
            },
            subject: {
              type: 'string',
              description: 'Email subject line',
            },
            template: {
              type: 'string',
              description: 'Email template ID (optional, overrides message)',
            },
            leadAssignTo: {
              type: 'string',
              description: 'Lead: agent/queue to assign',
            },
            leadTags: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lead: tags to add',
            },
            leadSource: {
              type: 'string',
              description: 'Lead: source value',
              default: 'missed-call',
            },
            leadStatus: {
              type: 'string',
              description: 'Lead: initial status',
              default: 'new',
            },
            automationId: {
              type: 'string',
              description: 'Automation: workflow ID to trigger',
            },
            automationData: {
              type: 'object',
              additionalProperties: true,
              description: 'Automation: extra data to pass',
            },
            webhookUrl: {
              type: 'string',
              format: 'uri',
              description: 'Webhook: URL to call',
            },
            webhookMethod: {
              type: 'string',
              enum: ['GET', 'POST'],
              default: 'POST',
              description: 'Webhook: HTTP method',
            },
            webhookHeaders: {
              type: 'object',
              additionalProperties: { type: 'string' },
              description: 'Webhook: custom headers',
            },
          },
          required: ['type'],
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
      stats: {
        type: 'object',
        group: 'stats',
        properties: {
          totalCalls: {
            type: 'integer',
            default: 0,
          },
          normalHoursCalls: {
            type: 'integer',
            default: 0,
          },
          afterHoursCalls: {
            type: 'integer',
            default: 0,
          },
          holidayCalls: {
            type: 'integer',
            default: 0,
          },
          lastUsed: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
    },
    required: ['name', 'displayName', 'phoneNumbers', 'routingType', 'enabled'],
  } as const;
};

const ivrRoutingSchema = IVRRoutingSchema();
export type IVRRoutingModel = FromSchema<typeof ivrRoutingSchema>;

registerCollection('ivrRouting', DataType.ivr_routing, IVRRoutingSchema());
