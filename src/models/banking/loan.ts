import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../../types';
import { registerCollection } from '../../default-schema';

export const LoanSchema = {
  type: 'object',
  properties: {
    // Loan Identification
    loanId: { type: 'string', description: 'Unique loan identifier' },
    loanNumber: { type: 'string', description: 'Customer-facing loan number' },
    applicationId: { type: 'string', description: 'Link to loan application' },

    // Loan Type & Product
    loanType: {
      type: 'string',
      enum: ['personal', 'business', 'line_of_credit', 'mortgage', 'auto', 'student', 'equipment', 'invoice_financing'],
      description: 'Type of loan',
    },
    productId: { type: 'string', description: 'Loan product/program ID' },
    productName: { type: 'string', description: 'Loan product name' },

    // Borrower Information
    borrowerId: { type: 'string', description: 'Primary borrower (account holder ID)' },
    borrowerType: { type: 'string', enum: ['individual', 'business'], description: 'Borrower type' },
    coBorrowerId: { type: 'string', description: 'Co-borrower ID if applicable' },
    guarantorIds: {
      type: 'array',
      items: { type: 'string' },
      description: 'Guarantor IDs',
    },

    // Loan Terms
    principalAmount: { type: 'number', description: 'Original loan amount in cents' },
    currency: { type: 'string', default: 'USD' },
    interestRate: { type: 'number', description: 'Annual interest rate (e.g., 7.5 for 7.5%)' },
    interestType: {
      type: 'string',
      enum: ['fixed', 'variable', 'hybrid'],
      description: 'Interest rate type',
    },
    apr: { type: 'number', description: 'Annual Percentage Rate including fees' },
    termMonths: { type: 'number', description: 'Loan term in months' },
    paymentFrequency: {
      type: 'string',
      enum: ['weekly', 'biweekly', 'monthly', 'quarterly'],
      default: 'monthly',
    },

    // Amortization
    amortizationType: {
      type: 'string',
      enum: ['fully_amortizing', 'interest_only', 'balloon', 'bullet'],
      description: 'Amortization schedule type',
    },
    paymentAmount: { type: 'number', description: 'Regular payment amount in cents' },
    totalPayments: { type: 'number', description: 'Total number of payments' },
    balloonAmount: { type: 'number', description: 'Balloon payment amount if applicable' },

    // Dates
    applicationDate: { type: 'string', format: 'date-time' },
    approvalDate: { type: 'string', format: 'date-time' },
    fundingDate: { type: 'string', format: 'date-time' },
    firstPaymentDate: { type: 'string', format: 'date-time' },
    maturityDate: { type: 'string', format: 'date-time' },
    nextPaymentDate: { type: 'string', format: 'date-time' },

    // Balances
    currentBalance: { type: 'number', description: 'Current outstanding balance in cents' },
    principalBalance: { type: 'number', description: 'Remaining principal balance' },
    accruedInterest: { type: 'number', description: 'Accrued unpaid interest' },
    totalInterestPaid: { type: 'number', description: 'Total interest paid to date' },
    totalPrincipalPaid: { type: 'number', description: 'Total principal paid to date' },

    // Payment Status
    paymentsMade: { type: 'number', description: 'Number of payments made' },
    paymentsRemaining: { type: 'number', description: 'Remaining payments' },
    lastPaymentDate: { type: 'string', format: 'date-time' },
    lastPaymentAmount: { type: 'number' },
    daysPastDue: { type: 'number', default: 0 },
    pastDueAmount: { type: 'number', default: 0 },

    // Status
    status: {
      type: 'string',
      enum: [
        'pending_application',
        'under_review',
        'approved',
        'pending_funding',
        'active',
        'current',
        'past_due',
        'delinquent',
        'default',
        'charged_off',
        'paid_off',
        'closed',
        'denied',
        'withdrawn',
      ],
      description: 'Loan status',
    },
    delinquencyStatus: {
      type: 'string',
      enum: ['current', '30_days', '60_days', '90_days', '120_plus'],
    },

    // Collateral (for secured loans)
    isSecured: { type: 'boolean', default: false },
    collateral: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: ['real_estate', 'vehicle', 'equipment', 'inventory', 'receivables', 'securities', 'other'] },
        description: { type: 'string' },
        estimatedValue: { type: 'number' },
        lienPosition: { type: 'number' },
        ltvRatio: { type: 'number', description: 'Loan-to-value ratio' },
      },
    },

    // Fees
    originationFee: { type: 'number', description: 'Origination fee in cents' },
    originationFeePercent: { type: 'number' },
    lateFee: { type: 'number', description: 'Late payment fee' },
    lateFeeGraceDays: { type: 'number', default: 15 },
    prepaymentPenalty: { type: 'boolean', default: false },
    prepaymentPenaltyPercent: { type: 'number' },

    // Underwriting
    creditScore: { type: 'number', description: 'Credit score at origination' },
    dti: { type: 'number', description: 'Debt-to-income ratio' },
    riskGrade: { type: 'string', description: 'Internal risk grade (A, B, C, D, E)' },
    underwritingNotes: { type: 'string' },

    // Disbursement
    disbursementMethod: {
      type: 'string',
      enum: ['ach', 'wire', 'check', 'internal_transfer'],
    },
    disbursementAccountId: { type: 'string', description: 'Bank account for disbursement' },

    // Repayment
    repaymentAccountId: { type: 'string', description: 'Bank account for auto-pay' },
    autopayEnabled: { type: 'boolean', default: false },
    autopayDay: { type: 'number', description: 'Day of month for autopay (1-28)' },

    // Line of Credit specific
    creditLimit: { type: 'number', description: 'Credit limit for LOC' },
    availableCredit: { type: 'number', description: 'Available credit for LOC' },
    drawPeriodEndDate: { type: 'string', format: 'date-time' },
    repaymentPeriodEndDate: { type: 'string', format: 'date-time' },

    // Metadata
    purpose: { type: 'string', description: 'Loan purpose' },
    notes: { type: 'string' },
    metadata: { type: 'object', additionalProperties: true },
    documents: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          name: { type: 'string' },
          url: { type: 'string' },
          uploadedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  required: ['loanType', 'borrowerId', 'principalAmount', 'interestRate', 'termMonths', 'status'],
} as const;

export const LoanApplicationSchema = {
  type: 'object',
  properties: {
    applicationId: { type: 'string' },
    applicantId: { type: 'string' },
    applicantType: { type: 'string', enum: ['individual', 'business'] },

    // Requested Terms
    requestedAmount: { type: 'number' },
    requestedTermMonths: { type: 'number' },
    loanPurpose: { type: 'string' },
    loanType: { type: 'string' },

    // Applicant Financial Info
    annualIncome: { type: 'number' },
    monthlyExpenses: { type: 'number' },
    employmentStatus: { type: 'string', enum: ['employed', 'self_employed', 'retired', 'unemployed', 'student'] },
    employerName: { type: 'string' },
    yearsEmployed: { type: 'number' },

    // Business Info (for business loans)
    businessName: { type: 'string' },
    businessType: { type: 'string' },
    yearsInBusiness: { type: 'number' },
    annualRevenue: { type: 'number' },

    // Credit & Risk
    creditScoreSelf: { type: 'number', description: 'Self-reported credit score' },
    creditScorePulled: { type: 'number', description: 'Actual pulled credit score' },
    existingDebts: { type: 'number' },
    bankruptcyHistory: { type: 'boolean' },

    // Status
    status: {
      type: 'string',
      enum: ['draft', 'submitted', 'under_review', 'pending_documents', 'approved', 'denied', 'withdrawn', 'expired'],
    },
    submittedAt: { type: 'string', format: 'date-time' },
    reviewedAt: { type: 'string', format: 'date-time' },
    reviewedBy: { type: 'string' },
    decisionAt: { type: 'string', format: 'date-time' },
    denialReason: { type: 'string' },

    // Approved Terms (may differ from requested)
    approvedAmount: { type: 'number' },
    approvedRate: { type: 'number' },
    approvedTermMonths: { type: 'number' },
    conditions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Conditions for approval',
    },

    // Documents
    requiredDocuments: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string' },
          status: { type: 'string', enum: ['required', 'received', 'verified', 'rejected'] },
          url: { type: 'string' },
        },
      },
    },

    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['applicantId', 'requestedAmount', 'loanType', 'status'],
} as const;

export const LoanPaymentSchema = {
  type: 'object',
  properties: {
    paymentId: { type: 'string' },
    loanId: { type: 'string' },
    paymentNumber: { type: 'number' },

    // Payment Details
    amount: { type: 'number', description: 'Total payment amount' },
    principalAmount: { type: 'number' },
    interestAmount: { type: 'number' },
    feeAmount: { type: 'number' },
    escrowAmount: { type: 'number' },

    // Dates
    dueDate: { type: 'string', format: 'date-time' },
    paidDate: { type: 'string', format: 'date-time' },

    // Status
    status: {
      type: 'string',
      enum: ['scheduled', 'pending', 'processing', 'completed', 'failed', 'reversed', 'waived'],
    },

    // Payment Method
    paymentMethod: { type: 'string', enum: ['ach', 'wire', 'check', 'card', 'internal'] },
    sourceAccountId: { type: 'string' },
    transactionId: { type: 'string' },

    // Balance After
    balanceAfterPayment: { type: 'number' },

    // Late Payment
    isLate: { type: 'boolean' },
    daysLate: { type: 'number' },
    lateFeeApplied: { type: 'number' },

    metadata: { type: 'object', additionalProperties: true },
  },
  required: ['loanId', 'amount', 'dueDate', 'status'],
} as const;

export type LoanModel = FromSchema<typeof LoanSchema>;
export type LoanApplicationModel = FromSchema<typeof LoanApplicationSchema>;
export type LoanPaymentModel = FromSchema<typeof LoanPaymentSchema>;

registerCollection('Loan', DataType.loan, LoanSchema);
registerCollection('Loan Application', DataType.loan_application, LoanApplicationSchema);
registerCollection('Loan Payment', DataType.loan_payment, LoanPaymentSchema);
