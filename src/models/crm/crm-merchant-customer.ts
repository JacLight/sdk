import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from './crm-address';

/**
 * Merchant Customer - Business accounts that can order services now and pay later via invoice.
 * Can be used by any service (delivery, orders, subscriptions, etc.)
 */
export const MerchantCustomerSchema = () => {
  return {
    type: 'object',
    properties: {
      // Link to existing customer (merchant is a customer first)
      customer: {
        type: 'string',
        title: 'Customer Account',
        description: 'The customer who owns this merchant account',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'email',
        },
        group: 'company',
      },
      companyName: {
        type: 'string',
        minLength: 2,
        maxLength: 200,
        group: 'company',
      },
      tradeName: {
        type: 'string',
        description: 'DBA / Trading name',
        group: 'company',
      },
      status: {
        type: 'string',
        enum: ['pending', 'approved', 'suspended', 'closed'],
        default: 'pending',
        group: 'status',
      },
      accountType: {
        type: 'string',
        enum: ['standard', 'premium', 'enterprise'],
        default: 'standard',
        group: 'status',
      },
      billingAddress: {
        collapsible: true,
        ...AddressSchema(),
      },

      // Credit Settings
      credit: {
        type: 'object',
        title: 'Credit Settings',
        properties: {
          spendingLimit: {
            type: 'number',
            default: 5000,
            description: 'Total spending limit before invoice required',
            group: 'limit',
          },
          currentBalance: {
            type: 'number',
            default: 0,
            description: 'Current unpaid balance',
            readOnly: true,
            group: 'limit',
          },
          availableCredit: {
            type: 'number',
            description: 'Remaining credit (limit - balance)',
            readOnly: true,
            group: 'limit',
          },
          paymentTermsDays: {
            type: 'number',
            default: 30,
            description: 'NET payment terms (days)',
            group: 'terms',
          },
          billingCycleDay: {
            type: 'number',
            default: 1,
            description: 'Day of month for billing cycle (1-28)',
            minimum: 1,
            maximum: 28,
            group: 'terms',
          },
          autoInvoice: {
            type: 'boolean',
            default: true,
            description: 'Auto-generate invoices',
          },
          invoiceTrigger: {
            type: 'string',
            enum: ['limit_reached', 'period_end', 'either', 'manual'],
            default: 'either',
            description: 'What triggers invoice generation',
          },
        },
      },

      // Pricing (can override default pricing for this merchant)
      pricing: {
        type: 'object',
        title: 'Custom Pricing',
        description: 'Leave empty to use default pricing',
        collapsible: true,
        properties: {
          useCustomPricing: {
            type: 'boolean',
            default: false,
          },
          discountPercent: {
            type: 'number',
            description: 'Percentage discount on all transactions',
            group: 'discount',
          },
          discountFixed: {
            type: 'number',
            description: 'Fixed discount per transaction',
            group: 'discount',
          },
          // Legacy: specific delivery config (for backward compatibility)
          customConfig: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.delivery_config,
              value: 'name',
              label: 'title',
            },
            description: 'Use a specific delivery pricing config',
          },
          // Service-specific pricing configs can be added by each service
          customConfigs: {
            type: 'object',
            description: 'Service-specific custom pricing configs (keyed by service name)',
            additionalProperties: true,
          },
        },
      },

      // Services this merchant account can use
      enabledServices: {
        type: 'array',
        title: 'Enabled Services',
        description: 'Which services this merchant can charge to their account',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: { type: 'string' },
        dataSource: {
          source: 'json',
          json: ['delivery', 'orders', 'subscriptions', 'rentals', 'services', 'all'],
        },
        default: ['all'],
      },

      // Billing Period Tracking
      currentPeriod: {
        type: 'object',
        title: 'Current Billing Period',
        readOnly: true,
        properties: {
          startDate: {
            type: 'string',
            format: 'date',
            group: 'period',
          },
          endDate: {
            type: 'string',
            format: 'date',
            group: 'period',
          },
          transactionCount: {
            type: 'number',
            default: 0,
            description: 'Number of transactions in this period',
            group: 'stats',
          },
          // Legacy field alias
          jobCount: {
            type: 'number',
            default: 0,
            description: 'Number of jobs in this period (legacy alias for transactionCount)',
            group: 'stats',
          },
          totalAmount: {
            type: 'number',
            default: 0,
            group: 'stats',
          },
          transactions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                type: { type: 'string' }, // delivery, order, etc.
                amount: { type: 'number' },
                date: { type: 'string', format: 'date-time' },
              },
            },
            description: 'Transactions in this period',
          },
          // Legacy field: simple array of job IDs
          jobs: {
            type: 'array',
            items: { type: 'string' },
            description: 'Job IDs in this period (legacy)',
          },
        },
      },

      // Statistics
      stats: {
        type: 'object',
        title: 'Account Statistics',
        readOnly: true,
        collapsible: true,
        properties: {
          totalTransactions: {
            type: 'number',
            default: 0,
            group: 'transactions',
          },
          totalSpent: {
            type: 'number',
            default: 0,
            group: 'transactions',
          },
          averageTransactionValue: {
            type: 'number',
            default: 0,
          },
          lastTransactionDate: {
            type: 'string',
            format: 'date-time',
          },
          invoicesPaid: {
            type: 'number',
            default: 0,
            group: 'invoices',
          },
          invoicesOutstanding: {
            type: 'number',
            default: 0,
            group: 'invoices',
          },
          averagePaymentDays: {
            type: 'number',
            description: 'Average days to pay invoices',
          },
          // Legacy fields for backwards compat
          totalJobs: { type: 'number', default: 0 },
          averageJobValue: { type: 'number', default: 0 },
          lastJobDate: { type: 'string', format: 'date-time' },
        },
      },

      // Invoice History
      invoices: {
        type: 'array',
        title: 'Invoice History',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            invoiceId: {
              type: 'string',
              group: 'invoice',
            },
            invoiceNumber: {
              type: 'string',
              group: 'invoice',
            },
            periodStart: {
              type: 'string',
              format: 'date',
              group: 'period',
            },
            periodEnd: {
              type: 'string',
              format: 'date',
              group: 'period',
            },
            transactionCount: {
              type: 'number',
              group: 'amount',
            },
            // Legacy field alias
            jobCount: {
              type: 'number',
              group: 'amount',
            },
            amount: {
              type: 'number',
              group: 'amount',
            },
            status: {
              type: 'string',
              enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            dueDate: {
              type: 'string',
              format: 'date',
            },
            paidAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },

      authorizedUsers: {
        collapsible: true,
        type: 'array',
        title: 'Authorized Users',
        description:
          'Customers who can create transactions on this account (account owner is auto-authorized)',
        items: {
          type: 'object',
          properties: {
            customer: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.customer,
                value: 'sk',
                label: 'email',
              },
              group: 'user',
            },
            role: {
              type: 'string',
              enum: ['admin', 'manager', 'user'],
              default: 'user',
              group: 'user',
            },
            canApproveTransactions: {
              type: 'boolean',
              default: false,
            },
            // Legacy field alias
            canApproveJobs: {
              type: 'boolean',
              default: false,
            },
            spendingLimit: {
              type: 'number',
              description: 'Individual spending limit (0 = unlimited)',
            },
            enabledServices: {
              type: 'array',
              items: { type: 'string' },
              description: 'Which services this user can use (empty = all)',
            },
            addedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },

      // Approval History
      approvalHistory: {
        type: 'array',
        title: 'Approval History',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              group: 'approval',
            },
            action: {
              type: 'string',
              enum: [
                'created',
                'approved',
                'suspended',
                'reactivated',
                'limit_changed',
                'terms_changed',
              ],
              group: 'approval',
            },
            by: { type: 'string' },
            notes: { type: 'string' },
            previousValue: { type: 'string' },
            newValue: { type: 'string' },
          },
        },
      },

      // Tax Info
      taxInfo: {
        type: 'object',
        title: 'Tax Information',
        collapsible: true,
        properties: {
          taxId: {
            type: 'string',
            description: 'EIN / Tax ID',
            group: 'tax',
          },
          taxExempt: {
            type: 'boolean',
            default: false,
            group: 'tax',
          },
          taxExemptCertificate: {
            type: 'string',
            description: 'Tax exempt certificate number',
          },
        },
      },

      // Notes
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },

      // Timestamps
      approvedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      approvedBy: {
        type: 'string',
        readOnly: true,
      },
    },
    required: ['customer', 'companyName'],
  } as const;
};

const sc = MerchantCustomerSchema();
export type MerchantCustomerModel = FromSchema<typeof sc>;

/**
 * Merchant Account Statistics
 */
export interface MerchantAccountStats {
  totalTransactions: number;
  totalSpent: number;
  averageTransactionValue: number;
  lastTransactionDate: string;
  invoicesPaid: number;
  invoicesOutstanding: number;
  currentBalance: number;
  availableCredit: number;
}

/**
 * Billing Period information
 */
export interface BillingPeriod {
  startDate: string;
  endDate: string;
  transactionCount: number;
  totalAmount: number;
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
    reference?: string;
  }>;
}

/**
 * Invoice record for merchant billing
 */
export interface MerchantInvoice {
  invoiceId: string;
  invoiceNumber: string;
  periodStart: string;
  periodEnd: string;
  transactionCount: number;
  amount: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  createdAt: string;
  dueDate: string;
  paidAt?: string;
}

/**
 * Authorized user on a merchant account
 */
export interface MerchantAuthorizedUser {
  customer: string;
  role: 'admin' | 'manager' | 'user';
  canApproveTransactions: boolean;
  spendingLimit?: number;
  enabledServices?: string[];
  addedAt: string;
}

/**
 * Charge request for billing a merchant
 */
export interface MerchantChargeRequest {
  id: string;
  type: string;
  amount: number;
  reference?: string;
  description?: string;
}

registerCollection('Merchant Customer', DataType.merchant_customer, MerchantCustomerSchema());
