import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * Per-employee deduction assignment.
 *
 * Links an employee to a deduction type from the catalog (`bm_deduction_type`),
 * optionally overrides the amount/percentage, sets date range, and tracks
 * loan-style decrements.
 *
 * For loans (deductionType.category === 'loan'):
 *   - principal: original loan amount
 *   - balanceRemaining: decrements each pay period the deduction runs (starts = principal)
 *   - perPayDeduction: how much to take per pay period (server clamps so it
 *     doesn't go negative; final pay period takes whatever remains)
 *   - status auto-flips to 'completed' when balanceRemaining reaches 0
 *
 * For non-loans, balance fields are ignored. The amount/percentage runs every
 * pay period within the date range until status changes.
 */
export const EmployeeDeductionSchema = () => {
  return {
    type: 'object',
    properties: {
      employeeId: {
        type: 'string',
        group: 'employee',
      },
      deductionTypeId: {
        type: 'string',
        description: 'FK to bm_deduction_type — the catalog entry this is an instance of',
        group: 'employee',
      },
      // Display name copied at assignment time so legacy assignments still
      // render even if the catalog entry is later renamed/deactivated.
      label: {
        type: 'string',
        description: 'Snapshot of the deduction name at assignment time',
        readOnly: true,
        group: 'name',
      },
      // Override amounts. If both are unset, use the catalog default.
      amount: {
        type: 'number',
        description: 'Per-pay fixed amount override (calculationType=fixed). Falls back to deductionType.defaultAmount if blank.',
        group: 'amount',
      },
      percentage: {
        type: 'number',
        description: 'Per-pay percentage override (calculationType=percentage). Falls back to deductionType.defaultPercentage if blank.',
        group: 'amount',
      },
      frequency: {
        type: 'string',
        enum: ['every_pay', 'first_pay_of_month', 'last_pay_of_month', 'monthly', 'annually'],
        default: 'every_pay',
        group: 'schedule',
      },
      startDate: {
        type: 'string',
        format: 'date',
        description: 'First pay period this deduction applies to. Null = effective immediately.',
        group: 'schedule',
      },
      endDate: {
        type: 'string',
        format: 'date',
        description: 'Last pay period (inclusive). Null = until cancelled or completed.',
        group: 'schedule',
      },
      // Loan tracking
      principal: {
        type: 'number',
        description: 'Original loan amount (loan category only)',
        group: 'loan',
      },
      balanceRemaining: {
        type: 'number',
        description: 'Outstanding loan balance — decrements each pay period the deduction runs',
        group: 'loan',
      },
      perPayDeduction: {
        type: 'number',
        description: 'How much to deduct each pay period until balance reaches 0',
        group: 'loan',
      },
      // YTD running totals (informational; recomputed from pay stubs on demand)
      ytdAmount: {
        type: 'number',
        readOnly: true,
        description: 'Sum of amounts taken this calendar year — for cap enforcement',
        group: 'ytd',
      },
      status: {
        type: 'string',
        enum: ['active', 'paused', 'completed', 'cancelled'],
        default: 'active',
        group: 'status',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['employeeId', 'deductionTypeId'],
  } as const;
};

const ed = EmployeeDeductionSchema();
export type EmployeeDeductionModel = FromSchema<typeof ed>;

registerCollection('Employee Deduction', DataType.bm_employee_deduction, EmployeeDeductionSchema());
