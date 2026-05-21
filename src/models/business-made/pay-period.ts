import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// A pay period is the org-level container that controls when employees
// CAN fill timesheets and when payroll CAN run. Admin opens it, employees
// submit into it, manager approves submissions, admin locks it, payroll
// runs, admin closes it. Without this gate, timesheets pile up across
// arbitrary date ranges and there's no single "is this period finished"
// signal for the run engine.
//
// Status machine:
//   scheduled        — auto-generated from a payFrequency, not yet opened
//   open             — employees CAN add entries, submit, edit drafts
//   submission_closed — no new edits; managers can still approve / reject
//   locked           — fully frozen; payroll run executes against this state
//   closed           — payroll posted, archive
export const PayPeriodSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Display name, e.g. "May 1–14, 2026"' },
      // Cadence this period belongs to. Matches bm_payroll_profile.payFrequency
      // so the resolver "what's the current open period for this employee"
      // can match on frequency.
      frequency: {
        type: 'string',
        enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly', 'quarterly', 'annually'],
      },
      periodStart: { type: 'string', format: 'date' },
      periodEnd:   { type: 'string', format: 'date' },
      payDate:     { type: 'string', format: 'date', description: 'Target pay date — when employees see funds.' },
      status: {
        type: 'string',
        enum: ['scheduled', 'open', 'submission_closed', 'locked', 'closed'],
        default: 'scheduled',
      },
      // Audit + lifecycle metadata.
      openedBy:   { type: 'string' },
      openedAt:   { type: 'string', format: 'date-time' },
      submissionClosedBy: { type: 'string' },
      submissionClosedAt: { type: 'string', format: 'date-time' },
      lockedBy:   { type: 'string' },
      lockedAt:   { type: 'string', format: 'date-time' },
      closedBy:   { type: 'string' },
      closedAt:   { type: 'string', format: 'date-time' },
      // Optional scope — if set, only employees at this location use this period.
      businessLocationId: { type: 'string' },
      // FK to the bm_payroll_schedule this period was generated from. Manual
      // / ad-hoc periods leave this blank.
      payrollScheduleId: { type: 'string' },
      // Pay lag inherited from the schedule at generation time, so changing
      // the schedule's arrearsPeriods later doesn't retroactively shift
      // already-generated periods.
      arrearsPeriods: { type: 'number', minimum: 0, maximum: 4 },
      // Optional FK to the payroll run that posted this period (set after run).
      payrollRunId: { type: 'string' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['frequency', 'periodStart', 'periodEnd'],
  } as const;
};

const sch = PayPeriodSchema();
export type PayPeriodModel = FromSchema<typeof sch>;
export type PayPeriodStatus = 'scheduled' | 'open' | 'submission_closed' | 'locked' | 'closed';

registerCollection('Pay Period', DataType.bm_pay_period, PayPeriodSchema());
