import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import {
  DataType,
  ControlType,
  PermissionTypeComponent,
  PermissionTypeContent,
  getMenuList,
} from '../types';

import { FileInfoSchema } from './file-info';

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
        minLength: 8,
        pattern: '^(?=.*[A-Za-z])(?=.*\\d).{8,}$',
      },
      confirmPassword: {
        type: 'string',
        hidden: true,
        'x-control-variant': 'password',
        rules: [
          {
            operation: 'notEqual',
            valueA: '{{password}}',
            valueB: '{{confirmPassword}}',
            action: 'validate',
            message: 'Password and Confirm Password must be the same.',
          },
        ],
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
        description: 'Primary personal phone (free text)',
      },
      phones: {
        type: 'array',
        description: 'Company phone numbers assigned to this user. Each entry is a reference to a phone record.',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.phone,
          value: 'phoneNumber',
          label: 'phoneNumber',
        },
        items: {
          type: 'string',
        },
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
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          value: 'name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      roles: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      signature: {
        type: 'string',
        'x-control': ControlType.richtext,
      },

      // CRM-facing profile (replaces separate agent record)
      bio: {
        type: 'string',
        'x-control-variant': 'textarea',
        description: 'Bio for CRM-facing display, customer-facing profiles',
      },
      profileURL: {
        type: 'string',
        description: 'Public profile URL',
      },
      bookingURL: {
        type: 'string',
        description: 'Calendar/scheduling link (Calendly, Cal.com, etc.)',
      },
      meetingLinks: {
        type: 'array',
        description: 'Zoom/Meet/Teams personal meeting links',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string' },
            url: { type: 'string' },
          },
        },
      },
      emails: {
        type: 'array',
        description: 'Company email accounts assigned to this user (e.g., jane@company.com). Each entry references an email_account record.',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.email_account,
          value: 'emailAddress',
          label: 'emailAddress',
        },
        items: {
          type: 'string',
        },
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
      securitySettings: {
        type: 'object',
        collapsible: 'close',
        group: 'security',
        properties: {
          twoFactorEnabled: {
            type: 'boolean',
            default: false,
          },
          preferredTwoFactorMethod: {
            type: 'string',
            enum: ['email', 'sms', 'authenticator'],
            'x-control': ControlType.selectSingle,
          },
          deviceTrustEnabled: {
            type: 'boolean',
            default: true,
          },
          alertOnNewDevice: {
            type: 'boolean',
            default: true,
          },
        },
      },
    },
    required: ['firstName', 'lastName', 'email'],
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
        transform: 'uri',
      },
      title: {
        type: 'string',
        description: 'Display name (e.g., "Sales Team")',
      },
      description: {
        type: 'string',
      },
      image: FileInfoSchema(),
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
        type: 'array',
        description: 'Members of this group',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['username', 'email'],
        },
        items: { type: 'string' },
      },
      roles: {
        type: 'array',
        description: 'Roles granted to all members of this group',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'name',
          label: 'name',
        },
        items: { type: 'string' },
      },

      // Collective assignment — groups can be treated as a single "virtual agent"
      // for tasks, tickets, CRM leads, and IVR routing.
      assignmentStrategy: {
        type: 'string',
        enum: ['ring-all', 'round-robin', 'longest-idle', 'skill-based', 'sequential', 'manual'],
        default: 'round-robin',
        description: 'How work is distributed to group members when assigned as a collective (tasks, leads, tickets, IVR calls).',
      },
      canBeAssigned: {
        type: 'boolean',
        default: true,
        description: 'Whether this group can be used as an assignment target in tasks, leads, tickets, IVR, and chat routing.',
      },
      skills: {
        type: 'array',
        description: 'Skill tags for skill-based routing (e.g., "billing", "spanish", "tier-2").',
        items: { type: 'string' },
      },

      // Shared team contact info (replaces agent groups)
      sharedEmails: {
        type: 'array',
        description: 'Shared team email addresses (e.g., sales@, support@)',
        dataSource: {
          source: 'collection',
          collection: DataType.email_account,
          value: 'emailAddress',
          label: 'emailAddress',
        },
        items: {
          type: 'string',
        },
      },
      sharedPhones: {
        type: 'array',
        description: 'Shared team phone numbers',
        dataSource: {
          source: 'collection',
          collection: DataType.phone,
          value: 'phoneNumber',
          label: 'phoneNumber',
        },
        items: {
          type: 'string',
        },
      },
      bookingURL: {
        type: 'string',
        description: 'Team round-robin booking link',
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
          },
        },
      },
    },
  } as const;
};

export const userInvitationSchema = () => {
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
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      invitationToken: {
        type: 'string',
        readOnly: true,
      },
      status: {
        type: 'string',
        default: 'pending',
      },
      invitedBy: {
        type: 'string',
        readOnly: true,
      },
      expiryDate: {
        type: 'string',
        format: 'date-time',
      },
      message: {
        type: 'string',
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
        items: {
          type: 'string',
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
        items: {
          type: 'string',
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
        description: 'Human-readable name for the API key',
      },
      description: {
        type: 'string',
        maxLength: 500,
        description: 'Optional description of the API key purpose',
      },
      keyHash: {
        type: 'string',
        hidden: true,
        description: 'Hashed version of the API key for verification',
      },
      keySecret:{
        type: 'string',
      },
      keyPrefix: {
        type: 'string',
        disabled: true,
        maxLength: 8,
        description:
          'First few characters for identification (e.g., ak_1234...)',
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
            { label: 'Webhook', value: 'webhook' },
          ],
        },
        items: {
          type: 'string',
        },
        description: 'Permissions/scopes for this API key',
      },
      rateLimit: {
        type: 'object',
        properties: {
          requestsPerMinute: {
            type: 'number',
            minimum: 1,
            maximum: 10000,
            default: 100,
          },
          requestsPerHour: {
            type: 'number',
            minimum: 1,
            maximum: 100000,
            default: 1000,
          },
          requestsPerDay: {
            type: 'number',
            minimum: 1,
            maximum: 1000000,
            default: 10000,
          },
        },
        description: 'Rate limiting configuration',
      },
      status: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: {
          source: 'json',
          json: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Revoked', value: 'revoked' },
          ],
        },
        default: 'active',
        description: 'Current status of the API key',
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
        description: 'Expiration date for the API key',
      },
      lastUsedAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        description: 'Last time this API key was used',
      },
      usageStats: {
        type: 'object',
        hidden: true,
        properties: {
          totalRequests: {
            type: 'number',
            default: 0,
            disabled: true,
          },
          lastMonthRequests: {
            type: 'number',
            default: 0,
            disabled: true,
          },
          lastDayRequests: {
            type: 'number',
            default: 0,
            disabled: true,
          },
          lastHourRequests: {
            type: 'number',
            default: 0,
            disabled: true,
          },
        },
        description: 'Usage statistics for rate limiting and analytics',
      },
      metadata: {
        type: 'object',
        description: 'Additional key-specific metadata',
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
          },
        },
      },
    },
    required: ['name', 'keyHash', 'scopes'],
  } as const;
};

const ush = UserSchema();
const usgh = UserGroupSchema();
const usrh = UserRoleSchema();
const aksh = ApiKeySchema();
const userInvitationh = userInvitationSchema();

export type UserModel = FromSchema<typeof ush>;
export type UserGroupModel = FromSchema<typeof usgh>;
export type UserRoleModel = FromSchema<typeof usrh>;
export type ApiKeyModel = FromSchema<typeof aksh>;
export type UserInvitationModel = FromSchema<typeof userInvitationh>;

registerCollection('User', DataType.user, UserSchema());

registerCollection('User Group', DataType.usergroup, UserGroupSchema());
registerCollection('User Role', DataType.userrole, UserRoleSchema());

registerCollection('API Key', DataType.apikey, ApiKeySchema());

registerCollection(
  'User Invitation',
  DataType.user_invitation,
  userInvitationSchema()
);
