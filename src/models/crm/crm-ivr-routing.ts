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
        enum: ['simple_menu', 'automation_flow'],
        description: 'Simple menu (press buttons) or advanced automation',
        default: 'simple_menu',
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
              description: 'What callers hear (supports {{variables}})',
              'x-control-variant': 'textarea',
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
                      'transfer-agent',
                      'transfer-queue',
                      'ai-assistant',
                      'voicemail',
                      'trigger-automation',
                      'collect-payment',
                      'verify-caller',
                      'play-consent',
                      'custom-webhook',
                      'menu',
                      'hangup',
                    ],
                    default: 'transfer-phone',
                  },
                  actionParams: {
                    type: 'string',
                    description:
                      'Phone number, agent ID, queue name, menu ID, automation ID, etc. based on action type',
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
            description:
              'Twilio voice name (e.g., alice, man, woman, or Amazon Polly voice)',
            default: 'alice',
          },
          recordCalls: {
            type: 'boolean',
            default: false,
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
