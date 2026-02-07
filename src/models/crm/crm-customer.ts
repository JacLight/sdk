import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { PhoneSchema } from './crm-phone';

export const CustomerSchema = () => {
  return {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'name',
        },
      },
      email: {
        type: 'string',
        format: 'email',
        minLength: 3,
        maxLength: 150,
        unique: true,
      },
      emails: {
        type: 'array',
        hideIn: ['table'],
        items: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            status: { type: 'string', 'x-control': ControlType.label },
            verified: { type: 'boolean', hidden: true },
          },
        },
      },
      groups: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer_group,
          value: 'name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      benefits: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.benefit,
          value: 'name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      username: {
        type: 'string',
        unique: true,
      },
      firstName: {
        type: 'string',
        group: 'fullname',
      },
      middleName: {
        type: 'string',
        group: 'fullname',
      },
      lastName: {
        type: 'string',
        group: 'fullname',
      },
      title: {
        type: 'string',
      },
      accountType: {
        type: 'string',
        options: ['subscriber', 'contact', 'customer'],
      },
      password: {
        type: 'string',
        'x-control-variant': 'password',
        hidden: true,
        minLength: 8,
        pattern: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$',
      },
      confirmPassword: {
        type: 'string',
        'x-control-variant': 'password',
        hidden: true,
        minLength: 8,
        pattern: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$',
      },
      lockout: {
        type: 'string',
        default: 'false',
        group: 'lockout',
      },
      lockoutDate: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        group: 'lockout',
      },
      status: {
        type: 'string',
        group: 'phone-status',
      },
      phone: {
        type: 'string',
        group: 'phone-status',
      },
      phones: {
        type: 'array',
        items: PhoneSchema(),
      },
      address: {
        type: 'array',
        displayStyle: 'table',
        hideIn: ['table'],
        dataSource: {
          source: 'collection',
          collection: DataType.address,
          value: 'sk',
          label: 'name',
        },
        items: {
          type: 'object',
          properties: {
            street1: {
              type: 'string',
            },
            city: {
              type: 'string',
            },
            region: {
              type: 'string',
            },
            zip: {
              type: 'string',
            },
            country: {
              type: 'string',
            },
          },
        },
      },
      history: {
        type: 'array',
        hideIn: ['table'],
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              group: 'history',
            },
            event: {
              type: 'string',
              group: 'history',
            },
          },
        },
      },
      language: {
        type: 'string',
        group: 'locale',
      },
      timezone: {
        type: 'string',
        group: 'locale',
      },
      greeting: {
        type: 'string',
      },
      guestUser: {
        type: 'boolean',
        hidden: true,
      },
      reminderQuestion: {
        hideIn: ['table'],
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: {
              type: 'string',
            },
            answer: {
              type: 'string',
            },
          },
        },
      },
      lastLoginDate: {
        type: 'string',
        disabled: true,
      },
      lastLoginIp: {
        type: 'string',
        disabled: true,
      },
      lastFailedLoginDate: {
        type: 'string',
        disabled: true,
      },
      failedLoginAttempts: {
        type: 'number',
        disabled: true,
      },
      passwordPolicy: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.passwordpolicy,
          value: 'sk',
          label: 'name',
        },
      },
      image: FileInfoSchema(),
      logo: FileInfoSchema(),
      about: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      projects: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'string',
        },
      },
      company: {
        type: 'string',
      },
      prefix: {
        type: 'string',
        group: 'prefix-suffix',
      },
      suffix: {
        type: 'string',
        group: 'prefix-suffix',
      },
      sex: {
        type: 'string',
        group: 'sex-birthday',
      },
      birthday: {
        type: 'string',
        group: 'sex-birthday',
      },
      employeeNumber: {
        type: 'string',
      },
      jobTitle: {
        type: 'string',
        group: 'job',
      },
      jobClass: {
        type: 'string',
        group: 'job',
      },
      hoursOfOperation: {
        type: 'string',
      },
      subscriptions: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      social: {
        type: 'array',
        items: {
          type: 'object',
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
            url: {
              type: 'string',
              group: 'social',
            },
          },
        },
      },
      afflictions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              dataSource: {
                source: 'json',
                json: ['lead', 'customer', 'company', 'employee'],
              },
              group: 'afflictions',
            },
            description: {
              type: 'string',
              group: 'afflictions',
            },
          },
        },
      },
      leadStatus: {
        type: 'string',
        enum: [
          'in progress',
          'contacted',
          'qualified',
          'attempted',
          'unqualified',
          'converted',
          'closed',
          'other',
        ],
        group: 'lead',
      },
      leadStage: {
        type: 'string',
        enum: [
          'new',
          'lead',
          'marketing-qualified',
          'sales-qualified',
          'opportunity',
          'customer',
          'evangelist',
          'other',
        ],
        group: 'lead',
      },
      balance: {
        type: 'number',
        default: 0,
      },
      audit: {
        type: 'object',
        hidden: true,
        properties: {
          lastLogin: {
            type: 'string',
            disabled: true,
          },
          lastUpdated: {
            type: 'string',
            format: 'date-time',
            disabled: true,
          },
          meta: {
            type: 'object',
            hidden: true,
          },
        },
      },
      // Community Profile (for peer-to-peer networking)
      communityProfile: {
        type: 'object',
        collapsible: true,
        properties: {
          isPublic: {
            type: 'boolean',
            default: false,
            description: 'Opt-in to be visible in networking features',
          },
          headline: {
            type: 'string',
            maxLength: 150,
            description: 'Short headline e.g. "CEO at Company"',
          },
          bio: {
            type: 'string',
            'x-control-variant': 'textarea',
            maxLength: 1000,
          },
          expertise: {
            type: 'array',
            'x-control-variant': 'chip',
            items: { type: 'string' },
            description: 'Skills/expertise to share',
          },
          interests: {
            type: 'array',
            'x-control-variant': 'chip',
            items: { type: 'string' },
            description: 'Topics interested in learning',
          },
          lookingFor: {
            type: 'array',
            'x-control-variant': 'chip',
            items: { type: 'string' },
            description: 'What they are looking for (investors, partners, etc.)',
          },
          socialLinks: {
            type: 'object',
            properties: {
              linkedin: { type: 'string', format: 'uri' },
              twitter: { type: 'string' },
              github: { type: 'string' },
              website: { type: 'string', format: 'uri' },
            },
          },
          visibility: {
            type: 'object',
            properties: {
              showEmail: { type: 'boolean', default: false },
              showPhone: { type: 'boolean', default: false },
              showCompany: { type: 'boolean', default: true },
              showLocation: { type: 'boolean', default: true },
            },
          },
          connectionPreferences: {
            type: 'object',
            properties: {
              autoAcceptQrScans: { type: 'boolean', default: false },
              allowMessagesFromNonConnections: { type: 'boolean', default: false },
              sendReadReceipts: { type: 'boolean', default: true },
            },
          },
        },
      },
    },
  } as const;
};

const ush = CustomerSchema();
export type CustomerModel = FromSchema<typeof ush>;
registerCollection('Customer', DataType.customer, CustomerSchema());
