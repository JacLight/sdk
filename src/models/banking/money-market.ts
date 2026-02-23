import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../../types';
import { registerCollection } from '../../default-schema';

export const MoneyMarketAccountSchema = {
  type: 'object',
  properties: {
    // Account Identification
    accountId: { type: 'string', description: 'Unique account identifier' },
    accountNumber: { type: 'string', description: 'Customer-facing account number' },
    holderId: { type: 'string', description: 'Account holder ID' },
    linkedBankAccountId: { type: 'string', description: 'Primary funding bank account' },

    // Account Type
    accountType: {
      type: 'string',
      enum: ['money_market', 'high_yield_savings', 'cash_management'],
      description: 'Type of high-yield account',
    },
    productId: { type: 'string', description: 'Product ID for rate tier' },
    productName: { type: 'string' },

    // Balances
    currentBalance: { type: 'number', description: 'Current balance in cents' },
    availableBalance: { type: 'number', description: 'Available for withdrawal' },
    pendingDeposits: { type: 'number' },
    pendingWithdrawals: { type: 'number' },
    minimumBalance: { type: 'number', description: 'Minimum balance requirement' },
    currency: { type: 'string', default: 'USD' },

    // Interest
    interestRate: { type: 'number', description: 'Current APY (e.g., 4.5 for 4.5%)' },
    baseRate: { type: 'number', description: 'Base rate before tier bonuses' },
    bonusRate: { type: 'number', description: 'Bonus rate for balance tier' },
    interestAccrued: { type: 'number', description: 'Accrued interest pending payment' },
    interestPaidYTD: { type: 'number', description: 'Interest paid year-to-date' },
    interestPaidLifetime: { type: 'number', description: 'Total interest paid' },
    lastInterestPaymentDate: { type: 'string', format: 'date-time' },
    interestPaymentFrequency: {
      type: 'string',
      enum: ['daily', 'monthly', 'quarterly'],
      default: 'monthly',
    },
    compoundingFrequency: {
      type: 'string',
      enum: ['daily', 'monthly', 'quarterly', 'annually'],
      default: 'daily',
    },

    // Rate Tiers
    rateTier: {
      type: 'object',
      properties: {
        tierId: { type: 'string' },
        tierName: { type: 'string' },
        minBalance: { type: 'number' },
        maxBalance: { type: 'number' },
        apy: { type: 'number' },
      },
    },

    // Limits
    monthlyWithdrawalLimit: { type: 'number', description: 'Max withdrawals per month' },
    withdrawalsThisMonth: { type: 'number' },
    dailyWithdrawalLimit: { type: 'number' },
    maxTransferAmount: { type: 'number' },

    // Status
    status: {
      type: 'string',
      enum: ['pending', 'active', 'restricted', 'dormant', 'closed'],
    },
    openedDate: { type: 'string', format: 'date-time' },
    closedDate: { type: 'string', format: 'date-time' },
    lastActivityDate: { type: 'string', format: 'date-time' },

    // Sweep Configuration
    sweepEnabled: { type: 'boolean', default: false },
    sweepConfig: {
      type: 'object',
      properties: {
        sourceAccountId: { type: 'string', description: 'Account to sweep from' },
        targetBalance: { type: 'number', description: 'Target balance to maintain in source' },
        sweepThreshold: { type: 'number', description: 'Minimum amount to sweep' },
        sweepFrequency: { type: 'string', enum: ['daily', 'weekly', 'monthly'] },
        lastSweepDate: { type: 'string', format: 'date-time' },
      },
    },

    // Auto-invest (for cash management accounts)
    autoInvestEnabled: { type: 'boolean', default: false },
    autoInvestConfig: {
      type: 'object',
      properties: {
        targetAllocation: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              assetType: { type: 'string' },
              percentage: { type: 'number' },
            },
          },
        },
        rebalanceFrequency: { type: 'string' },
      },
    },

    // FDIC/Insurance
    insuranceStatus: {
      type: 'string',
      enum: ['fully_insured', 'partially_insured', 'not_insured'],
    },
    insuredAmount: { type: 'number', description: 'FDIC insured amount' },

    // Tax Reporting
    taxWithholding: { type: 'boolean', default: false },
    taxWithholdingPercent: { type: 'number' },
    form1099Generated: { type: 'boolean' },

    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['accountId', 'holderId', 'accountType', 'status'],
} as const;

export const InterestRateTierSchema = {
  type: 'object',
  properties: {
    tierId: { type: 'string' },
    productId: { type: 'string' },
    tierName: { type: 'string' },

    // Balance Requirements
    minBalance: { type: 'number' },
    maxBalance: { type: 'number' },

    // Rates
    apy: { type: 'number', description: 'Annual Percentage Yield' },
    apr: { type: 'number', description: 'Annual Percentage Rate' },

    // Effective Dates
    effectiveDate: { type: 'string', format: 'date-time' },
    expirationDate: { type: 'string', format: 'date-time' },

    // Status
    isActive: { type: 'boolean', default: true },

    // Promotional
    isPromoRate: { type: 'boolean', default: false },
    promoEndDate: { type: 'string', format: 'date-time' },
    postPromoRate: { type: 'number' },
  },
  required: ['tierId', 'productId', 'minBalance', 'apy'],
} as const;

export type MoneyMarketAccountModel = FromSchema<typeof MoneyMarketAccountSchema>;
export type InterestRateTierModel = FromSchema<typeof InterestRateTierSchema>;

registerCollection('Money Market Account', DataType.money_market_account, MoneyMarketAccountSchema);
registerCollection('Interest Rate Tier', DataType.interest_rate_tier, InterestRateTierSchema);
