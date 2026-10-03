import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

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
      fromName: {
        type: "string",
        maxLength: 100,
        title: 'From Name',
        description: 'The name people see on mail from this address, e.g. "Ava at Harbor Grill". Blank: the address alone.',
        group: 'identity',
      },
      signature: {
        type: "string",
        'x-control': ControlType.richtext,
        title: 'Signature',
        description: 'Added to the end of mail written from this address.',
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
      hostedBy: {
        type: "string",
        enum: ["spinforge", "google", "microsoft", "other"],
        enumNames: ["SpinForge Mail", "Google Workspace", "Microsoft 365", "Other"],
        title: 'Mail Hosted By',
        description: 'The mail system this mailbox lives on — where its owner reads and manages its mail.',
        group: 'config',
      },
      password: {
        type: "string",
        format: "password",
        title: 'Mailbox Password',
        description: "The mailbox's own password, for a mailbox the platform signs in to as itself (SpinForge Mail) — to send as it and read its inbox. Set when the mailbox is created; reset it there too.",
        group: 'config',
      },
      syncIncoming: {
        type: "boolean",
        default: false,
        title: 'Read Incoming Mail',
        description: 'Off by default: the owner reads it at webmail. On for a shared or system mailbox — new mail is filed as messages, for the people and AI employees it is assigned to.',
        group: 'config',
      },
      syncFolder: {
        type: "string",
        default: "inbox",
        title: 'Folder to Read',
        description: 'Which folder of the mailbox is read when incoming mail is on — e.g. inbox, or a folder the owner files support mail into.',
        group: 'config',
      },
      provider: {
        type: "string",
        title: 'Sending Gateway',
        description: 'The connection mail from this account is sent through by the platform. Blank for a mailbox the platform does not send from.',
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

      // Assignment — this email account is assigned to these users and/or groups.
      // Populated by the user profile "Assign Email" flow, or inline from the email account list.
      assignedUsers: {
        type: 'array',
        title: 'Assigned Users',
        description: 'Users this email account is assigned to',
        group: 'assignment',
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
      assignedGroups: {
        type: 'array',
        title: 'Assigned Groups',
        description: 'User groups this email account is assigned to',
        group: 'assignment',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.usergroup,
          value: 'name',
          label: ['title', 'name'],
        },
        items: { type: 'string' },
      },
    },
    required: ['name', 'accountName', 'emailAddress'],
  } as const;
}

const ms = EmailAccountSchema();
export type EmailAccountModel = FromSchema<typeof ms>;

registerCollection(
  'emailAccount',
  DataType.email_account,
  EmailAccountSchema(),
);
