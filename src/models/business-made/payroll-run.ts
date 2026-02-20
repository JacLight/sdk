import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const PayrollEarningSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      earningTemplateId: { type: 'string' },
      name: { type: 'string' },
      type: { type: 'string' },
      hours: { type: 'number' },
      rate: { type: 'number' },
      amount: { type: 'number' },
      isTaxable: { type: 'boolean', default: true },
    },
    required: ['id', 'name', 'amount'],
  } as const;
};

export const PayrollDeductionSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      deductionTemplateId: { type: 'string' },
      name: { type: 'string' },
      type: {
        type: 'string',
        enum: ['pretax', 'posttax'],
      },
      amount: { type: 'number' },
      ytdAmount: { type: 'number' },
    },
    required: ['id', 'name', 'type', 'amount'],
  } as const;
};

export const PayrollTaxSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      type: {
        type: 'string',
        enum: ['federal', 'state', 'local', 'fica_ss', 'fica_medicare', 'futa', 'suta'],
      },
      amount: { type: 'number' },
      ytdAmount: { type: 'number' },
    },
    required: ['id', 'name', 'type', 'amount'],
  } as const;
};

export const PayrollEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      payrollRunId: { type: 'string' },
      employeeId: { type: 'string' },
      status: {
        type: 'string',
        enum: ['draft', 'calculated', 'approved', 'processed', 'completed', 'error'],
        default: 'draft',
      },
      payType: {
        type: 'string',
        enum: ['salary', 'hourly', 'commission', 'mixed'],
      },
      payPeriodHours: { type: 'number' },
      regularHours: { type: 'number' },
      overtimeHours: { type: 'number' },
      ptoHours: { type: 'number' },
      holidayHours: { type: 'number' },
      grossPay: { type: 'number' },
      netPay: { type: 'number' },
      earnings: {
        type: 'array',
        items: PayrollEarningSchema(),
      },
      deductions: {
        type: 'array',
        items: PayrollDeductionSchema(),
      },
      taxes: {
        type: 'array',
        items: PayrollTaxSchema(),
      },
      ytdEarnings: { type: 'number' },
      ytdDeductions: { type: 'number' },
      ytdTaxes: { type: 'number' },
      paymentMethod: {
        type: 'string',
        enum: ['direct_deposit', 'check', 'cash'],
      },
      notes: { type: 'string' },
    },
    required: ['id', 'payrollRunId', 'employeeId', 'grossPay', 'netPay'],
  } as const;
};

export const PayrollRunSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::pr-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      payPeriodStart: {
        type: 'string',
        format: 'date',
        group: 'period',
      },
      payPeriodEnd: {
        type: 'string',
        format: 'date',
        group: 'period',
      },
      payDate: {
        type: 'string',
        format: 'date',
        group: 'period',
      },
      status: {
        type: 'string',
        enum: ['draft', 'calculating', 'review', 'approved', 'processing', 'completed', 'cancelled', 'error'],
        default: 'draft',
        group: 'status',
      },
      type: {
        type: 'string',
        enum: ['regular', 'off-cycle', 'bonus', 'termination'],
        default: 'regular',
        group: 'status',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      approvedById: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
      processedAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      payrollEntries: {
        type: 'array',
        collapsible: true,
        items: PayrollEntrySchema(),
      },
      totals: {
        type: 'object',
        readOnly: true,
        properties: {
          employeeCount: { type: 'number' },
          totalHours: { type: 'number' },
          totalGrossPay: { type: 'number' },
          totalNetPay: { type: 'number' },
          totalEmployeeTaxes: { type: 'number' },
          totalEmployerTaxes: { type: 'number' },
          totalDeductions: { type: 'number' },
          totalCompanyCost: { type: 'number' },
        },
      },
    },
    required: ['payPeriodStart', 'payPeriodEnd', 'payDate'],
  } as const;
};

const pr = PayrollRunSchema();
export type PayrollRunModel = FromSchema<typeof pr>;

const pe = PayrollEntrySchema();
export type PayrollEntryModel = FromSchema<typeof pe>;

registerCollection('Payroll Run', DataType.bm_payroll_run, PayrollRunSchema());
