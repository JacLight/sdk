import { CollectionRule } from '../collection-rule';
import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType, FormViewSectionType } from '../../types';
import { CollectionUI } from '../collection-ui';
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
        hideInTable: true,
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
        "minLength": 8,
        "pattern": "^(?=.*[A-Za-z])(?=.*\\d).{8,}$"
      },
      confirmPassword: {
        type: 'string',
        'x-control-variant': 'password',
        hidden: true,
        "minLength": 8,
        "pattern": "^(?=.*[A-Za-z])(?=.*\\d).{8,}$"
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
        hideInTable: true,
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
        hideInTable: true,
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
        hideInTable: true,
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
                json: ['facebook', 'twitter', 'linkedin', 'instagram', 'tiktok']
              },
              group: 'social'
            },
            url: {
              type: 'string',
              group: 'social'
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
                json: ['lead', 'customer', 'company', 'employee']
              },
              group: 'afflictions'
            },
            description: {
              type: 'string',
              group: 'afflictions'
            },
          },
        },
      },
      leadStatus: {
        type: 'string',
        enum: ['in progress', 'contacted', 'qualified', 'attempted', 'unqualified', 'converted', 'closed', 'other'],
      },
      leadStage: {
        type: 'string',
        enum: ['new', 'lead', 'marketing-qualified', 'sales-qualified', 'opportunity', 'customer', 'evangelist', 'other'],
      }

    },
  } as const;
};

export const CustomerUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'Profile',
          items: [
            {
              '0': '/properties/image',
              '1': '/properties/username',
            },
            {
              '0': '/properties/email',
              '1': '/properties/phone',
            },
            {
              '0': '/properties/firstName',
              '1': '/properties/lastName',
            },
            {
              '0': '/properties/password',
              '1': '/properties/confirmPassword',
            },
            {
              '0': '/properties/leadStatus',
              '1': '/properties/leadStage',
            },
            {
              '0': '/properties/timezone',
              '1': '/properties/language',
            },
            {
              '0': '/properties/social',
            },
            {
              '0': '/properties/afflictions',
            },
          ],
        },
        {
          title: 'Address',
          items: [
            {
              '0': '/properties/address',
            },
          ],
        },
        {
          title: 'Phones',
          items: [
            {
              '0': '/properties/phones',
            },
          ],
        },
        {
          title: 'Subscriptions',
          items: [
            {
              '0': '/properties/subscriptions',
            },
          ],
        },
        {
          title: 'history',
          items: [
            {
              '0': '/properties/lastLoginDate',
              '1': '/properties/lastLoginIp',
            },
            {
              '0': '/properties/lastFailedLoginDate',
              '1': '/properties/failedLoginAttempts',
            },
            {
              '0': '/properties/history',
            },
          ],
        },
      ],
    },
  ];
};

export const CustomerRules = (): CollectionRule[] => {
  return null;
};
const ush = CustomerSchema();
export type CustomerModel = FromSchema<typeof ush>;
registerCollection(
  'Customer',
  DataType.customer,
  CustomerSchema(),
  CustomerUI(),
  CustomerRules(),
  false,
  true
);
