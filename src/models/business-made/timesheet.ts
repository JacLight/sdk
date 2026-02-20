import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const TimeEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      timeSheetId: { type: 'string' },
      date: { type: 'string', format: 'date', group: 'time' },
      startTime: { type: 'string', group: 'time' },
      endTime: { type: 'string', group: 'time' },
      breakDuration: {
        type: 'number',
        description: 'Break duration in minutes',
      },
      hours: { type: 'number', group: 'hours' },
      type: {
        type: 'string',
        enum: ['regular', 'overtime', 'pto', 'holiday', 'sick', 'unpaid'],
        default: 'regular',
        group: 'hours',
      },
      projectId: { type: 'string' },
      taskId: { type: 'string' },
      description: { type: 'string' },
      approved: { type: 'boolean', default: false },
      approvedById: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'date', 'hours'],
  } as const;
};

export const TimesheetSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::ts-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: {
        type: 'string',
        group: 'employee',
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
      status: {
        type: 'string',
        enum: ['draft', 'submitted', 'approved', 'rejected', 'processed'],
        default: 'draft',
        group: 'status',
      },
      submittedAt: { type: 'string', format: 'date-time' },
      submittedById: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
      approvedById: { type: 'string' },
      rejectedAt: { type: 'string', format: 'date-time' },
      rejectedById: { type: 'string' },
      rejectionReason: { type: 'string' },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      timeEntries: {
        type: 'array',
        collapsible: true,
        items: TimeEntrySchema(),
      },
      totalHours: { type: 'number', readOnly: true, group: 'totals' },
      regularHours: { type: 'number', readOnly: true, group: 'totals' },
      overtimeHours: { type: 'number', readOnly: true, group: 'totals' },
      ptoHours: { type: 'number', readOnly: true, group: 'totals' },
      holidayHours: { type: 'number', readOnly: true, group: 'totals' },
    },
    required: ['employeeId', 'payPeriodStart', 'payPeriodEnd'],
  } as const;
};

const ts = TimesheetSchema();
export type TimesheetModel = FromSchema<typeof ts>;

const te = TimeEntrySchema();
export type TimeEntryModel = FromSchema<typeof te>;

registerCollection('Timesheet', DataType.bm_timesheet, TimesheetSchema());
