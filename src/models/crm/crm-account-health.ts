import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const EmailAccountHealthSchema = () => {
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

      // Account Reference
      accountId: {
        type: "string",
        title: 'Email Account ID',
        description: 'Reference to email account',
        group: 'identity',
      },
      accountEmail: {
        type: "string",
        format: "email",
        title: 'Account Email',
        group: 'identity',
      },

      // Time Period
      date: {
        type: "string",
        format: "date",
        title: 'Date',
        description: 'Daily tracking date (YYYY-MM-DD)',
        group: 'period',
      },
      periodType: {
        type: "string",
        enum: ["daily", "weekly", "monthly"],
        title: 'Period Type',
        default: "daily",
        group: 'period',
      },

      // Sending Metrics
      metrics: {
        type: "object",
        title: "Sending Metrics",
        group: 'metrics',
        properties: {
          sentCount: {
            type: "number",
            title: 'Total Sent',
            default: 0,
          },
          deliveredCount: {
            type: "number",
            title: 'Delivered',
            default: 0,
          },
          bouncedCount: {
            type: "number",
            title: 'Total Bounced',
            default: 0,
          },
          hardBounceCount: {
            type: "number",
            title: 'Hard Bounces',
            default: 0,
          },
          softBounceCount: {
            type: "number",
            title: 'Soft Bounces',
            default: 0,
          },
          openCount: {
            type: "number",
            title: 'Opens',
            default: 0,
          },
          clickCount: {
            type: "number",
            title: 'Clicks',
            default: 0,
          },
          spamComplaints: {
            type: "number",
            title: 'Spam Complaints',
            default: 0,
          },
          unsubscribeCount: {
            type: "number",
            title: 'Unsubscribes',
            default: 0,
          },
        },
      },

      // Calculated Rates
      rates: {
        type: "object",
        title: "Performance Rates",
        group: 'rates',
        properties: {
          deliveryRate: {
            type: "number",
            title: 'Delivery Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          bounceRate: {
            type: "number",
            title: 'Bounce Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          hardBounceRate: {
            type: "number",
            title: 'Hard Bounce Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          openRate: {
            type: "number",
            title: 'Open Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          clickRate: {
            type: "number",
            title: 'Click Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          spamRate: {
            type: "number",
            title: 'Spam Complaint Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
          unsubscribeRate: {
            type: "number",
            title: 'Unsubscribe Rate (%)',
            minimum: 0,
            maximum: 100,
            default: 0,
          },
        },
      },

      // Reputation Scores
      reputation: {
        type: "object",
        title: "Reputation Scores",
        group: 'reputation',
        properties: {
          senderScore: {
            type: "number",
            title: 'Sender Score',
            description: 'Overall sender reputation (0-100)',
            minimum: 0,
            maximum: 100,
            default: 100,
          },
          ipReputation: {
            type: "number",
            title: 'IP Reputation',
            minimum: 0,
            maximum: 100,
          },
          domainReputation: {
            type: "number",
            title: 'Domain Reputation',
            minimum: 0,
            maximum: 100,
          },
          contentQualityScore: {
            type: "number",
            title: 'Content Quality Score',
            minimum: 0,
            maximum: 100,
          },
        },
      },

      // Health Status
      healthStatus: {
        type: "object",
        title: "Health Status",
        group: 'health',
        properties: {
          overall: {
            type: "string",
            enum: ["excellent", "good", "warning", "critical", "suspended"],
            title: 'Overall Status',
            default: "good",
          },
          deliverability: {
            type: "string",
            enum: ["excellent", "good", "fair", "poor"],
            title: 'Deliverability Status',
            default: "good",
          },
          engagementLevel: {
            type: "string",
            enum: ["high", "medium", "low"],
            title: 'Engagement Level',
            default: "medium",
          },
        },
      },

      // Incidents & Alerts
      incidents: {
        type: "array",
        title: "Incidents & Alerts",
        group: 'incidents',
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["bounce_spike", "spam_spike", "rate_limit", "blacklist", "dns_issue", "authentication_failure", "other"],
              title: 'Incident Type',
            },
            severity: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
              title: 'Severity',
            },
            timestamp: {
              type: "string",
              format: "date-time",
              title: 'Timestamp',
            },
            details: {
              type: "string",
              title: 'Details',
            },
            resolved: {
              type: "boolean",
              title: 'Resolved',
              default: false,
            },
            resolvedAt: {
              type: "string",
              format: "date-time",
              title: 'Resolved At',
            },
          },
        },
      },

      // Blacklist Status
      blacklistChecks: {
        type: "array",
        title: "Blacklist Checks",
        group: 'blacklist',
        items: {
          type: "object",
          properties: {
            service: {
              type: "string",
              title: 'Blacklist Service',
              description: 'e.g., Spamhaus, SORBS, Barracuda',
            },
            listed: {
              type: "boolean",
              title: 'Is Listed',
              default: false,
            },
            checkedAt: {
              type: "string",
              format: "date-time",
              title: 'Checked At',
            },
            listedAt: {
              type: "string",
              format: "date-time",
              title: 'Listed At',
            },
            reason: {
              type: "string",
              title: 'Listing Reason',
            },
          },
        },
      },

      // Throttling & Limits
      throttling: {
        type: "object",
        title: "Throttling & Limits",
        group: 'limits',
        properties: {
          hitDailyLimit: {
            type: "boolean",
            title: 'Hit Daily Limit',
            default: false,
          },
          hitHourlyLimit: {
            type: "boolean",
            title: 'Hit Hourly Limit',
            default: false,
          },
          throttledAt: {
            type: "string",
            format: "date-time",
            title: 'Throttled At',
          },
          throttledUntil: {
            type: "string",
            format: "date-time",
            title: 'Throttled Until',
          },
          rateLimitErrors: {
            type: "number",
            title: 'Rate Limit Errors',
            default: 0,
          },
        },
      },

      // ESP Specific Data
      providerData: {
        type: "object",
        title: "Provider Specific Data",
        group: 'provider',
        properties: {
          provider: {
            type: "string",
            enum: ["google_workspace", "aws_ses", "sendgrid", "mailgun", "postmark"],
            title: 'Provider',
          },
          // Gmail/Google Workspace
          googlePostmasterData: {
            type: "object",
            properties: {
              reputationScore: { type: "number" },
              spamRate: { type: "number" },
              authenticationRate: { type: "number" },
            },
          },
          // AWS SES
          sesReputationMetrics: {
            type: "object",
            properties: {
              bounceRate: { type: "number" },
              complaintRate: { type: "number" },
              reputationStatus: { type: "string" },
            },
          },
          // SendGrid
          sendgridReputationData: {
            type: "object",
            properties: {
              reputationScore: { type: "number" },
              blockedCount: { type: "number" },
            },
          },
        },
      },

      // Warming Up Tracking
      warmupStatus: {
        type: "object",
        title: "Warmup Status",
        group: 'warmup',
        properties: {
          isWarmingUp: {
            type: "boolean",
            title: 'Is in Warmup Period',
            default: false,
          },
          warmupDay: {
            type: "number",
            title: 'Warmup Day',
            description: 'Current day in warmup schedule',
          },
          recommendedDailyLimit: {
            type: "number",
            title: 'Recommended Daily Limit',
          },
          adheredToLimit: {
            type: "boolean",
            title: 'Adhered to Warmup Limit',
            default: true,
          },
        },
      },

      // Recommendations
      recommendations: {
        type: "array",
        title: "Recommendations",
        description: 'System generated recommendations',
        group: 'recommendations',
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["reduce_volume", "pause_sending", "improve_content", "verify_dns", "contact_provider", "clean_list", "other"],
              title: 'Recommendation Type',
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              title: 'Priority',
            },
            message: {
              type: "string",
              title: 'Message',
            },
            actionRequired: {
              type: "boolean",
              title: 'Action Required',
              default: false,
            },
          },
        },
      },

      // Notes
      notes: {
        type: "string",
        'x-control-variant': 'textarea',
        title: 'Notes',
        group: 'additional',
      },

      // Timestamps
      createdAt: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Created At'
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Updated At'
      },
      lastCheckedAt: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Last Checked At'
      },
    },
    required: ['name', 'accountId', 'date'],
  } as const;
}

const ms = EmailAccountHealthSchema();
export type EmailAccountHealthModel = FromSchema<typeof ms>;

registerCollection(
  'accountHealth',
  DataType.email_account_health,
  EmailAccountHealthSchema(),
);
