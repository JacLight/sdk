import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// A Payroll Schedule is "how and when do we pay?" Define it once per org
// (or per business location / employee group when policies differ) and the
// system derives every upcoming pay date plus the work period each one
// covers. Pay periods (bm_pay_period) are the concrete instances generated
// from a schedule; each has its own submission lifecycle (open/locked/...),
// independent of when the run actually executes.
//
// Arrears (industry: "pay lag"):
//   0 — same-period / current. Pay date inside the same period the work
//       happened (common for salaried, e.g. bi-weekly Mon–Sun, paid the
//       Friday of the same fortnight).
//   1 — one period in arrears. Most common for hourly: submit Mon–Sun,
//       paid on the Friday of the FOLLOWING period.
//   2 — two periods in arrears (rare).
//
// Pay day pattern depends on frequency:
//   weekly / bi-weekly  → payDayOfWeek + anchorPayDate to disambiguate WHICH
//                         week in a bi-weekly cycle pay falls on.
//   semi-monthly        → payDaysOfMonth (two numbers, "last" allowed).
//   monthly             → payDayOfMonth (single number, "last" allowed).
//   quarterly / annual  → anchorPayDate alone (then +3 months / +1 year).
export const PayrollScheduleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Display label, e.g. "Hourly — bi-weekly, Friday, 1-period arrears"' },
      frequency: {
        type: 'string',
        enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly', 'quarterly', 'annually'],
      },
      // 0 = Sun, 1 = Mon, … 6 = Sat. Used for weekly / bi-weekly. Default 5 (Fri).
      payDayOfWeek: { type: 'number', minimum: 0, maximum: 6 },
      // Pay days in a month for semi-monthly. Use the string "last" for end-of-month.
      payDaysOfMonth: {
        type: 'array',
        items: { type: ['number', 'string'] },
        description: 'e.g. [15, "last"] for the 15th and last day of every month.',
      },
      // Single day for monthly.
      payDayOfMonth: { type: ['number', 'string'], description: '1–31 or "last"' },
      // Anchor lets the engine know WHICH Friday in a fortnight is a pay date.
      // For monthly / quarterly / annual, also acts as the first pay date.
      anchorPayDate: { type: 'string', format: 'date' },
      // The day of the week that starts the work week. 1 = Mon (default).
      workWeekStart: { type: 'number', minimum: 0, maximum: 6, default: 1 },
      // 0 = current, 1 = one period in arrears, 2 = two periods. See header.
      arrearsPeriods: { type: 'number', minimum: 0, maximum: 4, default: 1 },
      // Days BEFORE the pay date that submissions close. e.g. 2 = submissions
      // close on Wednesday for a Friday pay date. Used by the auto-generator
      // to flip generated periods to `submission_closed` on a cron tick.
      submissionCutoffDaysBeforePay: { type: 'number', minimum: 0, maximum: 14, default: 2 },
      // Lifecycle flag — paused schedules don't auto-generate new periods.
      status: { type: 'string', enum: ['active', 'paused', 'archived'], default: 'active' },
      // Optional scope.
      businessLocationId: { type: 'string' },
      employeeGroupId: { type: 'string', description: 'Optional — apply only to employees in this group.' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['name', 'frequency'],
  } as const;
};

const sch = PayrollScheduleSchema();
export type PayrollScheduleModel = FromSchema<typeof sch>;

registerCollection('Payroll Schedule', DataType.bm_payroll_schedule, PayrollScheduleSchema());
