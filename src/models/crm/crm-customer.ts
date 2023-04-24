import { CollectionRule } from '../collection-rule';
import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { DataType, FieldType, FormViewSectionType } from '../../types';
import { CollectionUI } from '../collection-ui';
import { FileInfoSchema } from '../fileinfo';
import { PhoneSchema } from './crm-phone';

export const CustomerSchema = () => {
  return {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
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
        items: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            status: { type: 'string', fieldType: FieldType.label },
            verified: { type: 'boolean' },
          },
        },
      },
      username: {
        type: 'string',
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
        inputStyle: 'password',
      },
      passwordReset: {
        type: 'boolean',
        title: 'Set Password',
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
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
            },
            event: {
              type: 'string',
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
      facebook: {
        type: 'string',
      },
      google: {
        type: 'string',
      },
      ldap: {
        type: 'string',
      },
      openId: {
        type: 'string',
      },
      lastLoginDate: {
        type: 'string',
        format: 'date-time',
        disabled: true,
      },
      lastLoginIp: {
        type: 'string',
        disabled: true,
      },
      lastFailedLoginDate: {
        type: 'string',
        format: 'date-time',
        disabled: true,
      },
      failedLoginAttempts: {
        type: 'number',
        disabled: true,
      },
      passwordPolicy: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.passwordpolicy,
          value: 'sk',
          label: 'name',
        },
      },
      image: FileInfoSchema(),
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
      skype: {
        type: 'string',
      },
      twitter: {
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
            },
            {
              '0': '/properties/email',
            },
            {
              '0': '/properties/passwordReset',
              '1': '/properties/password',
            },
            {
              '0': '/properties/firstName',
              '1': '/properties/lastName',
            },
            {
              '0': '/properties/timezone',
              '1': '/properties/language',
            },
            {
              '0': '/properties/lastLoginDate',
              '1': '/properties/lastLoginIp',
            },
            {
              '0': '/properties/lastFailedLoginDate',
              '1': '/properties/failedLoginAttempts',
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
