import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { getCurrencies, getLanguages, getSiteFeatureList } from '../data';

import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

const getAccountFeatures = () => [
  { label: 'Overview', value: 'overview' },
  { label: 'Projects', value: 'projects' },
  { label: 'Files', value: 'files' },
  { label: 'Orders', value: 'orders' },
  { label: 'Shared Accounts', value: 'shared-accounts' },
  { label: 'Events', value: 'events' },
  { label: 'Wishlists', value: 'wishlists' },
  { label: 'Reservations', value: 'reservations' },
  { label: 'Payments', value: 'payments' },
  { label: 'Benefits', value: 'benefits' },
  { label: 'Affiliates', value: 'affiliates' },
  { label: 'Messages', value: 'messages' },
  { label: 'Tickets', value: 'tickets' },
  { label: 'Forms', value: 'forms' },
  { label: 'Notifications', value: 'notifications' },
  { label: 'Profile', value: 'profile' },
  { label: 'Addresses', value: 'addresses' },
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
          filter: { 'data.site': '{{name}}' },
        },
        group: 'name',
        layoutGroup: 'info',
      },
      title: {
        type: 'string',
        layoutGroup: 'info',
        group: 'title',
      },
      isDefault: {
        type: 'boolean',
        // At most one site per org holds this. The repository clears it
        // everywhere else on write — unlike `unique`, which rejects the change
        // and would leave the old default in place for ever.
        exclusive: true,
        group: 'title',
        default: false,
        layoutGroup: 'info',
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
      seo: {
        type: 'object',
        layoutGroup: 'info',
        properties: {
          noIndex: { type: 'boolean', default: false, description: 'Keep the whole site out of search results (robots.txt and every page say noindex).' },
        },
      },
      sitemap: {
        type: 'array',
        title: 'Sitemap',
        layoutGroup: 'info',
        description: 'Which pages are in the sitemap (and open to search). Empty: every page. A rule on a page covers the pages under it; with any "in" rule, pages no rule reaches are out.',
        items: {
          type: 'object',
          properties: {
            page: { type: 'string', title: 'Page', description: 'The page, by name.' },
            rule: { type: 'string', title: 'Rule', enum: ['in', 'out', 'in-not-children'], default: 'out' },
          },
        },
      },
      logo: {
        ...FileInfoSchema(),
        layoutGroup: 'logo',
      },
      image: {
        ...FileInfoSchema(),
        layoutGroup: 'logo',
      },
      loginRedirect: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          value: 'name',
          label: 'name',
          filter: { 'data.site': '{{name}}' },
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
          filter: { 'data.site': '{{name}}' },
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
      publishedPagesOnly: {
        type: 'boolean',
        'x-control-variant': 'switch',
        group: 'switch',
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
          collection: DataType.chat_config,
          value: 'sk',
          label: 'name',
        },
        group: 'chat',
        layoutGroup: 'settings',
      },
      chatAppId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'username',
          label: ['username'],
          filter: { 'data.groups': 'System' },
        },
        group: 'chat',
      },
      /**
       * What this site does, one row per feature: whether it is on, and for the
       * features that take over a page, which page.
       *
       * One list rather than a chip list of names plus a separate list of pages:
       * features keep being added, and two places to edit meant a site could
       * name a page for a feature it had not switched on.
       *
       * The named page still renders through the normal [[...slug]] pipeline and
       * only its BODY is swapped, so the site template keeps wrapping it.
       * Matching is on the page name, so a child path (`/pay/INV-1042`) reaches
       * the same feature. Features that are not pages — live chat, audio player
       * — simply leave `page` empty.
       */
      features: {
        type: 'array',
        collapsible: true,
        layoutGroup: 'settings',
        items: {
          type: 'object',
          hideLabel: true,
          properties: {
            feature: {
              type: 'string',
              'x-control': ControlType.selectMany,
              options: getSiteFeatureList(),
              group: 'feature',
            },
            enabled: {
              type: 'boolean',
              description: 'Off keeps the row but stops the feature running.',
              group: 'feature',
            },
            page: {
              type: 'string',
              description:
                'For features that take over a page. Leave empty for the rest.',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.page,
                value: 'name',
                label: 'name',
                filter: { 'data.site': '{{name}}' },
              },
              group: 'feature',
            },
          },
        },
      },
      storefront: {
        type: 'object',
        hideLabel: true,
        properties: {
          template: {
            type: 'string',
            enum: ['default', 'modern', 'boutique', 'none'],
            group: 'template',
          },
          quickView: {
            type: 'string',
            enum: ['none', 'dialog', 'drawer-left', 'drawer-right'],
            group: 'template',
            default: 'left',
          },
          extraInfoDisplay: {
            type: 'string',
            enum: ['tab', 'accordion', 'post', 'none'],
            layoutGroup: 'layout',
            group: 'template',
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
            group: 'search',
            styling: {
              container: 'w-24',
            },
          },
          showShare: {
            type: 'boolean',
            group: 'search',
            styling: {
              container: 'w-24',
            },
          },
          filtersPosition: {
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
          layout: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.page,
              value: 'name',
              label: 'name',
              filter: { 'data.site': '{{name}}' },
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
          preset: {
            type: 'string',
            enum: [
              'default',
              'minimal',
              'modern',
              'elegant',
              'dark',
              'midnight',
            ],
            default: 'default',
          },
        },
        layoutGroup: 'account',
      },
      tracking: {
        type: 'object',
        collapsible: 'open',
        properties: {
          cookies: {
            type: 'array',
            title: 'Cookies',
            description: 'Cookies set on every visit (a page adds its own, or replaces one of the site\'s by name). A value can take part of the page address: {{query.utm_source}}, {{query.gclid}}.',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', title: 'Name' },
                value: { type: 'string', title: 'Value', description: 'Fixed text, or {{query.<name>}} from the page address (not set when that is empty)' },
                days: { type: 'number', title: 'Keep for (days)', default: 30 },
                path: { type: 'string', title: 'Path', default: '/' },
                domain: { type: 'string', title: 'Domain', description: 'Empty = this site only; .example.com = every subdomain' },
                sameSite: { type: 'string', title: 'SameSite', enum: ['Lax', 'Strict', 'None'], default: 'Lax' },
                secure: { type: 'boolean', title: 'Secure (https only)', default: true },
                keepFirst: { type: 'boolean', title: 'Keep the first value', description: 'Only set when the visitor does not have it yet (first touch)', default: false },
                afterConsent: { type: 'boolean', title: 'Only after cookie consent', description: 'Set once the visitor accepts cookies', default: false },
              },
            },
          },
          pixel: {
            type: 'string',
          },
          googleAnalytic: {
            type: 'string',
          },
          googleSiteVerification: {
            type: 'string',
          },
          bingSiteVerification: {
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
        items: {},
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
