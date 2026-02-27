import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';

export const UserSecuritySchema = () => {
  return {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        description: 'Reference to user or customer',
        group: 'identity',
      },
      userType: {
        type: 'string',
        enum: ['user', 'customer'],
        description: 'Type of user',
        group: 'identity',
      },
      // 2FA Settings
      twoFactorEnabled: {
        type: 'boolean',
        default: false,
        group: '2fa',
      },
      twoFactorMethod: {
        type: 'string',
        enum: ['email', 'sms', 'authenticator', 'none'],
        default: 'none',
        'x-control': ControlType.selectSingle,
        group: '2fa',
      },
      twoFactorSecret: {
        type: 'string',
        hidden: true,
        description: 'Encrypted TOTP secret',
      },
      twoFactorPhone: {
        type: 'string',
        description: 'Phone number for SMS 2FA',
        group: '2fa',
      },
      twoFactorVerifiedAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        group: '2fa',
      },
      backupCodesRemaining: {
        type: 'number',
        default: 0,
        disabled: true,
        group: '2fa',
      },
      // Device Settings
      deviceTrustEnabled: {
        type: 'boolean',
        default: true,
        description: 'Allow devices to be trusted',
        group: 'devices',
      },
      deviceTrustDuration: {
        type: 'number',
        default: 30,
        description: 'Days to trust devices',
        group: 'devices',
      },
      alertOnNewDevice: {
        type: 'boolean',
        default: true,
        description: 'Send alert on new device login',
        group: 'devices',
      },
      // Login History (last 50)
      loginHistory: {
        type: 'array',
        maxItems: 50,
        collapsible: 'close',
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
            deviceId: {
              type: 'string',
            },
            ipAddress: {
              type: 'string',
            },
            location: {
              type: 'string',
            },
            success: {
              type: 'boolean',
            },
            method: {
              type: 'string',
              enum: ['password', 'magic_link', 'code', 'oauth', '2fa'],
            },
          },
        },
      },
    },
    required: ['userId', 'userType'],
  } as const;
};

export const TwoFactorBackupSchema = () => {
  return {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        group: 'identity',
      },
      userType: {
        type: 'string',
        enum: ['user', 'customer'],
        group: 'identity',
      },
      codeHash: {
        type: 'string',
        hidden: true,
        description: 'Hashed backup code',
      },
      used: {
        type: 'boolean',
        default: false,
      },
      usedAt: {
        type: 'string',
        format: 'date-time',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['userId', 'userType', 'codeHash'],
  } as const;
};

const ussh = UserSecuritySchema();
const tfbsh = TwoFactorBackupSchema();

export type UserSecurityModel = FromSchema<typeof ussh>;
export type TwoFactorBackupModel = FromSchema<typeof tfbsh>;

registerCollection('User Security', DataType.user_security, UserSecuritySchema());
registerCollection('Two Factor Backup', DataType.two_factor_backup, TwoFactorBackupSchema());
