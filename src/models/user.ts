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
      },
      audit:{
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
          }
        },
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


export const ApiKeySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        description: 'Human-readable name for the API key'
      },
      description: {
        type: 'string',
        maxLength: 500,
        description: 'Optional description of the API key purpose'
      },
      keyHash: {
        type: 'string',
        hidden: true,
        description: 'Hashed version of the API key for verification'
      },
      keyPrefix: {
        type: 'string',
        disabled: true,
        maxLength: 8,
        description: 'First few characters for identification (e.g., ak_1234...)'
      },
      scopes: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          json: [
            { label: 'Read', value: 'read' },
            { label: 'Write', value: 'write' },
            { label: 'Delete', value: 'delete' },
            { label: 'Admin', value: 'admin' },
            { label: 'Integration', value: 'integration' },
            { label: 'Webhook', value: 'webhook' }
          ]
        },
        items: {
          type: 'string'
        },
        description: 'Permissions/scopes for this API key'
      },
      rateLimit: {
        type: 'object',
        properties: {
          requestsPerMinute: {
            type: 'number',
            minimum: 1,
            maximum: 10000,
            default: 100
          },
          requestsPerHour: {
            type: 'number',
            minimum: 1,
            maximum: 100000,
            default: 1000
          },
          requestsPerDay: {
            type: 'number',
            minimum: 1,
            maximum: 1000000,
            default: 10000
          }
        },
        description: 'Rate limiting configuration'
      },
      status: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: {
          source: 'json',
          json: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Revoked', value: 'revoked' }
          ]
        },
        default: 'active',
        description: 'Current status of the API key'
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
        description: 'Expiration date for the API key'
      },
      lastUsedAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        description: 'Last time this API key was used'
      },
      usageStats: {
        type: 'object',
        hidden: true,
        properties: {
          totalRequests: {
            type: 'number',
            default: 0,
            disabled: true
          },
          lastMonthRequests: {
            type: 'number',
            default: 0,
            disabled: true
          },
          lastDayRequests: {
            type: 'number',
            default: 0,
            disabled: true
          },
          lastHourRequests: {
            type: 'number',
            default: 0,
            disabled: true
          }
        },
        description: 'Usage statistics for rate limiting and analytics'
      },
      metadata: {
        type: 'object',
        description: 'Additional key-specific metadata'
      },
      audit: {
        type: 'object',
        hidden: true,
        properties: {
          lastUsed: {
            type: 'string',
            format: 'date-time',
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
          }
        },
      }
    },
    required: ['name', 'keyHash', 'scopes']
  } as const;
};

const ush = UserSchema();
const usgh = UserGroupSchema();
const usrh = UserRoleSchema();
const aksh = ApiKeySchema();

export type UserModel = FromSchema<typeof ush>;
export type UserGroupModel = FromSchema<typeof usgh>;
export type UserRoleModel = FromSchema<typeof usrh>;
export type ApiKeyModel = FromSchema<typeof aksh>;

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

registerCollection(
  'API Key',
  DataType.apikey,
  ApiKeySchema()
);
