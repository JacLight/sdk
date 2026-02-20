import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { PayrollEarningSchema, PayrollDeductionSchema, PayrollTaxSchema } from './payroll-run';

export const PayStubSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::ps-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: {
        type: 'string',
        group: 'employee',
      },
      payrollRunId: {
        type: 'string',
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
      checkNumber: {
        type: 'string',
        group: 'payment',
      },
      payType: {
        type: 'string',
        enum: ['salary', 'hourly', 'commission', 'mixed'],
        group: 'payment',
      },
      payMethod: {
        type: 'string',
        enum: ['direct_deposit', 'check', 'cash'],
        group: 'payment',
      },
      regularHours: { type: 'number', group: 'hours' },
      overtimeHours: { type: 'number', group: 'hours' },
      ptoHours: { type: 'number', group: 'hours' },
      holidayHours: { type: 'number', group: 'hours' },
      totalHours: { type: 'number', group: 'hours' },
      regularRate: { type: 'number', group: 'rates' },
      overtimeRate: { type: 'number', group: 'rates' },
      grossPay: { type: 'number', group: 'pay' },
      netPay: { type: 'number', group: 'pay' },
      earnings: {
        type: 'array',
        collapsible: true,
        items: PayrollEarningSchema(),
      },
      deductions: {
        type: 'array',
        collapsible: true,
        items: PayrollDeductionSchema(),
      },
      taxes: {
        type: 'array',
        collapsible: true,
        items: PayrollTaxSchema(),
      },
      ytdGrossPay: { type: 'number', group: 'ytd' },
      ytdNetPay: { type: 'number', group: 'ytd' },
      ytdTaxes: { type: 'number', group: 'ytd' },
      ytdDeductions: { type: 'number', group: 'ytd' },
      bankAccountLast4: { type: 'string' },
      depositDate: { type: 'string', format: 'date' },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['employeeId', 'payPeriodStart', 'payPeriodEnd', 'payDate', 'grossPay', 'netPay'],
  } as const;
};

const ps = PayStubSchema();
export type PayStubModel = FromSchema<typeof ps>;

registerCollection('Pay Stub', DataType.bm_pay_stub, PayStubSchema());
