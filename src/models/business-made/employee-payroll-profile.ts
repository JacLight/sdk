import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const BankAccountSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      accountType: {
        type: 'string',
        enum: ['checking', 'savings'],
        group: 'account',
      },
      bankName: { type: 'string', group: 'account' },
      routingNumber: { type: 'string', group: 'numbers' },
      accountNumber: { type: 'string', group: 'numbers' },
      accountNumberLast4: { type: 'string', readOnly: true },
      isPrimary: { type: 'boolean', default: false },
      depositAmount: { type: 'number', group: 'deposit' },
      depositType: {
        type: 'string',
        enum: ['fixed', 'percentage', 'remainder'],
        group: 'deposit',
      },
      depositPercentage: { type: 'number', group: 'deposit' },
      status: {
        type: 'string',
        enum: ['pending', 'verified', 'failed'],
        default: 'pending',
      },
    },
    required: ['id', 'accountType', 'routingNumber', 'accountNumber'],
  } as const;
};

export const FederalTaxInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      filingStatus: {
        type: 'string',
        enum: ['single', 'married_filing_jointly', 'married_filing_separately', 'head_of_household'],
      },
      allowances: { type: 'number' },
      additionalWithholding: { type: 'number' },
      exempt: { type: 'boolean', default: false },
      w4Year: { type: 'number' },
      step2c: { type: 'boolean' },
      step3Dependents: { type: 'number' },
      step4aOtherIncome: { type: 'number' },
      step4bDeductions: { type: 'number' },
    },
    required: ['filingStatus'],
  } as const;
};

export const StateTaxInfoSchema = () => {
  return {
    type: 'object',
    properties: {
      state: { type: 'string' },
      filingStatus: { type: 'string' },
      allowances: { type: 'number' },
      additionalWithholding: { type: 'number' },
      exempt: { type: 'boolean', default: false },
    },
    required: ['state'],
  } as const;
};

export const PayrollDeductionSetupSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: {
        type: 'string',
        enum: ['pretax', 'posttax'],
      },
      category: {
        type: 'string',
        enum: ['retirement', 'health', 'garnishment', 'loan', 'other'],
      },
      amount: { type: 'number' },
      percentage: { type: 'number' },
      calculationType: {
        type: 'string',
        enum: ['fixed', 'percentage'],
      },
      frequency: {
        type: 'string',
        enum: ['per_pay_period', 'monthly', 'annually'],
      },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      isActive: { type: 'boolean', default: true },
    },
    required: ['id', 'name', 'type', 'calculationType', 'frequency'],
  } as const;
};

export const EmployeePayrollProfileSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::epp-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: {
        type: 'string',
        unique: true,
        group: 'employee',
      },
      payType: {
        type: 'string',
        enum: ['salary', 'hourly', 'commission', 'mixed'],
        group: 'pay',
      },
      baseSalary: { type: 'number', group: 'pay' },
      hourlyRate: { type: 'number', group: 'pay' },
      payFrequency: {
        type: 'string',
        enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'],
        group: 'pay',
      },
      federalTax: {
        type: 'object',
        collapsible: true,
        properties: FederalTaxInfoSchema().properties,
      },
      stateTax: {
        type: 'object',
        collapsible: true,
        properties: StateTaxInfoSchema().properties,
      },
      localTax: {
        type: 'object',
        collapsible: true,
        properties: {
          locality: { type: 'string' },
          rate: { type: 'number' },
          exempt: { type: 'boolean', default: false },
        },
      },
      bankAccounts: {
        type: 'array',
        collapsible: true,
        items: BankAccountSchema(),
      },
      paymentMethod: {
        type: 'string',
        enum: ['direct_deposit', 'check', 'cash'],
        default: 'direct_deposit',
      },
      deductions: {
        type: 'array',
        collapsible: true,
        items: PayrollDeductionSetupSchema(),
      },
      overtimeEligible: { type: 'boolean', default: true },
      overtimeRate: {
        type: 'number',
        description: 'Overtime rate multiplier (e.g., 1.5)',
        default: 1.5,
      },
      hireDate: { type: 'string', format: 'date' },
      terminationDate: { type: 'string', format: 'date' },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'terminated'],
        default: 'active',
        group: 'status',
      },
      lastPayDate: { type: 'string', format: 'date' },
      ytdGrossPay: { type: 'number', readOnly: true, group: 'ytd' },
      ytdNetPay: { type: 'number', readOnly: true, group: 'ytd' },
      ytdTaxes: { type: 'number', readOnly: true, group: 'ytd' },
    },
    required: ['employeeId', 'payType', 'payFrequency', 'paymentMethod'],
  } as const;
};

const epp = EmployeePayrollProfileSchema();
export type EmployeePayrollProfileModel = FromSchema<typeof epp>;

registerCollection('Employee Payroll Profile', DataType.bm_payroll_profile, EmployeePayrollProfileSchema());
