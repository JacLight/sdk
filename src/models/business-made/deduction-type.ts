import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * Org-level catalog of deduction types (401k, Health Premium, Staff Loan
 * template, Garnishment, Charity, etc.). Per-employee assignment lives in
 * `bm_employee_deduction` — that record references one of these and may
 * override the amount/percentage.
 *
 * `taxTreatment`: pretax deductions reduce taxable wages (and optionally
 * FICA wages). Posttax come out of net pay.
 *
 * For loans (category=loan), the per-employee assignment carries the
 * principal + remaining balance. The catalog row is the template that says
 * "we offer staff loans" — actual amounts live per-employee.
 */
export const DeductionTypeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Display name on pay stub (e.g. "401(k)", "Health Premium", "Staff Loan")',
        group: 'name',
      },
      code: {
        type: 'string',
        description: 'Short code for reports / GL',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      taxTreatment: {
        type: 'string',
        enum: ['pretax', 'posttax'],
        default: 'posttax',
        group: 'tax',
      },
      category: {
        type: 'string',
        enum: ['retirement', 'health', 'dental', 'vision', 'hsa', 'fsa', 'garnishment', 'loan', 'charity', 'union', 'benefit', 'other'],
        default: 'other',
        group: 'name',
      },
      calculationType: {
        type: 'string',
        enum: ['fixed', 'percentage'],
        default: 'fixed',
        description: 'fixed: dollar amount per pay. percentage: percent of (eligible) gross.',
        group: 'calc',
      },
      defaultAmount: {
        type: 'number',
        description: 'Default per-pay amount (fixed). Per-employee override allowed.',
        group: 'calc',
      },
      defaultPercentage: {
        type: 'number',
        description: 'Default per-pay percentage 0–100 (percentage). Per-employee override allowed.',
        group: 'calc',
      },
      employerMatchPercentage: {
        type: 'number',
        description: 'Employer-match % (e.g. 401k match). 0 if none.',
        group: 'calc',
      },
      employerMatchCap: {
        type: 'number',
        description: 'Cap on employer match per pay (e.g. 6% match capped at $200/pay)',
        group: 'calc',
      },
      reducesFederalTaxable: {
        type: 'boolean',
        default: false,
        description: 'When pretax: whether this deduction reduces federal taxable wages',
        group: 'tax',
      },
      reducesStateTaxable: {
        type: 'boolean',
        default: false,
        description: 'When pretax: reduces state taxable wages',
        group: 'tax',
      },
      reducesFicaWages: {
        type: 'boolean',
        default: false,
        description: 'When pretax: reduces FICA wage base (HSA/health typically yes; 401k typically no)',
        group: 'tax',
      },
      perPayCap: {
        type: 'number',
        description: 'Maximum amount that can be deducted in one pay period',
        group: 'cap',
      },
      annualCap: {
        type: 'number',
        description: 'Maximum total per calendar year (e.g. 401k $23,000 IRS limit)',
        group: 'cap',
      },
      glAccount: {
        type: 'string',
        description: 'Liability account where withheld funds are held',
        group: 'gl',
      },
      glEmployerExpenseAccount: {
        type: 'string',
        description: 'Expense account for employer match portion',
        group: 'gl',
      },
      active: {
        type: 'boolean',
        default: true,
      },
    },
    required: ['name', 'taxTreatment', 'category', 'calculationType'],
  } as const;
};

const ds = DeductionTypeSchema();
export type DeductionTypeModel = FromSchema<typeof ds>;

registerCollection('Deduction Type', DataType.bm_deduction_type, DeductionTypeSchema());
