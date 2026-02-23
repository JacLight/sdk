import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const BankingAccountSchema = () => {
  return {
    type: 'object',
    properties: {
      // Account Identification
      accountNumber: {
        type: 'string',
        description: 'Real bank account number',
        group: 'identification',
      },
      routingNumber: {
        type: 'string',
        description: 'ABA routing number',
        group: 'identification',
      },
      accountType: {
        type: 'string',
        enum: ['checking', 'savings', 'business_checking', 'business_savings'],
        default: 'checking',
        group: 'identification',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'active', 'frozen', 'closed'],
        default: 'pending',
        group: 'status',
      },

      // Account Holder
      holderId: {
        type: 'string',
        description: 'Links to bank_account_holder',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.bank_account_holder,
          value: 'sk',
          label: ['name', 'email'],
        },
        group: 'holder',
      },
      holderType: {
        type: 'string',
        enum: ['individual', 'business'],
        default: 'individual',
        group: 'holder',
      },

      // Balances (in cents)
      currentBalance: {
        type: 'number',
        default: 0,
        description: 'Current balance in cents',
        group: 'balance',
      },
      availableBalance: {
        type: 'number',
        default: 0,
        description: 'Available balance in cents',
        group: 'balance',
      },
      pendingBalance: {
        type: 'number',
        default: 0,
        description: 'Pending balance in cents',
        group: 'balance',
      },

      // Currency
      currency: {
        type: 'string',
        default: 'USD',
        group: 'balance',
      },

      // Ledger Integration
      ledgerAccountId: {
        type: 'string',
        description: 'Links to double-entry ledger account',
        group: 'ledger',
      },

      // Provider Info
      provider: {
        type: 'string',
        enum: ['internal', 'sponsor_bank'],
        default: 'sponsor_bank',
        group: 'provider',
      },
      providerAccountId: {
        type: 'string',
        description: 'External provider account ID',
        group: 'provider',
      },
      fedAccountNumber: {
        type: 'string',
        description: 'Federal Reserve account number for Fed connections',
        group: 'provider',
      },

      // Interest & Fees
      interestRate: {
        type: 'number',
        description: 'Annual interest rate (APY)',
        group: 'terms',
      },
      monthlyFee: {
        type: 'number',
        default: 0,
        description: 'Monthly maintenance fee in cents',
        group: 'terms',
      },
      minimumBalance: {
        type: 'number',
        default: 0,
        description: 'Minimum balance requirement in cents',
        group: 'terms',
      },

      // Limits
      limits: {
        type: 'object',
        title: 'Account Limits',
        collapsible: true,
        properties: {
          dailyWithdrawal: {
            type: 'number',
            description: 'Daily withdrawal limit in cents',
            group: 'limits',
          },
          dailyTransfer: {
            type: 'number',
            description: 'Daily transfer limit in cents',
            group: 'limits',
          },
          monthlyTransactions: {
            type: 'number',
            description: 'Monthly transaction limit (savings accounts)',
            group: 'limits',
          },
        },
      },

      // Features
      features: {
        type: 'object',
        title: 'Account Features',
        collapsible: true,
        properties: {
          achEnabled: {
            type: 'boolean',
            default: true,
            group: 'features',
          },
          wireEnabled: {
            type: 'boolean',
            default: false,
            group: 'features',
          },
          rtpEnabled: {
            type: 'boolean',
            default: false,
            description: 'Real-Time Payments enabled',
            group: 'features',
          },
          cardIssuing: {
            type: 'boolean',
            default: false,
            description: 'Can issue debit cards',
            group: 'features',
          },
          checkWriting: {
            type: 'boolean',
            default: false,
            group: 'features',
          },
        },
      },

      // Compliance
      kycStatus: {
        type: 'string',
        enum: ['pending', 'approved', 'rejected', 'review_required'],
        default: 'pending',
        group: 'compliance',
      },
      kycVerifiedAt: {
        type: 'string',
        format: 'date-time',
        group: 'compliance',
      },

      // Metadata
      openedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      closedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      lastActivityAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },

      // Internal Notes
      internalNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: ['accountType', 'holderId', 'holderType'],
  } as const;
};

const sc = BankingAccountSchema();
export type BankAccountModel = FromSchema<typeof sc>;

registerCollection('Bank Account', DataType.bank_account, BankingAccountSchema());
