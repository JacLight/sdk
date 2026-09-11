import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';

export const SettingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        title: 'Setting Name',
        readOnly: true,
        transform: 'uri',
        group: 'settings',
      },
      orgId: {
        type: 'string',
        format: 'email',
        readOnly: true,
        group: 'settings',
      },
      systemEmail: {
        type: 'string',
        format: 'email',
        group: 'system-info',
      },
      systemPhone: {
        type: 'string',
        group: 'system-info',
      },
      systemSmsPhone: {
        type: 'string',
        title: 'Default SMS Number',
        group: 'system-info',
      },
      emails: {
        type: 'array',
        items: {
          type: 'string',
          format: 'email',
        },
        group: 'emails',
      },
      phones: {
        type: 'array',
        items: {
          type: 'string',
        },
        group: 'emails',
      },
      address: getSettingItemSchema(
        DataType.location,
        'address',
        'name',
        undefined,
        { property: 'data.type', value: 'address' }
      ),
      domainAccountId: {
        type: 'string',
        readOnly: true,
        group: 'domain',
      },
      domainContactId: {
        type: 'string',
        readOnly: true,
        group: 'domain',
      },
      // Template selection is NOT stored here. A notification resolves its
      // template from the messagetemplate collection itself — by name when the
      // caller asks for one, otherwise by the template's own datatype +
      // variant, falling back to the shipped defaults in
      // src/tools/templates/default-email-templates.ts. To override a mail,
      // clone the shipped template into the org with the same datatype/variant.
      //
      // Gateway selection is NOT stored here either. A config IS the gateway:
      // what it can do comes from its provider (sendEmail, getEmails,
      // sendBulkEmail, addDomain...) and `config.data.priority` picks between
      // several that can do the same thing. Inbound mail syncs from
      // every mailbox config, not one chosen winner. SMS goes out through the
      // provider on the phone record it sends from, and bulk email through the
      // sender account the broadcast names.
      notificationCopyTo: {
        type: 'object',
        collapsible: 'close',
        properties: {
          order: getNotificationCopySchema(),
          reservation: getNotificationCopySchema(),
          event: getNotificationCopySchema(),
        },
      },
      socialMediaSync: {
        type: 'array',
        collapsible: 'close',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            platform: {
              type: 'string',
              'x-control': ControlType.selectMany,
              enum: [
                'facebook',
                'twitter',
                'linkedin',
                'instagram',
                'youtube',
                'pinterest',
                'tiktok',
                'snapchat',
                'whatsapp',
                'email',
                'sms',
              ],
            },
            accountId: {
              type: 'string',
            },
            sync: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              items: {
                type: 'string',
              },
              dataSource: {
                source: 'function',
                json: [
                  'all',
                  'post',
                  'feed',
                  'messages',
                  'reactions',
                  'engagement',
                  'comments',
                  'notifications',
                  'insights',
                  'leads',
                  'ads',
                ],
              },
            },
            config: getSettingItemSchema(DataType.config, ''),
          },
        },
      },

      /**
       * Bank Sync — the org's default policy for syncing connected banks. Every
       * connected bank inherits this; a single bank can override in its own
       * bank_connection.sync. Lives here (not a datatype) so more bank settings
       * can land without a new schema each time.
       */
      scheduling: {
        type: 'object',
        title: 'Staff Scheduling',
        collapsible: 'close',
        group: 'scheduling',
        properties: {
          shiftTemplates: {
            type: 'array',
            title: 'Shift times',
            description:
              'The named time ranges this business actually works — opening, close, brunch, press run. Managers pick one instead of typing times.',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', title: 'Id' },
                name: {
                  type: 'string',
                  title: 'Name',
                  description: 'e.g. Opening, Day, Sundown, Night, Double',
                },
                startTime: {
                  type: 'string',
                  title: 'Start',
                  description: '24h HH:mm',
                },
                endTime: {
                  type: 'string',
                  title: 'End',
                  description:
                    '24h HH:mm. Earlier than start runs past midnight.',
                },
                breakMinutes: {
                  type: 'number',
                  title: 'Unpaid break (min)',
                  default: 0,
                },
                roles: {
                  type: 'array',
                  title: 'Roles',
                  description:
                    'Roles this shift is normally worked by. Empty means any role.',
                  items: { type: 'string' },
                },
                color: { type: 'string', title: 'Colour' },
                subdivisions: {
                  type: 'array',
                  title: 'Sub-divisions',
                  description:
                    'Optional. Break this shift into named parts — Kitchen, Cleaning, Pass — each with the number you are aiming for. A target, not a limit.',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string', title: 'Name' },
                      capacity: {
                        type: 'number',
                        title: 'People wanted',
                        default: 1,
                      },
                    },
                  },
                },
                days: {
                  type: 'array',
                  title: 'Days it runs',
                  description:
                    'One entry per day of the pattern — by weekday when weekly, by cycle day when on a cycle — each with its own hours and headcount.',
                  items: {
                    type: 'object',
                    properties: {
                      day: {
                        type: 'string',
                        enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                        description: 'Weekly patterns only.',
                      },
                      index: {
                        type: 'number',
                        description:
                          'Cycle patterns only — day 1..N of the cycle.',
                      },
                      startTime: {
                        type: 'string',
                        description: 'Overrides the shift start on this day.',
                      },
                      endTime: {
                        type: 'string',
                        description: 'Overrides the shift end on this day.',
                      },
                      headcount: {
                        type: 'number',
                        description:
                          'How many people this shift needs on this day.',
                      },
                      off: {
                        type: 'boolean',
                        default: false,
                        description: 'This shift does not run on this day.',
                      },
                    },
                  },
                },
                headcount: {
                  type: 'number',
                  title: 'People needed',
                  default: 1,
                  description:
                    'Default headcount when a day does not override it.',
                },
              },
            },
          },
          operatingHours: {
            type: 'array',
            title: 'Operating hours',
            description:
              'When the business is open, per weekday. Shifts outside these hours are flagged.',
            items: {
              type: 'object',
              properties: {
                day: {
                  type: 'string',
                  enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
                },
                open: { type: 'string' },
                close: { type: 'string' },
                closed: { type: 'boolean', default: false },
              },
            },
          },
          patternType: {
            type: 'string',
            enum: ['weekly', 'cycle'],
            default: 'weekly',
            title: 'Schedule pattern',
            description:
              'How this business schedules. Weekly is Mon–Sun. A cycle repeats every N days regardless of weekday — a 10, 14 or 30 day rota. Every shift follows it.',
          },
          cycleDays: {
            type: 'number',
            default: 7,
            title: 'Cycle length (days)',
            description:
              'How many days before the pattern repeats. A week is simply a cycle of 7.',
          },
          cycleStart: {
            type: 'string',
            format: 'date',
            title: 'Cycle starts on',
            description:
              'The date day 1 of the cycle falls on. Without it a cycle cannot be placed on a calendar.',
          },
          planningHorizonDays: {
            type: 'number',
            title: 'Plan ahead by',
            default: 7,
            description:
              'How many days a schedule covers. Businesses plan in 3 days, 5 days, a week, a fortnight — this is that length, not a fixed week.',
          },
          planningMode: {
            type: 'string',
            enum: ['fixed', 'rolling'],
            default: 'fixed',
            title: 'How the period moves',
            description:
              'Fixed publishes whole blocks ("the fortnight of the 7th"). Rolling always shows the next N days from today.',
          },
          weekStartsOn: {
            type: 'string',
            enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            default: 'mon',
            title: 'Period starts on',
            description:
              "The day a fixed period begins. A bar's week does not start on Monday.",
          },
        },
      },
      leave: {
        type: 'object',
        title: 'Time off & leave',
        collapsible: 'close',
        group: 'leave',
        description:
          'Org-wide leave configuration. Per-location overrides live in the `leaveLocations` named entries (keyed by location slug), the same way scheduling does.',
        properties: {
          unit: {
            type: 'string',
            enum: ['days', 'hours'],
            default: 'days',
            title: 'Counted in',
            description:
              "What this business counts leave in. Balances, requests and reports live in this unit — nothing is converted behind anyone's back.",
          },
          leaveYear: {
            type: 'object',
            title: 'Leave year',
            properties: {
              type: {
                type: 'string',
                enum: ['calendar', 'fiscal', 'anniversary'],
                default: 'calendar',
                title: 'Runs',
              },
              fiscalStartMonth: {
                type: 'number',
                minimum: 1,
                maximum: 12,
                title: 'Fiscal year starts (month)',
                description: 'Only for a fiscal leave year. 1 = January.',
              },
            },
          },
          workingDays: {
            type: 'array',
            title: 'Working days',
            description:
              "Days that count as working days by default. A location can override; a person's work schedule overrides both.",
            items: {
              type: 'string',
              enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
            },
            default: ['mon', 'tue', 'wed', 'thu', 'fri'],
          },
          hrUsers: {
            type: 'array',
            title: 'Who is HR',
            description:
              'Emails of the people who are the last step of every approval flow and get setup alerts. The org owner and anyone with Owner / ConfigAdmin are always included.',
            items: { type: 'string' },
          },
          approval: {
            type: 'object',
            title: 'Approval flow',
            properties: {
              baseFlow: {
                type: 'string',
                enum: ['supervisor-hr', 'manager-hr', 'hr'],
                default: 'supervisor-hr',
                title: 'Base flow',
                description:
                  "supervisor-hr: the person's supervisor decides, HR if none or on escalation. manager-hr: the site's manager decides. hr: every request goes straight to HR.",
              },
              escalateAfterDays: {
                type: 'number',
                default: 3,
                title: 'Escalate after (days)',
                description:
                  'Days with no decision before the request moves to the next step of the flow and the employee is told.',
              },
              dailyDigest: {
                type: 'boolean',
                default: true,
                title: 'Daily digest',
                description:
                  'Once a day, tell each approver what is waiting on them.',
              },
            },
          },
          jobLevels: {
            type: 'array',
            title: 'Job levels',
            description:
              'The ladder this org uses (Crew · Senior · Lead · Manager · Director) and which job titles sit on each rung. Entitlement policies target levels, so the ladder is what makes "leave depends on your role" work with the titles HR already uses.',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', title: 'Id' },
                name: { type: 'string', title: 'Name' },
                rank: {
                  type: 'number',
                  title: 'Rank',
                  description: '1 = most junior.',
                },
                titles: {
                  type: 'array',
                  title: 'Job titles on this level',
                  items: { type: 'string' },
                },
              },
            },
          },
          holidaySource: {
            type: 'string',
            enum: ['suggest', 'manual'],
            default: 'suggest',
            title: 'Public holidays',
            description:
              "suggest: propose each year's public holidays per location from its country; the org keeps, drops and renames them freely. manual: enter them by hand.",
          },
        },
      },
      bank: {
        type: 'object',
        title: 'Bank Sync',
        collapsible: 'close',
        group: 'bank',
        properties: {
          enabled: {
            type: 'boolean',
            title: 'Auto-sync',
            default: true,
            description:
              'Master switch for automatic bank syncing across all connected banks.',
          },
          paused: {
            type: 'boolean',
            title: 'Pause all syncing',
            default: false,
            description:
              'Temporarily stop syncing everything without losing the schedule.',
          },
          transactions: {
            type: 'string',
            title: 'Transaction sync',
            enum: ['realtime', '6h', '12h', 'daily', 'manual'],
            default: 'daily',
            description:
              'How often transactions pull in. "realtime" leans on the bank push (webhook); the scheduled sweep is a safety net. "manual" = only when someone clicks Sync.',
          },
          balances: {
            type: 'string',
            title: 'Balance refresh',
            enum: ['onSync', 'daily', 'manual'],
            default: 'daily',
            description:
              'How often live balances refresh. Billed per call, so kept separate from transactions.',
          },
          webhook: {
            type: 'boolean',
            title: 'Honor bank push (webhook)',
            default: true,
            description:
              "React to the aggregator's push notifications for near-real-time updates.",
          },
          applyToNewConnections: {
            type: 'boolean',
            title: 'Apply to new banks',
            default: true,
            description:
              'New connections inherit this policy; each can still override.',
          },
        },
      },

      /**
       * Stowbo Config — the storage marketplace's own numbers, set by the platform
       * operator from the console and applied live. Every Stowbo money rule reads
       * from here; the deployment's env values are only the defaults.
       */
      stowbo: {
        type: 'object',
        title: 'Stowbo Config',
        hidden: true,
        collapsible: 'close',
        group: 'stowbo',
        properties: {
          takeRate: {
            type: 'number',
            title: 'Take rate (%)',
            description:
              "The platform's share of what a host earns on a booking, in percent (1 = 1%). Taken at settle on the earnable amount: the bill minus tax and minus platform fee lines. A booking already settled keeps the rate it was settled at.",
            minimum: 0,
            maximum: 100,
            default: 1,
          },
          minPayout: {
            type: 'number',
            title: 'Minimum payout',
            description:
              'The floor a host cannot request a payout below. A host who sets their own higher minimum keeps it.',
            minimum: 0,
            default: 0,
          },
          gateway: {
            type: 'string',
            title: 'Payment gateway',
            description:
              'Where card payments, authorisations and refunds are taken.',
            enum: ['stripe', 'paypal', 'authorize'],
            default: 'stripe',
          },
          holdTtlMinutes: {
            type: 'number',
            title: 'Hold on a cart (minutes)',
            description:
              'How long a checkout keeps a space held before it is released back to the calendar.',
            minimum: 1,
            maximum: 1440,
            default: 15,
          },
          appUrl: {
            type: 'string',
            title: 'Customer app URL',
            description:
              'Where booking links, pay links, pickup passes and receipts point (with scheme, e.g. https://stowbo.com). The one place this is set; leave empty to use the deployment default.',
          },
          site: {
            type: 'string',
            title: 'Stowbo site',
            description:
              'The site the marketplace runs on. Setup creates one named "stowbo" if none exists; change it only to move Stowbo onto another site.',
            'x-control': ControlType.selectSingle,
            dataSource: {
              source: 'collection',
              collection: DataType.site,
              value: 'name',
              label: 'title',
            },
          },
        },
      },
      securitySettings: {
        type: 'object',
        collapsible: 'close',
        properties: {
          passcodeLogin: {
            type: 'boolean',
            group: 'passcodeLogin',
            default: true,
            description:
              'Allow POS passcode login with the BusinessMade employee ID (typed or read from an NFC card)',
          },
          passcodeLoginMode: {
            type: 'string',
            enum: ['passcode', 'instant'],
            default: 'passcode',
            group: 'passcodeLogin',
            description:
              "'passcode' (recommended) = employee ID + 6-digit pin (two-factor). 'instant' = employee ID / card only, no pin (single factor, fastest).",
          },
          enableTwoFactorForUsers: {
            type: 'boolean',
            default: false,
            description: 'Require 2FA for every user in this organisation',
            notes: 'Off does not mean nobody has it — anyone can still turn 2FA on for their own account.',
            group: '2fa',
          },
          enableTwoFactorForCustomers: {
            type: 'boolean',
            default: false,
            description: 'Require 2FA for every customer in this organisation',
            notes: 'Off does not mean nobody has it — a customer can still turn 2FA on for their own account.',
            group: '2fa',
          },
          twoFactorMethods: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['email', 'authenticator', 'sms'],
            },
            default: ['email', 'authenticator'],
            description: 'Available 2FA methods. SMS incurs additional costs.',
          },
          enableNewDeviceAuthentication: {
            type: 'boolean',
            default: false,
            description:
              'Require verification when logging in from new device (password login only)',
            group: 'newdevice',
          },
          alertOnNewDeviceLogin: {
            type: 'boolean',
            default: false,
            description: 'Send email alert when login from new device',
            group: 'newdevice',
          },
          deviceTrustDays: {
            type: 'number',
            default: 30,
            description: 'Days to remember trusted devices',
            group: 'newdevice',
          },
        },
      },
    },
  } as const;
};

const getNotificationCopySchema = () =>
  ({
    type: 'object',
    properties: {
      enable: {
        type: 'boolean',
      },
      to: {
        type: 'string',
      },
      deliveryType: {
        type: 'string',
        enum: ['email', 'sms', 'push'],
        default: 'email',
      },
    },
  } as const);

const getSettingItemSchema = (
  datatype: DataType,
  group = '',
  valueKey = 'sk',
  labelKey?: string | string[],
  filter?: any
) =>
  ({
    type: 'string',
    'x-control': ControlType.selectMany,
    dataSource: {
      source: 'collection',
      collection: datatype,
      valueField: valueKey,
      labelField: labelKey || 'name',
      filter,
    },
    group: group,
  } as const);

const usgh = SettingSchema();

type SettingModel = FromSchema<typeof usgh>;

type BaseSettingType = keyof typeof usgh.properties;
const BaseSettingKeys: { [key in BaseSettingType]?: BaseSettingType } = {};
Object.keys(usgh.properties).forEach(
  (key: string) =>
    (BaseSettingKeys[key as BaseSettingType] = key as BaseSettingType)
);
export { SettingModel, BaseSettingType, BaseSettingKeys };

registerCollection('Setting', DataType.setting, SettingSchema());
