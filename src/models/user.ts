import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import {
  DataType,
  ControlType,
  PermissionTypeComponent,
  PermissionTypeContent,
  getMenuList
} from '../types';

import { FileInfoSchema } from './file-info';
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
        'x-control-variant': 'password',
        hidden: true,
        "minLength": 8,
        "pattern": "^(?=.*[A-Za-z])(?=.*\\d).{8,}$"
      },
      confirmPassword: {
        type: 'string',
        hidden: true,
        'x-control-variant': 'password',
        rules: [{ operation: 'notEqual', valueA: '{{password}}', valueB: '{{confirmPassword}}', action: 'validate', message: 'Password and Confirm Password must be the same.' }]
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
          value: 'name',
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
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.passwordpolicy,
          value: 'name',
          label: 'name',
        },
      },
      groups: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          value: 'name',
          label: 'name',
        },
      },
      roles: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'name',
          label: 'name',
        },
      },
      signature: {
        type: 'string',
        'x-control': ControlType.richtext
      }
    },
    "required": ["firstName", "lastName", "email"]
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
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.passwordpolicy,
          value: 'name',
          label: 'name',
        },
      },
      users: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'name',
          label: 'name',
        },
      },
      roles: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
            'x-control-variant': 'chip',
            'x-control': ControlType.selectMany,
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
            'x-control-variant': 'chip',
            'x-control': ControlType.selectMany,
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
            'x-control-variant': 'tree',
            'x-control': ControlType.selectMany,
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
            'x-control-variant': 'tree',
            'x-control': ControlType.selectMany,
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


const ush = UserSchema();
const usgh = UserGroupSchema();
const usrh = UserRoleSchema();

export type UserModel = FromSchema<typeof ush>;
export type UserGroupModel = FromSchema<typeof usgh>;
export type UserRoleModel = FromSchema<typeof usrh>;

registerCollection(
  'User',
  DataType.user,
  UserSchema()
)

registerCollection(
  'User Group',
  DataType.usergroup,
  UserGroupSchema()
);registerCollection(
  'User Role',
  DataType.userrole,
  UserRoleSchema()
);