import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * Org-level catalog of earning types (Regular, Overtime, Holiday, Bonus,
 * Commission, Tips, Reimbursement, etc.). The payroll run engine uses these
 * to compute gross pay — admins configure per-org without code changes.
 *
 * Each pay-stub line item references one of these by id; the calculation
 * formula (hours × rate, salary fraction, flat amount, etc.) is part of the
 * type definition, not the pay-stub.
 */
export const EarningTypeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Display name shown on pay stubs (e.g. "Regular", "Overtime", "Holiday Pay")',
        group: 'name',
      },
      code: {
        type: 'string',
        description: 'Short code for reports / GL (e.g. REG, OT, HOL, BON)',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      calculationType: {
        type: 'string',
        enum: ['hours_x_rate', 'salary_period', 'flat', 'percent_of_base', 'manual'],
        description:
          'How to compute the amount. hours_x_rate: hours × rate × multiplier. ' +
          'salary_period: annualSalary / periodsPerYear. ' +
          'flat: fixed amount entered per run. ' +
          'percent_of_base: pct × period base earnings (commission). ' +
          'manual: operator types the amount each run (bonus).',
        group: 'calc',
      },
      rateMultiplier: {
        type: 'number',
        default: 1,
        description: 'For hours_x_rate: multiplies the regular rate (1.0 regular, 1.5 OT, 2.0 holiday)',
        group: 'calc',
      },
      defaultPercent: {
        type: 'number',
        description: 'For percent_of_base: default percentage (0–100). Per-employee override allowed.',
        group: 'calc',
      },
      taxable: {
        type: 'boolean',
        default: true,
        description: 'Whether this earning counts as taxable income (federal/state). Reimbursements typically false.',
        group: 'tax',
      },
      includeInFica: {
        type: 'boolean',
        default: true,
        description: 'Counts as FICA wages (Social Security + Medicare base)',
        group: 'tax',
      },
      includeInOvertimeBase: {
        type: 'boolean',
        default: true,
        description: 'Counts toward the regular rate used to compute overtime (e.g. shift differentials yes; bonuses sometimes)',
        group: 'tax',
      },
      glAccount: {
        type: 'string',
        description: 'Chart of accounts entry for posting (e.g. payroll-expense, commission-expense)',
        group: 'gl',
      },
      active: {
        type: 'boolean',
        default: true,
      },
    },
    required: ['name', 'calculationType'],
  } as const;
};

const es = EarningTypeSchema();
export type EarningTypeModel = FromSchema<typeof es>;

registerCollection('Earning Type', DataType.bm_earning_type, EarningTypeSchema());
