import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType} from '../../types';
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
      username: {
        type: 'string',
        unique: true,
      },
      firstName: {
        type: 'string',
      },
      middleName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      title: {
        type: 'string',
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
      },
      lockoutDate: {
        type: 'string',
        format: 'date-time',
        disabled: true,
      },
      status: {
        type: 'string',
      },
      phone: {
        type: 'string',
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
      },
      timezone: {
        type: 'string',
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
      },
      suffix: {
        type: 'string',
      },
      sex: {
        type: 'string',
      },
      birthday: {
        type: 'string',
      },
      employeeNumber: {
        type: 'string',
      },
      jobTitle: {
        type: 'string',
      },
      jobClass: {
        type: 'string',
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
      },
      balance: {
        type: 'number',
        default: 0, 
      },
    },
  } as const;
};

const ush = CustomerSchema();
export type CustomerModel = FromSchema<typeof ush>;
registerCollection(
  'Customer',
  DataType.customer,
  CustomerSchema(),
  null,
  null,
  false,
  true
);
