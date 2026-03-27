import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const EmailAccountSchema = () => {
  return {
    type: "object",
    properties: {
      // Identity
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      accountName: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        title: 'Account Name',
        description: 'e.g., "Support Email 1"',
        group: 'identity',
      },
      emailAddress: {
        type: "string",
        format: "email",
        title: 'Email Address',
        description: 'e.g., support1@burnerdomain.com',
        group: 'identity',
      },

      // Domain Link
      domainId: {
        type: "string",
        title: 'Domain',
        description: 'Link to domain management',
        group: 'config',
      },
      domain: {
        type: "string",
        title: 'Domain Name',
        description: 'e.g., burnerdomain.com',
        group: 'config',
      },
      provider: {
        type: "string",
        dataSource:{
          collection: DataType.config,
          valueField: 'sk',
          labelField: 'name',
        },
        group: 'config',
      },
      dnsRecords: {
        type: "object",
        title: "DNS Records & Verification",
        group: 'dns',
        properties: {
          spf: {
            type: "object",
            title: 'SPF Record',
            properties: {
              verified: {
                type: "boolean",
                title: 'Verified',
                default: false,
              },
              record: {
                type: "string",
                title: 'SPF Record Value',
              },
              lastChecked: {
                type: "string",
                format: "date-time",
                title: 'Last Checked',
              },
            },
          },
          dkim: {
            type: "object",
            title: 'DKIM Record',
            properties: {
              verified: {
                type: "boolean",
                title: 'Verified',
                default: false,
              },
              record: {
                type: "string",
                title: 'DKIM Record Value',
              },
              selector: {
                type: "string",
                title: 'DKIM Selector',
              },
              lastChecked: {
                type: "string",
                format: "date-time",
                title: 'Last Checked',
              },
            },
          },
          dmarc: {
            type: "object",
            title: 'DMARC Record',
            properties: {
              verified: {
                type: "boolean",
                title: 'Verified',
                default: false,
              },
              record: {
                type: "string",
                title: 'DMARC Record Value',
              },
              lastChecked: {
                type: "string",
                format: "date-time",
                title: 'Last Checked',
              },
            },
          },
          verificationStatus: {
            type: "string",
            enum: ["pending", "partial", "verified", "failed"],
            title: 'Overall Verification Status',
            default: "pending",
          },
        },
      },

      // Health & Limits
      health: {
        type: "object",
        title: "Account Health",
        group: 'health',
        properties: {
          status: {
            type: "string",
            enum: ["active", "warning", "disabled", "flagged", "suspended"],
            title: 'Status',
            default: "active",
          },
          bounceRate: {
            type: "number",
            title: 'Bounce Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          spamScore: {
            type: "number",
            title: 'Spam Score',
            minimum: 0,
            maximum: 10,
            default: 0,
          },
          reputationScore: {
            type: "number",
            title: 'Reputation Score',
            minimum: 0,
            maximum: 100,
            default: 100,
          },
          dailyLimit: {
            type: "number",
            title: 'Daily Send Limit',
            default: 2000,
          },
          sentToday: {
            type: "number",
            title: 'Sent Today',
            default: 0,
          },
          sentThisMonth: {
            type: "number",
            title: 'Sent This Month',
            default: 0,
          },
          lastSentAt: {
            type: "string",
            format: "date-time",
            title: 'Last Sent',
          },
          lastHealthCheck: {
            type: "string",
            format: "date-time",
            title: 'Last Health Check',
          },
        },
      },

      // Blacklist Monitoring
      blacklistStatus: {
        type: "object",
        title: "Blacklist Status",
        group: 'health',
        properties: {
          isBlacklisted: {
            type: "boolean",
            title: 'Is Blacklisted',
            default: false,
          },
          blacklists: {
            type: "array",
            title: "Blacklist Services",
            items: {
              type: "object",
              properties: {
                service: {
                  type: "string",
                  title: 'Service Name',
                },
                listed: {
                  type: "boolean",
                  title: 'Listed',
                },
                listedAt: {
                  type: "string",
                  format: "date-time",
                  title: 'Listed Date',
                },
                reason: {
                  type: "string",
                  title: 'Reason',
                },
              },
            },
          },
          lastChecked: {
            type: "string",
            format: "date-time",
            title: 'Last Checked',
          },
        },
      },

      // Warmup Configuration
      warmupConfig: {
        type: "object",
        title: "Warmup Configuration",
        group: 'config',
        properties: {
          isWarmingUp: {
            type: "boolean",
            title: 'Is Warming Up',
            default: false,
          },
          warmupStartDate: {
            type: "string",
            format: "date-time",
            title: 'Warmup Start Date',
          },
          warmupPlan: {
            type: "string",
            enum: ["slow", "medium", "fast", "custom"],
            title: 'Warmup Plan',
            default: "medium",
          },
          currentDailyLimit: {
            type: "number",
            title: 'Current Daily Limit (During Warmup)',
          },
        },
      },

      // Settings
      isActive: {
        type: "boolean",
        title: 'Is Active',
        default: true,
        group: 'settings',
      },
      isPrimary: {
        type: "boolean",
        title: 'Is Primary Account',
        description: 'Use this account by default',
        default: false,
        group: 'settings',
      },
      autoRotate: {
        type: "boolean",
        title: 'Auto Rotate',
        description: 'Include in rotation for bulk sends',
        default: true,
        group: 'settings',
      },
      priority: {
        type: "number",
        title: 'Priority',
        description: 'Higher priority accounts used first',
        minimum: 0,
        maximum: 10,
        default: 5,
        group: 'settings',
      },

      // Metadata
      description: {
        type: "string",
        'x-control-variant': 'textarea',
        title: 'Description',
        group: 'additional',
      },
    },
    required: ['name', 'accountName', 'emailAddress', 'provider'],
  } as const;
}

const ms = EmailAccountSchema();
export type EmailAccountModel = FromSchema<typeof ms>;

registerCollection(
  'emailAccount',
  DataType.email_account,
  EmailAccountSchema(),
);
