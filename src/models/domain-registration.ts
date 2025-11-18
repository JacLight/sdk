import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const DomainRegistrationSchema = () => {
  return {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        isUnique: true,
        pattern: '^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,}$',
      },
      registrar: {
        type: 'string',
        enum: ['internal', 'external', 'godaddy', 'namecheap', 'cloudflare', 'other'],
        default: 'external',
      },
      status: {
        type: 'string',
        enum: ['pending', 'active', 'expired', 'suspended'],
        default: 'pending',
      },
      purchasedThroughUs: {
        type: 'boolean',
        default: false,
      },
      contactEmail: {
        type: 'string',
        format: 'email',
      },
      whoisPrivacy: {
        type: 'boolean',
        default: false,
      },
      transferLocked: {
        type: 'boolean',
        default: true,
      },
      verified: {
        type: 'boolean',
        default: false,
      },
      verifiedAt: {
        type: 'string',
        format: 'date-time',
      },
      dnsConfigured: {
        type: 'boolean',
        default: false,
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
      },
      autoRenew: {
        type: 'boolean',
        default: false,
      },
      nameservers: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      dnsRecords: {
        type: 'object',
        properties: {
          spf: {
            type: 'object',
            properties: {
              configured: { type: 'boolean' },
              value: { type: 'string' },
            },
          },
          dkim: {
            type: 'object',
            properties: {
              configured: { type: 'boolean' },
              selector: { type: 'string' },
              value: { type: 'string' },
            },
          },
          dmarc: {
            type: 'object',
            properties: {
              configured: { type: 'boolean' },
              policy: { type: 'string', enum: ['none', 'quarantine', 'reject'] },
              value: { type: 'string' },
            },
          },
        },
      },
      sslEnabled: {
        type: 'boolean',
        default: false,
      },
      sslProvider: {
        type: 'string',
      },
      sslExpiresAt: {
        type: 'string',
        format: 'date-time',
      },
      emailAccountsCount: {
        type: 'number',
        default: 0,
      },
      notes: {
        type: 'string',
      },
    },
    required: ['domain', 'registrar'],
  } as const;
};

const rt = DomainRegistrationSchema();
export type DomainRegistrationModel = FromSchema<typeof rt>;

registerCollection(
  'Domain Registration',
  DataType.domain_registration,
  DomainRegistrationSchema(),
);
