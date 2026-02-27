import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';

export const UserDeviceSchema = () => {
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
      deviceId: {
        type: 'string',
        description: 'Hash of device fingerprint',
        unique: true,
        group: 'identity',
      },
      fingerprint: {
        type: 'object',
        collapsible: 'close',
        properties: {
          userAgent: {
            type: 'string',
          },
          browser: {
            type: 'string',
          },
          browserVersion: {
            type: 'string',
          },
          os: {
            type: 'string',
          },
          osVersion: {
            type: 'string',
          },
          deviceType: {
            type: 'string',
            enum: ['desktop', 'mobile', 'tablet'],
          },
          timezone: {
            type: 'string',
          },
          language: {
            type: 'string',
          },
        },
      },
      ipAddress: {
        type: 'string',
        group: 'location',
      },
      location: {
        type: 'object',
        properties: {
          country: {
            type: 'string',
          },
          city: {
            type: 'string',
          },
          region: {
            type: 'string',
          },
        },
        group: 'location',
      },
      status: {
        type: 'string',
        enum: ['active', 'trusted', 'blocked'],
        default: 'active',
        'x-control': ControlType.selectSingle,
        group: 'status',
      },
      trustLevel: {
        type: 'string',
        enum: ['new', 'recognized', 'trusted'],
        default: 'new',
        'x-control': ControlType.selectSingle,
        group: 'status',
      },
      trustExpiresAt: {
        type: 'string',
        format: 'date-time',
        description: 'When device trust expires (for "remember device")',
        group: 'status',
      },
      firstSeenAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        group: 'audit',
      },
      lastSeenAt: {
        type: 'string',
        format: 'date-time',
        disabled: true,
        group: 'audit',
      },
      loginCount: {
        type: 'number',
        default: 0,
        disabled: true,
        group: 'audit',
      },
      deviceName: {
        type: 'string',
        description: 'Auto-generated device name (e.g., "Chrome on macOS")',
        group: 'display',
      },
    },
    required: ['userId', 'userType', 'deviceId'],
  } as const;
};

const udsh = UserDeviceSchema();
export type UserDeviceModel = FromSchema<typeof udsh>;

registerCollection('User Device', DataType.user_device, UserDeviceSchema());
