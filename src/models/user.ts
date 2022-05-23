import { FromSchema } from 'json-schema-to-ts';
import { CollectionUI } from './collection';
import { DataType, FieldType, FormViewSectionType } from '../types';

export const UserSchema = () => {
  return {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        minLength: 3,
        maxLength: 150,
        unique: true,
      },
      firstname: {
        type: 'string',
      },
      middlename: {
        type: 'string',
      },
      lastname: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      portrait: {
        type: 'string',
        fieldType: "Upload",
      },
      password: {
        type: 'string',
      },
      passwordreset: {
        type: 'string',
        default: 'false',
      },
      passwordmodifieddate: {
        type: 'string',
        format: 'date-time',
      },
      lockout: {
        type: 'string',
        default: 'false',
      },
      lockoutdate: {
        type: 'string',
        format: 'date-time',
      },
      status: {
        type: 'number',
      },
      address: {
        type: 'array',
        items: { type: 'object' },
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
      reminderquestion: {
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
      facebookid: {
        type: 'integer',
      },
      googleuserid: {
        type: 'string',
      },
      ldapserverid: {
        type: 'integer',
      },
      openid: {
        type: 'string',
      },
      logindate: {
        type: 'string',
        format: 'date-time',
      },
      loginip: {
        type: 'string',
      },
      lastlogindate: {
        type: 'string',
        format: 'date-time',
      },
      lastloginip: {
        type: 'string',
      },
      lastfailedlogindate: {
        type: 'string',
        format: 'date-time',
      },
      failedloginattempts: {
        type: 'number',
      },
      passwordpolicy: {
        type: 'string',
      },
      groups: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          field: 'name',
        },
      },
      roles: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
        },
      },
    },
  } as const;
};

export const UserGroupSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      description: {
        type: 'string',
      },
      passwordpolicy: {
        type: 'string',
      },
      users: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          field: 'email',
        },
      },
      roles: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
        },
      },
    },
  } as const;
};

export const UserRoleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      description: {
        type: 'string',
      },
      permissions: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            inputStyle: 'chip',
            fieldType: FieldType.selectionmultiple,
            dataSource: {
              source: 'collection',
              collection: DataType.permission,
              field: 'name',
            },
          },
          content: {
            type: 'string',
            inputStyle: 'chip',
            fieldType: FieldType.selectionmultiple,
            dataSource: {
              source: 'collection',
              collection: DataType.permission,
              field: 'name',
            },
          }
        }
      },
    },
  } as const;
};



export const UserUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'User',
          items: [
            {
              '0': '/properties/email',
              '1': '/properties/password',
            },
            {
              '0': '/properties/firstname',
              '1': '/properties/lastname',
            },
            {
              '0': '/properties/timezone',
              '1': '/properties/language',
            },
            {
              '0': '/properties/portrait',
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
          title: 'Groups & Roles',
          items: [
            {
              '0': '/properties/groups',
            },
            {
              '0': '/properties/roles',
            },
          ],
        },
      ],
    },
  ];
};

const ush = UserSchema();
const usgh = UserGroupSchema();
const usrh = UserRoleSchema();

export type UserModel = FromSchema<typeof ush>;
export type UserGroupModel = FromSchema<typeof usgh>;
export type UserRoleModel = FromSchema<typeof usrh>;
