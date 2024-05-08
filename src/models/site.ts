import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType, FormViewSectionType } from '../types';
import { FileInfoSchema } from './fileinfo';
import { getCurrencies, getLanguages, getSiteFeatureList } from '../data';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { registerCollection } from '../defaultschema';

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
        readOnly: true
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
          }
        },
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
          }
        },
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
          }
        },
      },
      template: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'function',
          value: 'getSiteTemplates',
        }
      },
      colorSwitch: {
        type: 'string',
        'x-control': ControlType.selectMany,
        enum: ['on', 'off'],
        default: 'off'
      },
      darkMode: {
        type: 'string',
        enum: ['auto', 'switch', 'on', 'off'],
        default: 'auto'
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      keywords: {
        type: 'string',
      },
      robots: {
        type: 'string',
      },
      favicon: {
        type: 'string',
        format: 'uri',
      },
      features: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: getSiteFeatureList(),
        },
      },
      defaultCurrency: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'self',
          value: 'currencies',
          label: 'currencies',
        },
      },
      currencies: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: getCurrencies(),
        },
      },
      defaultLanguage: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'self',
          value: 'languages',
          label: 'languages',
        },
      },
      languages: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: getLanguages(),
        },
      },
      domain: {
        type: 'string',
        format: 'hostname',
        placeholder: 'example.com',
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
            group: 'size'
          },
          width: {
            type: 'number',
            group: 'size'
          },
          height: {
            group: 'size',
            type: 'number',
          },
          ...FileInfoSchema().properties,
        },
      },
      mainNavigation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.navigation,
          value: 'sk',
          label: 'name',
        },
      },
      mobileNavigation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.navigation,
          value: 'sk',
          label: 'name',
        },
      },
      footerNavigation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.navigation,
          value: 'sk',
          label: 'name',
        },
      },
      storefront: {
        type: 'object',
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
          },
          filter: {
            type: 'string',
            enum: ['default', 'none'],
            group: 'search',
          },
          filters: {
            type: 'array',
            rules: [
              { operation: 'equal', valueA: '{{/properties/storefront/properties/filter}}', valueB: 'none', action: 'hide' },
            ],
            items: {
              type: 'object',
              hideLabel: true,
              showIndex: true,
              collapsible: true,
              properties: {
                source: {
                  type: 'string',
                  enum: ['price', 'category', 'brand', 'tags', 'rating', 'attribute'],
                  group: 'name',
                },
                name: {
                  type: 'string',
                  group: 'name',
                },
                display: {
                  type: 'string',
                  enum: ['checkbox', 'select', 'radio', 'range-input', 'range-slider'],
                  group: 'display',
                  rules: [
                    { operation: 'equal', valueA: 'attribute', valueB: '{{source}}', action: 'hide' },
                    { operation: 'notEqual', valueA: 'price', valueB: '{{source}}', action: 'set-property', property: [{ key: 'enum', value: ['checkbox', 'select', 'radio'] }] },
                    { operation: 'equal', valueA: 'price', valueB: '{{source}}', action: 'set-property', property: [{ key: 'enum', value: ['checkbox', 'select', 'radio', 'range-input', 'range-slider'] }] },
                  ]
                },
                minIncrement: {
                  type: 'number',
                  group: 'display',
                  default: 100,
                  rules: [
                    { operation: 'notEqual', valueA: 'price', valueB: '{{source}}', action: 'hide' },
                  ]
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
                    { operation: 'notEqual', valueA: '{{source}}', valueB: 'attribute', action: 'hide' },
                  ],
                },
              },
            },
          },
        },
      },
      facebook: {
        type: 'string',
        format: 'uri',
      },
      twitter: {
        type: 'string',
        format: 'uri',
      },
      instagram: {
        type: 'string',
        format: 'uri',
      },
      youtube: {
        type: 'string',
        format: 'uri',
      },
      tiktok: {
        type: 'string',
        format: 'uri',
      },
      spanProtectionComment: {
        description: 'Enable Google reCAPTCHA on contact and comment forms',
        type: 'boolean',
        'x-control-variant': 'switch',
        displayStyle: 'card',
      },
      spamProtectionUser: {
        description:
          'Enable Google reCAPTCHA on login, create account and password recovery pages',
        type: 'boolean',
        'x-control-variant': 'switch',
        displayStyle: 'card',
      },
      tailwindConfig: {
        type: 'string',
        'x-control': 'code',
        'x-control-variant': 'json',
        css: { height: 800 }
      },
      searchBar: {
        type: 'string',
        enum: ['top', 'bottom', 'none'],
      },
      languageSwitch: {
        type: 'string',
        enum: ['icons', 'full', 'none'],
      },
      showLogin: {
        type: 'boolean',
        'x-control-variant': 'switch',
      },
      hideSiteHeader: {
        type: 'boolean',
        'x-control-variant': 'switch',
      },
      hideSiteFooter: {
        type: 'boolean',
        'x-control-variant': 'switch',
      },
      globalStyle: {
        type: 'boolean',
        'x-control-variant': 'switch',
      },
    },
  } as const;
};

export const SiteUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'Info',
          items: [
            {
              '0': '/properties/name',
              '1': '/properties/title',
            },
            {
              '0': '/properties/favicon',
            },
            {
              '0': '/properties/description',
            },
            {
              '0': '/properties/keywords',
            },
            {
              '0': '/properties/robots',
            },
            {
              '0': '/properties/logo',
            },
          ],
        },
        {
          title: 'Settings',
          items: [
            {
              '0': '/properties/domain',
              '1': '/properties/homePage',
            },
            {
              '0': '/properties/loginRedirect',
              '1': '/properties/logoutRedirect',
            },
            {
              '0': '/properties/currencies',
              '1': '/properties/languages',
            },
            {
              '0': '/properties/defaultCurrency',
              '1': '/properties/defaultLanguage',
            },
            {
              '0': '/properties/mainNavigation',
              '1': '/properties/footerNavigation',
            },
            {
              '0': '/properties/hideSiteHeader',
              '1': '/properties/hideSiteFooter',
              '2': '/properties/showLogin',
            },
            {
              '0': '/properties/globalStyle',
            },
            {
              '0': '/properties/searchBar',
              '1': '/properties/languageSwitch',
            },
            {
              '0': '/properties/template',
              '1': '/properties/colorSwitch',
              '2': '/properties/darkMode',
            },
            {
              '0': '/properties/features',
            },
          ],
        },
        {
          title: 'Social Links',
          items: [
            {
              '0': '/properties/facebook',
            },
            {
              '0': '/properties/twitter',
            },
            {
              '0': '/properties/instagram',
            },
            {
              '0': '/properties/youtube',
            },
            {
              '0': '/properties/tiktok',
            },
          ],
        },
        {
          title: 'Spam Protection',
          items: [
            {
              '0': '/properties/spamProtectionUser',
            },
            {
              '0': '/properties/spanProtectionComment',
            },
          ],
        },
        {
          title: 'Storefront',
          items: [
            {
              '0': '/properties/storefront',
            },
          ],
        },
      ],
    },
  ];
};

const dd = SiteSchema();
export type SiteModel = FromSchema<typeof dd>;

export const SiteRules = (): CollectionRule[] => {
  return [];
};
registerCollection('Site', DataType.site, SiteSchema(), SiteUI(), SiteRules());
