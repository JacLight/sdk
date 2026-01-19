import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { getCurrencies, getLanguages, getSiteFeatureList } from '../data';

import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

const getAccountFeatures = () => [
  { label: 'Overview', value: 'overview' },
  { label: 'Addresses', value: 'addresses' },
  { label: 'Reservations', value: 'reservations' },
  { label: 'Tickets', value: 'tickets' },
  { label: 'Orders', value: 'orders' },
  { label: 'Profile', value: 'profile' },
  { label: 'Projects', value: 'projects' },
  { label: 'Sites', value: 'sites' },
  { label: 'Stats', value: 'stats' },
  { label: 'Files', value: 'files' },
  { label: 'Payments', value: 'payments' },
  { label: 'Messages', value: 'messages' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Help', value: 'help' },
];

export const SiteSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        readOnly: true,
        layoutGroup: 'info',
        group: 'name',
      },
      homePage: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          value: 'name',
          label: 'name',
          filter: {
            property: 'site',
            operation: 'equal',
            value: '{{name}}',
          },
        },
        group: 'name',
        layoutGroup: 'info',
      },
      title: {
        type: 'string',
        layoutGroup: 'info',
        group: 'title',
      },
      domain: {
        type: 'string',
        format: 'hostname',
        placeholder: 'example.com',
        layoutGroup: 'info',
        group: 'domain',
      },
      hostName: {
        type: 'string',
        format: 'hostname',
        placeholder: 'example.com',
        layoutGroup: 'info',
        readOnly: true,
        group: 'domain',
      },
      aliases: {
        type: 'array',
        items: {
          type: 'string',
          format: 'hostname',
          placeholder: 'example.com',
        },
        layoutGroup: 'info',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        layoutGroup: 'info',
        hideSocialControl: true,
      },
      keywords: {
        'x-control-variant': 'textarea',
        type: 'string',
        layoutGroup: 'info',
        hideSocialControl: true,
      },
      favicon: {
        type: 'string',
        format: 'uri',
        layoutGroup: 'info',
      },
      robots: {
        type: 'string',
        layoutGroup: 'info',
      },
      logo: {
        type: 'object',
        title: 'Logo',
        hideLabel: true,
        readOnly: true,
        'x-control': ControlType.file,
        properties: {
          hideLogo: {
            type: 'boolean',
            group: 'size',
          },
          width: {
            type: 'number',
            group: 'size',
          },
          height: {
            group: 'size',
            type: 'number',
          },
          ...FileInfoSchema().properties,
        },
        layoutGroup: 'info',
      },
      loginRedirect: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          value: 'name',
          label: 'name',
          filter: {
            property: 'site',
            operation: 'equal',
            value: '{{name}}',
          },
        },
        layoutGroup: 'settings',
        group: 'login',
      },
      logoutRedirect: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          value: 'name',
          label: 'name',
          filter: {
            property: 'site',
            operation: 'equal',
            value: '{{name}}',
          },
        },
        layoutGroup: 'settings',
        group: 'login',
      },
      currencies: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: getCurrencies(),
        },
        layoutGroup: 'settings',
        group: 'currencies',
      },
      defaultCurrency: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'self',
          value: 'currencies',
          label: 'currencies',
        },
        layoutGroup: 'settings',
        group: 'currencies',
      },
      languages: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: getLanguages(),
        },
        layoutGroup: 'settings',
        group: 'languages',
      },
      defaultLanguage: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'self',
          value: 'languages',
          label: 'languages',
        },
        layoutGroup: 'settings',
        group: 'languages',
      },
      languageSwitch: {
        type: 'string',
        enum: ['icons', 'full', 'none'],
        layoutGroup: 'settings',
        group: 'search',
      },
      searchBar: {
        type: 'string',
        enum: ['top', 'bottom', 'none'],
        layoutGroup: 'settings',
        group: 'search',
      },
      showLogin: {
        type: 'boolean',
        'x-control-variant': 'switch',
        layoutGroup: 'settings',
        group: 'switch',
      },
      globalStyle: {
        type: 'boolean',
        'x-control-variant': 'switch',
        group: 'switch',
      },
      publishedPagesOnly: {
        type: 'boolean',
        'x-control-variant': 'switch',
        group: 'switch',
      },
      theme: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'function',
          value: 'getThemeSettingsList',
        },
        layoutGroup: 'settings',
        group: 'theme',
      },
      template: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'function',
          value: 'getSiteTemplates',
        },
        layoutGroup: 'settings',
        group: 'theme',
      },
      colorSwitch: {
        type: 'string',
        'x-control': ControlType.selectMany,
        enum: ['on', 'off'],
        default: 'off',
        layoutGroup: 'settings',
        group: 'theme',
      },
      darkMode: {
        type: 'string',
        enum: ['auto', 'switch', 'on', 'off'],
        default: 'auto',
        group: 'theme',
        layoutGroup: 'settings',
      },
      chatConfig: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.flexdata,
          value: 'sk',
          label: ['name', 'sk'],
          filter: {
            property: 'application',
            operation: 'equal',
            value: 'chat-config',
          },
        },
        group: 'chat',
        layoutGroup: 'settings',
      },
      features: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        options: getSiteFeatureList(),
        layoutGroup: 'settings',
        operations: [],
        items: {
          type: 'string',
        },
      },
      storefront: {
        type: 'object',
        hideLabel: true,
        properties: {
          storePage: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.page,
              value: 'name',
              label: 'name',
              filter: {
                property: 'site',
                operation: 'equal',
                value: '{{name}}',
              },
            },
            group: 'cart',
          },
          shipping: {
            type: 'string',
            description:
              'Select shipping configuration (leave empty to use site default)',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.sf_shipping_config,
              value: 'name',
              label: 'title',
            },
            group: 'shipping-config',
          },
          cart: {
            type: 'string',
            enum: ['default', 'modern', 'boutique', 'none'],
            group: 'cart',
          },
          productGrid: {
            type: 'string',
            enum: ['default', 'modern', 'boutique', 'none'],
            group: 'looks',
          },
          productDetails: {
            type: 'string',
            enum: ['default', 'modern', 'boutique', 'none'],
            group: 'looks',
          },
          showSearch: {
            type: 'boolean',
            group: 'search',
            styling: {
              container: 'w-24',
            },
          },
          showComments: {
            type: 'boolean',
            group: 'comment',
            styling: {
              container: 'w-24',
            },
          },
          showShare: {
            type: 'boolean',
            group: 'comment',
            styling: {
              container: 'w-24',
            },
          },
          quickView: {
            type: 'string',
            enum: ['none', 'dialog', 'drawer-left', 'drawer-right'],
            group: 'search',
            default: 'left',
          },
          filter: {
            type: 'string',
            enum: [
              'none',
              'top',
              'left',
              'right',
              'drawer-left',
              'drawer-right',
            ],
            group: 'search',
            default: 'left',
          },
          filters: {
            type: 'array',
            rules: [
              {
                operation: 'equal',
                valueA: '{{filter}}',
                valueB: 'none',
                action: 'hide',
              },
            ],
            items: {
              type: 'object',
              hideLabel: true,
              properties: {
                source: {
                  type: 'string',
                  enum: [
                    'price',
                    'category',
                    'brand',
                    'tags',
                    'rating',
                    'attribute',
                  ],
                  group: 'name',
                },
                name: {
                  type: 'string',
                  group: 'name',
                },
                display: {
                  type: 'string',
                  enum: [
                    'checkbox',
                    'select',
                    'radio',
                    'range-input',
                    'range-slider',
                  ],
                  group: 'display',
                  rules: [
                    {
                      operation: 'equal',
                      valueA: 'attribute',
                      valueB: '{{source}}',
                      action: 'hide',
                    },
                    {
                      operation: 'notEqual',
                      valueA: 'price',
                      valueB: '{{source}}',
                      action: 'set-property',
                      property: [
                        { key: 'enum', value: ['checkbox', 'select', 'radio'] },
                      ],
                    },
                    {
                      operation: 'equal',
                      valueA: 'price',
                      valueB: '{{source}}',
                      action: 'set-property',
                      property: [
                        {
                          key: 'enum',
                          value: [
                            'checkbox',
                            'select',
                            'radio',
                            'range-input',
                            'range-slider',
                          ],
                        },
                      ],
                    },
                  ],
                },
                minIncrement: {
                  type: 'number',
                  group: 'display',
                  default: 100,
                  rules: [
                    {
                      operation: 'notEqual',
                      valueA: 'price',
                      valueB: '{{source}}',
                      action: 'hide',
                    },
                  ],
                },
                attribute: {
                  type: 'string',
                  'x-control': ControlType.selectMany,
                  dataSource: {
                    source: 'collection',
                    collection: DataType.sf_attribute,
                    value: 'name',
                    label: 'name',
                  },
                  rules: [
                    {
                      operation: 'notEqual',
                      valueA: '{{source}}',
                      valueB: 'attribute',
                      action: 'hide',
                    },
                  ],
                },
              },
            },
          },
        },
        layoutGroup: 'store',
      },
      myAccount: {
        type: 'object',
        hideLabel: true,
        properties: {
          template: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.page,
              value: 'name',
              label: 'name',
              filter: {
                property: 'site',
                operation: 'equal',
                value: '{{name}}',
              },
            },
          },
          features: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            options: getAccountFeatures(),
            operations: [],
            items: {
              type: 'string',
            },
          },
        },
        layoutGroup: 'account',
      },
      tracking: {
        type: 'object',
        collapsible: 'open',
        properties: {
          pixel: {
            type: 'string',
          },
          googleAnalytic: {
            type: 'string',
          },
        },
        layoutGroup: 'social',
      },
      social: {
        type: 'array',
        collapsible: 'close',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            name: {
              type: 'string',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              dataSource: {
                source: 'json',
                json: [
                  'facebook',
                  'twitter',
                  'linkedin',
                  'instagram',
                  'tiktok',
                ],
              },
              group: 'social',
            },
            handle: {
              type: 'string',
              group: 'social',
            },
            url: {
              type: 'string',
              group: 'social',
            },
          },
        },
        layoutGroup: 'social',
      },
      spanProtectionComment: {
        description: 'Enable Google reCAPTCHA on contact and comment forms',
        type: 'boolean',
        'x-control-variant': 'switch',
        layoutGroup: 'spam',
      },
      spamProtectionUser: {
        description:
          'Enable Google reCAPTCHA on login, create account and password recovery pages',
        type: 'boolean',
        'x-control-variant': 'switch',
        layoutGroup: 'spam',
      },
      devEnvironment: {
        type: 'object ',
        hidden: true,
        properties: {},
      },
      hosting: {
        type: 'array',
        hidden: true,
        items: {}
      },
    },  
    'x-layout': {
      main: {
        type: 'tab',
        id: 'main',
        items: [
          { id: 'info', title: 'Info' },
          { id: 'settings', title: 'Settings' },
          { id: 'social', title: 'Socila & Tracking' },
          { id: 'spam', title: 'Spam Protection' },
          { id: 'store', title: 'Storefront' },
          { id: 'account', title: 'My Account' },
        ],
      },
    },
  } as const;
};

const dd = SiteSchema();
export type SiteModel = FromSchema<typeof dd>;

registerCollection('Site', DataType.site, SiteSchema());
