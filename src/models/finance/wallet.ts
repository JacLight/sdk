import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const WalletSchema = () => {
  return {
    type: 'object',
    properties: {
      // Status
      status: {
        type: 'string',
        enum: ['active', 'frozen', 'suspended', 'closed'],
        default: 'active',
        group: 'status',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'status',
      },

      // Balances
      balance: {
        type: 'number',
        default: 0,
        description: 'Available balance (can withdraw)',
        group: 'balance',
      },
      pendingBalance: {
        type: 'number',
        default: 0,
        description: 'Pending balance (clearing period)',
        group: 'balance',
      },
      heldBalance: {
        type: 'number',
        default: 0,
        description: 'Held balance (disputes, deposits)',
        group: 'balance',
      },
      reservedBalance: {
        type: 'number',
        default: 0,
        description: 'Reserved for pending payouts',
        group: 'balance',
      },

      // Lifetime Stats
      lifetimeCredits: {
        type: 'number',
        default: 0,
        description: 'Total money received',
        group: 'lifetime',
      },
      lifetimeDebits: {
        type: 'number',
        default: 0,
        description: 'Total money withdrawn/paid out',
        group: 'lifetime',
      },
      lifetimeFees: {
        type: 'number',
        default: 0,
        description: 'Total fees paid',
        group: 'lifetime',
      },

      // Earnings Breakdown (for agents/affiliates)
      earnings: {
        type: 'object',
        title: 'Earnings Breakdown',
        collapsible: true,
        properties: {
          base: {
            type: 'number',
            default: 0,
            description: 'Base earnings',
            group: 'earnings',
          },
          tips: {
            type: 'number',
            default: 0,
            group: 'earnings',
          },
          bonuses: {
            type: 'number',
            default: 0,
            group: 'earnings',
          },
          commissions: {
            type: 'number',
            default: 0,
            group: 'commissions',
          },
          referrals: {
            type: 'number',
            default: 0,
            group: 'commissions',
          },
          adjustments: {
            type: 'number',
            default: 0,
            description: 'Manual adjustments (+/-)',
          },
        },
      },

      // Payout Info
      payouts: {
        type: 'object',
        title: 'Payout Summary',
        collapsible: true,
        properties: {
          totalPayouts: {
            type: 'number',
            default: 0,
            group: 'payout-total',
          },
          totalPayoutCount: {
            type: 'number',
            default: 0,
            group: 'payout-total',
          },
          lastPayoutAmount: {
            type: 'number',
            group: 'last-payout',
          },
          lastPayoutDate: {
            type: 'string',
            format: 'date-time',
            group: 'last-payout',
          },
          nextScheduledPayout: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // Limits
      limits: {
        type: 'object',
        title: 'Limits',
        collapsible: true,
        properties: {
          minimumPayout: {
            type: 'number',
            description: 'Minimum balance for payout',
            group: 'limits',
          },
          maximumPayout: {
            type: 'number',
            description: 'Maximum single payout',
            group: 'limits',
          },
          dailyLimit: {
            type: 'number',
            description: 'Daily withdrawal limit',
            group: 'daily',
          },
          dailyUsed: {
            type: 'number',
            default: 0,
            group: 'daily',
          },
          weeklyLimit: {
            type: 'number',
            description: 'Weekly withdrawal limit',
            group: 'weekly',
          },
          weeklyUsed: {
            type: 'number',
            default: 0,
            group: 'weekly',
          },
        },
      },

      // Payout Settings (how owner wants to be paid)
      payoutSettings: {
        type: 'object',
        title: 'Payout Settings',
        collapsible: true,
        properties: {
          method: {
            type: 'string',
            enum: ['bank_transfer', 'paypal', 'venmo', 'cashapp', 'check', 'wire', 'crypto'],
            group: 'method',
          },
          frequency: {
            type: 'string',
            enum: ['instant', 'daily', 'weekly', 'biweekly', 'monthly', 'manual'],
            default: 'weekly',
            group: 'method',
          },
          // Bank
          bankAccount: {
            type: 'object',
            properties: {
              bankName: { type: 'string', group: 'bank' },
              accountType: { type: 'string', enum: ['checking', 'savings'], group: 'bank' },
              routingNumber: { type: 'string', group: 'account' },
              accountNumber: { type: 'string', group: 'account' },
              accountHolderName: { type: 'string' },
              verified: { type: 'boolean', default: false },
            },
          },
          // Digital
          paypalEmail: { type: 'string', format: 'email' },
          venmoHandle: { type: 'string' },
          cashappHandle: { type: 'string' },
          // Crypto
          cryptoWallet: {
            type: 'object',
            properties: {
              currency: { type: 'string', group: 'crypto' },
              address: { type: 'string', group: 'crypto' },
              network: { type: 'string' },
            },
          },
        },
      },

      // Holds (money held for specific reasons)
      holds: {
        type: 'array',
        title: 'Active Holds',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            reason: {
              type: 'string',
              enum: ['dispute', 'chargeback', 'security', 'deposit', 'pending_review', 'other'],
              group: 'hold',
            },
            amount: {
              type: 'number',
              group: 'hold',
            },
            reference: {
              type: 'string',
              description: 'Related job, order, dispute ID',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
            },
            notes: {
              type: 'string',
            },
          },
        },
      },

      // Transaction History (recent - full history via query)
      recentTransactions: {
        type: 'array',
        title: 'Recent Transactions',
        collapsible: true,
        readOnly: true,
        maxItems: 20,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['credit', 'debit', 'hold', 'release', 'adjustment'],
              group: 'txn',
            },
            category: {
              type: 'string',
              enum: [
                'earning', 'tip', 'bonus', 'commission', 'referral',
                'payout', 'fee', 'refund', 'chargeback', 'adjustment',
                'deposit_hold', 'deposit_release',
              ],
              group: 'txn',
            },
            amount: {
              type: 'number',
              group: 'txn',
            },
            balanceAfter: {
              type: 'number',
            },
            reference: {
              type: 'string',
              description: 'Job ID, payout ID, etc.',
            },
            description: {
              type: 'string',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },

      // Flags
      flags: {
        type: 'array',
        title: 'Flags',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['fraud_risk', 'chargeback_history', 'high_volume', 'verification_needed', 'other'],
              group: 'flag',
            },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              group: 'flag',
            },
            description: {
              type: 'string',
            },
            addedAt: {
              type: 'string',
              format: 'date-time',
            },
            addedBy: {
              type: 'string',
            },
          },
        },
      },

      // Freeze Info
      freezeInfo: {
        type: 'object',
        title: 'Freeze Information',
        collapsible: true,
        properties: {
          frozenAt: {
            type: 'string',
            format: 'date-time',
          },
          frozenBy: {
            type: 'string',
          },
          reason: {
            type: 'string',
          },
          unfreezeAt: {
            type: 'string',
            format: 'date-time',
            description: 'Scheduled unfreeze date',
          },
        },
      },

      // Notes
      internalNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: [],
  } as const;
};

const sc = WalletSchema();
export type WalletModel = FromSchema<typeof sc>;

registerCollection('Wallet', DataType.wallet, WalletSchema());
