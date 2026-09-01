import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';
import { FileInfoSchema } from './file-info';

export const SiteNoticeSchema = () =>
  ({
    type: 'object',
    properties: {
      name: {
        type: 'string',
        readOnly: true,
      },
      title: {
        type: 'string',
        title: 'Title',
        description: 'Headline or subject of the information message',
      },
      site: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chips',
        dataSource: {
          source: 'collection',
          collection: DataType.site,
          value: 'name',
          label: 'name',
        },
        layoutGroup: 'x-layout.main.items.0',
        group: 'site',
      },
      category: {
        type: 'string',
        enum: [
          'verification',
          'cookie-consent',
          'announcement',
          'alert',
          'update',
          'promotion',
          'info',
          'reminder',
        ],
        default: 'info',
        title: 'Category',
        description: 'Defines the type of information being shared',
      },
      status: {
        type: 'string',
        enum: ['draft', 'scheduled', 'active', 'paused', 'expired'],
        default: 'draft',
        'x-control': 'label',
        group: 'meta',
        readOnly: true,
      },
      displayType: {
        type: 'string',
        enum: ['popup', 'banner', 'toast', 'modal', 'inline'],
        default: 'popup',
        title: 'Display Type',
        description: 'How the message should appear to the user',
      },
      trigger: {
        type: 'string',
        enum: ['onPageLoad', 'onAction', 'onDelay', 'manual'],
        default: 'onPageLoad',
        title: 'Trigger',
        description: 'When to display this information',
      },
      triggerSelector: {
        type: 'string',
        title: 'Trigger Selector',
        description:
          'CSS selector or element ID that activates this message (for onAction triggers)',
        hideIn: ['table'],
      },
      delayMs: {
        type: 'number',
        title: 'Delay (ms)',
        description:
          'Optional delay before showing the message, in milliseconds',
        default: 0,
      },
      bodyHtml: {
        type: 'string',
        title: 'HTML Content',
        'x-control': 'richtext',
        hideIn: ['table'],
      },
      bodyText: {
        type: 'string',
        title: 'Plain Text Content',
        'x-control-variant': 'textarea',
        rows: 4,
        hideIn: ['table'],
      },
      attachments: {
        type: 'array',
        title: 'Attachments',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        title: 'Active From',
        group: 'schedule',
      },
      endTime: {
        type: 'string',
        format: 'date-time',
        title: 'Active Until',
        group: 'schedule',
      },
      showFrequency: {
        type: 'string',
        enum: ['oncePerUser', 'oncePerSession', 'always'],
        default: 'oncePerUser',
        title: 'Show Frequency',
        description: 'How often the same user should see this message',
      },
      rememberView: {
        type: 'boolean',
        default: true,
        title: 'Remember If Seen',
        description: 'Avoid showing again if user has already viewed it',
      },
      audience: {
        type: 'object',
        title: 'Target Audience',
        description: 'Define which users should receive this information',
        properties: {
          surface: {
            type: 'string',
            enum: ['site', 'admin', 'both'],
            // Deliberately no `default`. json-schema-to-ts promotes a defaulted
            // property to a required one, so every existing `audience: {...}`
            // literal would stop compiling. The default lives where it is
            // actually applied — surfaceScope() in notice.query.ts — and is
            // "unset means site", which is what pre-existing notices are.
            title: 'Where it shows',
            description:
              "'site' — visitors browsing your website (the default: a promotion or cookie banner is for shoppers). " +
              "'admin' — the people running the business, in the admin console. " +
              "'both' — everywhere. A notice with no value set is treated as 'site', because that is what every notice authored before this field existed was written for.",
          },
          roles: {
            type: 'array',
            items: { type: 'string' },
            title: 'User Roles',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            title: 'User Tags',
          },
          condition: {
            type: 'string',
            title: 'Custom Condition',
            description:
              'Optional condition to control visibility (e.g., expression or flag)',
          },
        },
      },
      priority: {
        type: 'number',
        default: 1,
        minimum: 1,
        title: 'Priority',
        description: 'Higher priority messages appear before others',
      },
      actions: {
        type: 'array',
        title: 'Actions',
        description:
          'List of action buttons or links associated with this message',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', title: 'Label' },
            actionType: {
              type: 'string',
              enum: ['link', 'dismiss', 'callback'],
              default: 'link',
              title: 'Action Type',
            },
            url: { type: 'string', title: 'URL (for links)' },
            callbackKey: { type: 'string', title: 'Callback Identifier' },
          },
        },
      },
      metrics: {
        type: 'object',
        title: 'Metrics',
        properties: {
          views: { type: 'number', default: 0 },
          clicks: { type: 'number', default: 0 },
          dismissals: { type: 'number', default: 0 },
          // Consent/verification notices need the outcome, not just engagement.
          accepts: { type: 'number', default: 0 },
          rejects: { type: 'number', default: 0 },
        },
        readOnly: true,
      },
      rejectRedirectUrl: {
        type: 'string',
        title: 'Reject Redirect URL',
        description:
          'URL to redirect users who reject/fail verification (e.g., google.com)',
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{category}}',
            valueB: 'verification',
            action: 'hide',
          },
        ],
      },
      targetOrgId: {
        type: 'string',
        hidden: true,
      },
      // Stable identity for a platform-raised notice, e.g.
      // `billing:insufficient-credits:Google`. Lets the sender update or expire
      // the notice it already raised instead of stacking a new row every time
      // the same condition re-fires. Unset for notices authored in the UI.
      key: {
        type: 'string',
        hidden: true,
      },
    },
  } as const);

const schema = SiteNoticeSchema();
export type SiteNoticeModel = FromSchema<typeof schema>;
registerCollection('Site Notice', DataType.site_notice, SiteNoticeSchema());
