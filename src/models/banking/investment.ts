import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../../types';
import { registerCollection } from '../../default-schema';

export const InvestmentAccountSchema = {
  type: 'object',
  properties: {
    // Account Identification
    accountId: { type: 'string', description: 'Unique investment account ID' },
    accountNumber: { type: 'string' },
    holderId: { type: 'string', description: 'Account holder ID' },

    // Account Type
    accountType: {
      type: 'string',
      enum: ['brokerage', 'treasury_direct', 'cd_portfolio', 'fixed_income'],
      description: 'Type of investment account',
    },

    // Balances
    totalValue: { type: 'number', description: 'Total portfolio value in cents' },
    cashBalance: { type: 'number', description: 'Uninvested cash' },
    investedBalance: { type: 'number', description: 'Value of investments' },
    pendingSettlement: { type: 'number' },
    currency: { type: 'string', default: 'USD' },

    // Performance
    totalReturn: { type: 'number', description: 'Total return in cents' },
    totalReturnPercent: { type: 'number' },
    ytdReturn: { type: 'number' },
    ytdReturnPercent: { type: 'number' },

    // Holdings Summary
    holdingsCount: { type: 'number' },

    // Linked Accounts
    linkedBankAccountId: { type: 'string' },

    // Status
    status: {
      type: 'string',
      enum: ['pending', 'active', 'restricted', 'closed'],
    },
    openedDate: { type: 'string', format: 'date-time' },

    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['accountId', 'holderId', 'accountType', 'status'],
} as const;

export const TreasuryBillSchema = {
  type: 'object',
  properties: {
    // Identification
    holdingId: { type: 'string', description: 'Unique holding ID' },
    investmentAccountId: { type: 'string' },
    cusip: { type: 'string', description: 'CUSIP identifier' },

    // Security Details
    securityType: {
      type: 'string',
      enum: ['t_bill', 't_note', 't_bond', 'tips', 'frn', 'savings_bond'],
      description: 'Type of Treasury security',
    },
    term: {
      type: 'string',
      enum: ['4_week', '8_week', '13_week', '17_week', '26_week', '52_week', '2_year', '3_year', '5_year', '7_year', '10_year', '20_year', '30_year'],
    },

    // Purchase Details
    purchaseDate: { type: 'string', format: 'date-time' },
    purchasePrice: { type: 'number', description: 'Purchase price in cents' },
    faceValue: { type: 'number', description: 'Par/face value in cents' },
    quantity: { type: 'number', description: 'Number of securities', default: 1 },

    // Yield & Interest
    discountRate: { type: 'number', description: 'Discount rate at purchase' },
    yieldToMaturity: { type: 'number', description: 'YTM at purchase' },
    couponRate: { type: 'number', description: 'Coupon rate (for notes/bonds)' },
    interestPaymentFrequency: {
      type: 'string',
      enum: ['none', 'semiannual', 'quarterly', 'monthly'],
    },
    nextInterestDate: { type: 'string', format: 'date-time' },
    accruedInterest: { type: 'number' },

    // Dates
    issueDate: { type: 'string', format: 'date-time' },
    maturityDate: { type: 'string', format: 'date-time' },

    // Current Value
    currentPrice: { type: 'number', description: 'Current market price per $100 face' },
    currentValue: { type: 'number', description: 'Current total value' },
    unrealizedGainLoss: { type: 'number' },

    // Reinvestment
    autoReinvest: { type: 'boolean', default: false },
    reinvestmentInstructions: {
      type: 'object',
      properties: {
        reinvestAt: { type: 'string', enum: ['maturity', 'interest_payment'] },
        targetSecurityType: { type: 'string' },
        targetTerm: { type: 'string' },
      },
    },

    // Status
    status: {
      type: 'string',
      enum: ['pending_settlement', 'held', 'maturing_soon', 'matured', 'sold', 'redeemed'],
    },

    // Auction Details (for direct purchases)
    auctionDate: { type: 'string', format: 'date-time' },
    bidType: { type: 'string', enum: ['competitive', 'noncompetitive'] },

    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['holdingId', 'investmentAccountId', 'securityType', 'faceValue', 'maturityDate', 'status'],
} as const;

export const CertificateOfDepositSchema = {
  type: 'object',
  properties: {
    // Identification
    cdId: { type: 'string', description: 'Unique CD ID' },
    investmentAccountId: { type: 'string' },
    cdNumber: { type: 'string' },

    // CD Details
    cdType: {
      type: 'string',
      enum: ['standard', 'jumbo', 'brokered', 'callable', 'step_up', 'bump_up', 'no_penalty'],
    },
    term: {
      type: 'string',
      enum: ['1_month', '3_month', '6_month', '9_month', '1_year', '18_month', '2_year', '3_year', '4_year', '5_year'],
    },
    termDays: { type: 'number' },

    // Principal & Interest
    principalAmount: { type: 'number', description: 'Principal in cents' },
    interestRate: { type: 'number', description: 'APY' },
    compoundingFrequency: {
      type: 'string',
      enum: ['daily', 'monthly', 'quarterly', 'semiannually', 'annually', 'at_maturity'],
    },
    interestPaymentFrequency: {
      type: 'string',
      enum: ['monthly', 'quarterly', 'semiannually', 'annually', 'at_maturity'],
    },

    // Accrued Values
    accruedInterest: { type: 'number' },
    interestPaidToDate: { type: 'number' },
    currentValue: { type: 'number' },
    maturityValue: { type: 'number', description: 'Projected value at maturity' },

    // Dates
    purchaseDate: { type: 'string', format: 'date-time' },
    issueDate: { type: 'string', format: 'date-time' },
    maturityDate: { type: 'string', format: 'date-time' },
    nextInterestDate: { type: 'string', format: 'date-time' },

    // Early Withdrawal
    earlyWithdrawalPenalty: { type: 'number', description: 'Penalty in days of interest' },
    earlyWithdrawalAllowed: { type: 'boolean', default: true },

    // Renewal
    autoRenew: { type: 'boolean', default: false },
    renewalTerm: { type: 'string' },
    renewalGracePeriodDays: { type: 'number', default: 10 },
    renewalInstructions: {
      type: 'string',
      enum: ['renew_same_term', 'renew_different_term', 'transfer_to_savings', 'transfer_to_checking'],
    },

    // Issuer
    issuingBank: { type: 'string' },
    issuingBankId: { type: 'string' },

    // Insurance
    fdidInsured: { type: 'boolean', default: true },
    insuredAmount: { type: 'number' },

    // Status
    status: {
      type: 'string',
      enum: ['pending', 'active', 'maturing_soon', 'matured', 'renewed', 'closed', 'early_withdrawn'],
    },

    // Callable CD specific
    isCallable: { type: 'boolean', default: false },
    callDate: { type: 'string', format: 'date-time' },
    callProtectionPeriod: { type: 'number', description: 'Days before callable' },

    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['cdId', 'investmentAccountId', 'cdType', 'principalAmount', 'interestRate', 'maturityDate', 'status'],
} as const;

export const InvestmentTransactionSchema = {
  type: 'object',
  properties: {
    transactionId: { type: 'string' },
    investmentAccountId: { type: 'string' },
    holdingId: { type: 'string' },

    // Transaction Type
    transactionType: {
      type: 'string',
      enum: [
        'buy', 'sell', 'dividend', 'interest', 'maturity',
        'deposit', 'withdrawal', 'fee', 'transfer_in', 'transfer_out',
        'reinvestment', 'early_redemption',
      ],
    },

    // Details
    amount: { type: 'number' },
    quantity: { type: 'number' },
    price: { type: 'number' },
    fees: { type: 'number' },
    netAmount: { type: 'number' },

    // Dates
    tradeDate: { type: 'string', format: 'date-time' },
    settlementDate: { type: 'string', format: 'date-time' },

    // Status
    status: {
      type: 'string',
      enum: ['pending', 'processing', 'settled', 'failed', 'cancelled'],
    },

    description: { type: 'string' },
    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['transactionId', 'investmentAccountId', 'transactionType', 'amount', 'status'],
} as const;

export type InvestmentAccountModel = FromSchema<typeof InvestmentAccountSchema>;
export type TreasuryBillModel = FromSchema<typeof TreasuryBillSchema>;
export type CertificateOfDepositModel = FromSchema<typeof CertificateOfDepositSchema>;
export type InvestmentTransactionModel = FromSchema<typeof InvestmentTransactionSchema>;

registerCollection('Investment Account', DataType.investment_account, InvestmentAccountSchema);
registerCollection('Treasury Holding', DataType.treasury_holding, TreasuryBillSchema);
registerCollection('Certificate of Deposit', DataType.certificate_of_deposit, CertificateOfDepositSchema);
registerCollection('Investment Transaction', DataType.investment_transaction, InvestmentTransactionSchema);
