import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import {
  DataType,
  FieldType,
  FormViewSectionType,
  PermissionTypeComponent,
  PermissionTypeContent,
  getMenuList
} from '../types';
import { CollectionUI } from './collection-ui';
import { FileInfoSchema } from './fileinfo';
import { PhoneSchema } from './crm/crm-phone';

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
      portrait: FileInfoSchema(),
      password: {
        type: 'string',
        inputStyle: 'password',
      },
      confirmPassword: {
        type: 'string',
        inputStyle: 'password',
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
      groups: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          value: 'sk',
          label: 'name',
        },
      },
      roles: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'sk',
          label: 'name',
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
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri'
      },
      description: {
        type: 'string',
      },
      passwordPolicy: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.passwordpolicy,
          value: 'name',
          label: 'name',
        },
      },
      users: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'name',
          label: 'name',
        },
      },
      roles: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'name',
          label: 'name',
        },
      },
    },
  } as const;
};

const menuList = getMenuList();
export const UserRoleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      description: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      permissions: {
        type: 'object',
        properties: {
          component: {
            type: 'array',
            inputStyle: 'chip',
            fieldType: FieldType.selectionmultiple,
            dataSource: {
              source: 'json',
              json: Object.values(PermissionTypeComponent).map(value => ({
                label: value,
                value,
              })),
            },
            items: {
              type: 'string',
            },
          },
          content: {
            type: 'array',
            inputStyle: 'chip',
            fieldType: FieldType.selectionmultiple,
            dataSource: {
              source: 'json',
              json: Object.values(PermissionTypeContent).map(value => ({
                label: value,
                value,
              })),
            },
            items: {
              type: 'string',
            },
          },
          menuInclude: {
            type: 'array',
            inputStyle: 'tree',
            fieldType: FieldType.selectionmultiple,
            dataSource: {
              source: 'json',
              json: Object.values(menuList),
              children: 'subMenu',
            },
            items: {
              type: 'string',
            },
          },
          menuExclude: {
            type: 'array',
            inputStyle: 'tree',
            fieldType: FieldType.selectionmultiple,
            dataSource: {
              source: 'json',
              json: Object.values(menuList),
              children: 'subMenu',
            },
            items: {
              type: 'string',
            },
          }
        },
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
              '0': '/properties/portrait',
            },
            {
              '0': '/properties/firstName',
              '1': '/properties/lastName',
            },
            {
              '0': '/properties/email',
              '1': '/properties/phone',
            },
            {
              '0': '/properties/password',
              '1': '/properties/confirmPassword',
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
          title: 'Phones',
          items: [
            {
              '0': '/properties/phones',
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

registerCollection('User', DataType.user, UserSchema(), UserUI(), null);
registerCollection(
  'User Group',
  DataType.usergroup,
  UserGroupSchema(),
  null,
  null
);
registerCollection(
  'User Role',
  DataType.userrole,
  UserRoleSchema(),
  null,
  null
);
