import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { PhoneSchema } from './crm-phone';

export const CustomerSchema = () => {
  return {
    type: 'object',
    properties: {
      // ========== IDENTITY (Important First) ==========
      accountType: {
        type: 'string',
        options: ['subscriber', 'contact', 'customer'],
        group: 'account',
      },
      balance: {
        type: 'number',
        default: 0,
        group: 'account',
      },
      status: {
        type: 'string',
        group: 'account',
      },
      email: {
        type: 'string',
        format: 'email',
        minLength: 3,
        maxLength: 150,
        unique: true,
        group: 'identity',
      },
      username: {
        type: 'string',
        unique: true,
        group: 'identity',
      },
      phone: {
        type: 'string',
        group: 'identity',
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
      prefix: {
        type: 'string',
        group: 'name-extra',
      },
      suffix: {
        type: 'string',
        group: 'name-extra',
      },
      // ========== PERSONAL ==========
      title: {
        type: 'string',
        group: 'personal',
      },
      sex: {
        type: 'string',
        group: 'personal',
      },
      birthday: {
        type: 'string',
        group: 'personal',
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

      // ========== WORK ==========
      company: {
        type: 'string',
        group: 'work',
      },
      jobTitle: {
        type: 'string',
        group: 'work',
      },
      jobClass: {
        type: 'string',
        group: 'job-detail',
      },
      employeeNumber: {
        type: 'string',
        group: 'job-detail',
      },
      hoursOfOperation: {
        type: 'string',
      },

      // ========== ACCOUNT ==========\
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'name',
        },
        group: 'groups',
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
        group: 'groups',
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
      password: {
        type: 'string',
        'x-control-variant': 'password',
        hidden: true,
        minLength: 8,
        pattern: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$',
        group: 'password',
      },
      confirmPassword: {
        type: 'string',
        'x-control-variant': 'password',
        hidden: true,
        minLength: 8,
        pattern: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$',
        group: 'password',
      },
      guestUser: {
        type: 'boolean',
        hidden: true,
      },

      // ========== LEAD ==========
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

      // ========== ARRAYS (Full Width - No Group) ==========

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
      phones: {
        type: 'array',
        items: PhoneSchema(),
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
      projects: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'string',
        },
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

      // ========== IMAGES (Full Width - No Group) ==========
      image: FileInfoSchema(),
      logo: FileInfoSchema(),

      // ========== TEXTAREA (Full Width - No Group) ==========
      about: {
        type: 'string',
        'x-control-variant': 'textarea',
      },

      // ========== COLLAPSIBLE OBJECTS ==========
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
            description:
              'What they are looking for (investors, partners, etc.)',
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
              allowMessagesFromNonConnections: {
                type: 'boolean',
                default: false,
              },
              sendReadReceipts: { type: 'boolean', default: true },
            },
          },
        },
      },

      // ========== HIDDEN/SYSTEM ==========
      audit: {
        type: 'array',
        hidden: true,
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            lastLogin: {
              type: 'string',
              disabled: true,
              format: 'date-time',
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
              disabled: true,
            },
            type: {
              type: 'string',
              enum: [
                'created',
                'updated',
                'deleted',
                'login',
                'failed_login',
                'change_password',
                'reset_password',
              ],
              disabled: true,
            },
            meta: {
              type: 'object',
              hidden: true,
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
