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
      emailTemplate: getSettingItemSchema(DataType.messagetemplate, 'email'),
      smsTemplate: getSettingItemSchema(DataType.messagetemplate, 'email'),
      registerEmailTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'register'
      ),
      registerSmsTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'register'
      ),
      profileUpdateEmailTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'profile'
      ),
      profileUpdateSmsTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'profile'
      ),
      passwordChangeEmailTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'change'
      ),
      passwordChangeSmsTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'change'
      ),
      passwordResetEmailTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'password'
      ),
      passwordResetSmsTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'password'
      ),
      newDeviceAlertEmailTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'security'
      ),
      twoFactorCodeEmailTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'security'
      ),
      posReceiptMerchantTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'pos'
      ),
      posReceiptCustomerTemplate: getSettingItemSchema(
        DataType.messagetemplate,
        'pos'
      ),
      posCheckTemplate: getSettingItemSchema(DataType.messagetemplate, 'pos'),
      inSmsGateway: getSettingItemSchema(DataType.config, 'in-sms'),
      outSmsGateway: getSettingItemSchema(DataType.config, 'in-sms'),
      inEmailGateway: getSettingItemSchema(DataType.config, 'in-email'),
      outEmailGateway: getSettingItemSchema(DataType.config, 'out-email'),
      bulkEmailGateway: getSettingItemSchema(DataType.config, 'bulk'),
      bulkSmsGateway: getSettingItemSchema(DataType.config, 'bulk'),
      pushGateway: getSettingItemSchema(DataType.config, 'push-gateway'),
      notificationTemplates: {
        type: 'array',
        collapsible: 'close',
        items: {
          type: 'object',
          collapsible: 'true',
          properties: {
            name: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.collection,
                value: 'name',
                label: 'name',
              },
              group: 'data',
            },
            variant: {
              type: 'string',
              group: 'data',
            },
            emailTemplate: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'name',
                label: 'name',
              },
              items: {
                type: 'string',
              },
              group: 'template',
            },
            smsTemplate: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'name',
                label: 'name',
              },
              items: {
                type: 'string',
              },
              group: 'template',
            },
            webTemplate: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'name',
                label: 'name',
              },
              items: {
                type: 'string',
              },
              group: 'template',
            },
          },
        },
      },
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
      dashboards: {
        type: 'array',
        collapsible: 'close',
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            name: {
              type: 'string',
              'x-control': ControlType.selectMany,
              enum: [
                'site',
                'store',
                'crm',
                'ticket',
                'workflow',
                'lead',
                'event',
                'campaign',
                'social',
                'dashboard',
              ],
              group: 'dashboard',
            },
            dashboard: {
              ...getSettingItemSchema(
                DataType.dataviz,
                'dashboard',
                'name',
                ['title', 'name'],
                { property: 'data.type', value: 'dashboard' }
              ),
            },
          },
        },
      },
      passcodeLoginSettings: {
        type: 'object',
        collapsible: 'close',
        properties: {
          enable: {
            type: 'boolean',
            default: true,
            description:
              'Allow POS passcode login with the BusinessMade employee ID (typed or read from an NFC card)',
          },
          mode: {
            type: 'string',
            enum: ['passcode', 'instant'],
            default: 'passcode',
            description:
              "'passcode' (recommended) = employee ID + 6-digit pin (two-factor). 'instant' = employee ID / card only, no pin (single factor, fastest).",
          },
        },
      },
      /**
       * Bank Sync — the org's default policy for syncing connected banks. Every
       * connected bank inherits this; a single bank can override in its own
       * bank_connection.sync. Lives here (not a datatype) so more bank settings
       * can land without a new schema each time.
       */
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
            description: 'Master switch for automatic bank syncing across all connected banks.',
          },
          paused: {
            type: 'boolean',
            title: 'Pause all syncing',
            default: false,
            description: 'Temporarily stop syncing everything without losing the schedule.',
          },
          transactions: {
            type: 'string',
            title: 'Transaction sync',
            enum: ['realtime', '6h', '12h', 'daily', 'manual'],
            default: 'daily',
            description: 'How often transactions pull in. "realtime" leans on the bank push (webhook); the scheduled sweep is a safety net. "manual" = only when someone clicks Sync.',
          },
          balances: {
            type: 'string',
            title: 'Balance refresh',
            enum: ['onSync', 'daily', 'manual'],
            default: 'daily',
            description: 'How often live balances refresh. Billed per call, so kept separate from transactions.',
          },
          webhook: {
            type: 'boolean',
            title: 'Honor bank push (webhook)',
            default: true,
            description: 'React to the aggregator\'s push notifications for near-real-time updates.',
          },
          applyToNewConnections: {
            type: 'boolean',
            title: 'Apply to new banks',
            default: true,
            description: 'New connections inherit this policy; each can still override.',
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
            description: 'The floor a host cannot request a payout below. A host who sets their own higher minimum keeps it.',
            minimum: 0,
            default: 0,
          },
          gateway: {
            type: 'string',
            title: 'Payment gateway',
            description: 'Where card payments, authorisations and refunds are taken.',
            enum: ['stripe', 'paypal', 'authorize'],
            default: 'stripe',
          },
          holdTtlMinutes: {
            type: 'number',
            title: 'Hold on a cart (minutes)',
            description: 'How long a checkout keeps a space held before it is released back to the calendar.',
            minimum: 1,
            maximum: 1440,
            default: 15,
          },
          appUrl: {
            type: 'string',
            title: 'Customer app URL',
            description: 'Where booking links, pay links, pickup passes and receipts point (with scheme, e.g. https://stowbo.com). The one place this is set; leave empty to use the deployment default.',
          },
          site: {
            type: 'string',
            title: 'Stowbo site',
            description: 'The site the marketplace runs on. Setup creates one named "stowbo" if none exists; change it only to move Stowbo onto another site.',
            'x-control': ControlType.selectSingle,
            dataSource: { source: 'collection', collection: DataType.site, value: 'name', label: 'title' },
          },
        },
      },
      securitySettings: {
        type: 'object',
        collapsible: 'close',
        properties: {
          enableTwoFactorForUsers: {
            type: 'boolean',
            default: false,
            description: 'Allow users to enable 2FA on their accounts',
          },
          enableTwoFactorForCustomers: {
            type: 'boolean',
            default: false,
            description: 'Allow customers to enable 2FA on their accounts',
          },
          enableNewDeviceAuthentication: {
            type: 'boolean',
            default: false,
            description:
              'Require verification when logging in from new device (password login only)',
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
          alertOnNewDeviceLogin: {
            type: 'boolean',
            default: false,
            description: 'Send email alert when login from new device',
          },
          deviceTrustDays: {
            type: 'number',
            default: 30,
            description: 'Days to remember trusted devices',
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
