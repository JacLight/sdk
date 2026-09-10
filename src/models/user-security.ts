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
      /**
       * Which table `userId` points at — a staff account or a customer.
       *
       * Both live here on purpose. The machinery is identical for either: same
       * TOTP, same emailed and texted codes, same backup codes, same trusted
       * devices. Keeping it out of the account records also keeps a TOTP secret
       * out of every CRM list, export and enrichment that happens to read a
       * customer.
       */
      userType: {
        type: 'string',
        enum: ['user', 'customer'],
        default: 'user',
        description: 'Whether userId names a staff user or a customer',
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
      /**
       * Every second factor this account has enrolled.
       *
       * People carry more than one: an authenticator on the phone, SMS as the
       * fallback when the phone is reflashed, email when travelling without a
       * SIM. A single `twoFactorMethod` forced a choice of one and silently
       * replaced the previous enrolment when a second was set up — losing the
       * first without saying so.
       *
       * The singular fields above remain the preferred method and its secret,
       * so records written before this list still work: read the list, and fall
       * back to the singular pair when it is empty.
       */
      twoFactorMethods: {
        type: 'array',
        title: 'Enrolled factors',
        group: '2fa',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'Stable id for this enrolment' },
            type: {
              type: 'string',
              enum: ['authenticator', 'sms', 'email'],
              description: 'Only these can actually be challenged',
            },
            label: { type: 'string', description: "What the owner calls it — 'iPhone', 'work email'" },
            secret: { type: 'string', hidden: true, description: 'TOTP secret, authenticator enrolments only' },
            phone: { type: 'string', description: 'Destination for an SMS enrolment' },
            email: { type: 'string', description: 'Destination for an email enrolment' },
            isDefault: {
              type: 'boolean',
              default: false,
              description: 'The one challenged first; any other enrolment can still be chosen at sign-in',
            },
            status: {
              type: 'string',
              enum: ['pending', 'verified'],
              default: 'pending',
              description: 'Pending until a code from it has been entered once',
            },
            verifiedAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            lastUsedAt: { type: 'string', format: 'date-time' },
          },
        },
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
