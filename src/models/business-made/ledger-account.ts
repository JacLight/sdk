import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const LedgerAccountSchema = () => {
  return {
    type: 'object',
    properties: {
      // Account Identification
      accountCode: {
        type: 'string',
        pattern: '^[0-9]{4,10}$',
        description: 'Chart of accounts code (e.g., 1000, 2000)',
        unique: true,
        group: 'identification',
      },
      accountName: {
        type: 'string',
        group: 'identification',
      },

      // Account Type (fundamental accounting equation)
      accountType: {
        type: 'string',
        enum: ['asset', 'liability', 'equity', 'revenue', 'expense'],
        description: 'Fundamental account type for double-entry',
        group: 'type',
      },
      normalBalance: {
        type: 'string',
        enum: ['debit', 'credit'],
        description: 'Normal balance side (assets/expenses = debit, liabilities/equity/revenue = credit)',
        group: 'type',
      },

      // Sub-classification
      subType: {
        type: 'string',
        enum: [
          // Assets
          'cash', 'bank', 'accounts_receivable', 'inventory', 'prepaid', 'fixed_asset', 'other_asset',
          // Liabilities
          'accounts_payable', 'accrued_liability', 'deferred_revenue', 'loan', 'other_liability',
          // Equity
          'retained_earnings', 'capital', 'drawings',
          // Revenue
          'sales_revenue', 'service_revenue', 'interest_income', 'other_income',
          // Expense
          'cost_of_goods', 'operating_expense', 'payroll', 'interest_expense', 'other_expense',
        ],
        group: 'type',
      },

      // Hierarchy
      parentAccountId: {
        type: 'string',
        description: 'Parent ledger account for sub-accounts',
        group: 'hierarchy',
      },
      level: {
        type: 'number',
        default: 0,
        description: 'Depth in account hierarchy',
        group: 'hierarchy',
      },

      // Balance
      balance: {
        type: 'number',
        default: 0,
        description: 'Current balance (positive for normal balance side)',
        group: 'balance',
      },
      debitBalance: {
        type: 'number',
        default: 0,
        description: 'Total debits',
        group: 'balance',
      },
      creditBalance: {
        type: 'number',
        default: 0,
        description: 'Total credits',
        group: 'balance',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'balance',
      },

      // Linked Entity
      linkedEntityType: {
        type: 'string',
        enum: ['bank_account', 'customer', 'vendor', 'employee', 'none'],
        default: 'none',
        group: 'linked',
      },
      linkedEntityId: {
        type: 'string',
        group: 'linked',
      },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'closed'],
        default: 'active',
        group: 'status',
      },
      isSystemAccount: {
        type: 'boolean',
        default: false,
        description: 'System accounts cannot be deleted',
        group: 'status',
      },
      allowManualEntries: {
        type: 'boolean',
        default: true,
        description: 'Whether manual journal entries are allowed',
        group: 'status',
      },

      // Reconciliation
      lastReconciledAt: {
        type: 'string',
        format: 'date-time',
        group: 'reconciliation',
      },
      reconciledBalance: {
        type: 'number',
        group: 'reconciliation',
      },

      // Description
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        group: 'info',
      },

      // Metadata
      createdAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
    },
    required: ['accountCode', 'accountName', 'accountType', 'normalBalance'],
  } as const;
};

const sc = LedgerAccountSchema();
export type LedgerAccountModel = FromSchema<typeof sc>;

registerCollection('Ledger Account', DataType.ledger_account, LedgerAccountSchema());
