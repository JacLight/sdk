import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { getCurrencies, getLanguages, getSiteFeatureList } from '../data';

import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

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
        hideLabel: true,
        default: getSiteFeatureList(),
        group: 'features',
        layoutGroup: 'features',
        operations: [],
        items: {
          hideLabel: true,
          type: 'object',
          layout: 'horizontal',
          properties: {
            enable: {
              type: 'boolean',
              group: 'feature',
              styling: {
                container: 'w-24',
                'container-array': 'w-24',
              },
            },
            name: {
              type: 'string',
              group: 'feature',
              styling: {
                container: 'w-full',
                'container-array': 'w-32 flex-shrink-0',
              },
              readOnly: true,
            },
            path: {
              type: 'string',
              group: 'feature',
              styling: {
                container: 'w-full',
              },
            },
            page: {
              type: 'string',
              group: 'feature',
              styling: {
                container: 'w-full',
              },
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                value: 'page',
                filter: {
                  property: 'site',
                  operation: 'equal',
                  value: '{{name}}',
                },
                valueField: 'name',
                labelField: 'name',
              },
            },
          },
        },
      },
      storefront: {
        type: 'object',
        hideLabel: true,
        properties: {
          cart: {
            type: 'string',
            enum: ['default', 'none'],
            group: 'looks',
          },
          productGrid: {
            type: 'string',
            enum: ['default', 'none'],
            group: 'looks',
          },
          productDetails: {
            type: 'string',
            enum: ['default', 'none'],
            group: 'looks',
          },
          showSearch: {
            type: 'boolean',
            group: 'search',
            styling: {
              container: 'w-24',
            },
          },
          filter: {
            type: 'string',
            enum: ['default', 'none'],
            group: 'search',
          },
          filters: {
            type: 'array',
            rules: [
              {
                operation: 'equal',
                valueA: '{{/properties/storefront/properties/filter}}',
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
        properties: {},
      },
    },
    'x-layout': {
      main: {
        type: 'tab',
        id: 'main',
        items: [
          { id: 'info', title: 'Info' },
          { id: 'settings', title: 'Settings' },
          { id: 'features', title: 'Features' },
          { id: 'social', title: 'Socila & Tracking' },
          { id: 'spam', title: 'Spam Protection' },
          { id: 'store', title: 'Storefront' },
        ],
      },
    },
  } as const;
};

const dd = SiteSchema();
export type SiteModel = FromSchema<typeof dd>;

registerCollection('Site', DataType.site, SiteSchema());
