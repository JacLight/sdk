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
      address: getSettingItemSchema(DataType.location, 'address', 'name', undefined, { property: 'type', value: 'address' }),
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
      registerEmailTemplate: getSettingItemSchema(DataType.messagetemplate, 'register'),
      registerSmsTemplate: getSettingItemSchema(DataType.messagetemplate, 'register'),
      profileUpdateEmailTemplate: getSettingItemSchema(DataType.messagetemplate, 'profile'),
      profileUpdateSmsTemplate: getSettingItemSchema(DataType.messagetemplate, 'profile'),
      passwordChangeEmailTemplate: getSettingItemSchema(DataType.messagetemplate, 'change'),
      passwordChangeSmsTemplate: getSettingItemSchema(DataType.messagetemplate, 'change'),
      passwordResetEmailTemplate: getSettingItemSchema(DataType.messagetemplate, 'password'),
      passwordResetSmsTemplate: getSettingItemSchema(DataType.messagetemplate, 'password'),
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
        }
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
              enum: ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube', 'pinterest', 'tiktok', 'snapchat', 'whatsapp', 'email', 'sms'],
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
                json: ['all', 'post', 'feed', 'messages', 'reactions', 'engagement', 'comments', 'notifications', 'insights', 'leads', 'ads'],
              }
            },
            config: getSettingItemSchema(DataType.config, '')
          },
        }
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
              enum: ['site', 'store', 'crm', 'ticket', 'mintflow', 'workflow', 'lead', 'event', 'campaign', 'social', 'dashboard'],
              group: 'dashboard',
            },
            dashboard: {
              ...getSettingItemSchema(DataType.dataviz, 'dashboard', 'name', ['title', 'name'], { property: 'type', value: 'dashboard' }),
            },
          },
        }
      },
      themeSettings: {
        type: 'array',
        collapsible: 'close',
        items: {
          type: 'object',
          title: '{{name}}',
          collapsible: 'close',
          properties: {
            name: {
              type: 'string',
              maxItems: 1,
              dataSource: {
                source: 'function',
                value: 'getThemeSettingsList',
              },
            },
            darkMode: {
              type: 'string',
              enum: ['auto', 'dark', 'light'],
            },
            energy: {
              type: 'string',
            },
            settings: {
              type: 'array',
              layout: 'horizontal',
              items: {
                type: 'object',
                layout: 'horizontal',
                showIndex: true,
                properties: {
                  property: {
                    type: 'string',
                  },
                  value: {
                    type: 'string',
                  },
                },
              }
            }
          }
        }
      }
    },
  } as const;
};

const getSettingItemSchema = (datatype: DataType, group = '', valueKey = 'sk', labelKey?: string | string[], filter?: any) =>
({
  type: 'string',
  'x-control': ControlType.selectMany,
  dataSource: {
    source: 'collection',
    collection: datatype,
    value: valueKey,
    label: labelKey || 'name',
    filter
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
export {
  SettingModel,
  BaseSettingType,
  BaseSettingKeys,
};

registerCollection(
  'Setting',
  DataType.setting,
  SettingSchema(),
  null,
  null
);
