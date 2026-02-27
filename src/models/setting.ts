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
      inSmsGateway: getSettingItemSchema(DataType.config, 'in-sms'),
      outSmsGateway: getSettingItemSchema(DataType.config, 'in-sms'),
      inEmailGateway: getSettingItemSchema(DataType.config, 'in-email'),
      outEmailGateway: getSettingItemSchema(DataType.config, 'in-email'),

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
                'mintflow',
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
