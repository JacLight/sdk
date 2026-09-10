import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

export const ShiftBreakSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      startTime: { type: 'string' },
      endTime: { type: 'string' },
      duration: {
        type: 'number',
        description: 'Duration in minutes',
      },
      type: {
        type: 'string',
        enum: ['paid', 'unpaid'],
        default: 'unpaid',
      },
      status: {
        type: 'string',
        enum: ['scheduled', 'started', 'completed', 'skipped'],
        default: 'scheduled',
      },
    },
    required: ['id', 'startTime'],
  } as const;
};

export const ShiftSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      scheduleId: { type: 'string' },
      employeeId: {
        type: 'string',
        description: 'Who works it. Empty means an OPEN shift nobody has taken yet.',
        group: 'employee',
      },
      employeeName: {
        type: 'string',
        group: 'employee',
      },
      businessLocationId: {
        type: 'string',
        description: 'Venue this shift is scheduled at — defaults to schedule\'s venue',
      },
      date: {
        type: 'string',
        format: 'date',
        group: 'time',
      },
      startTime: {
        type: 'string',
        group: 'time',
      },
      endTime: {
        type: 'string',
        group: 'time',
      },
      duration: {
        type: 'number',
        description: 'Duration in hours',
      },
      position: { type: 'string', group: 'role' },
      department: { type: 'string', group: 'role' },
      station: { type: 'string', group: 'role' },
      subdivision: { type: 'string', description: 'Which part of the shift this person is on, when the shift is broken into sub-divisions.', group: 'role' },
      definitionId: {
        type: 'string',
        description: 'Which defined shift this belongs to. Someone can work different hours than the shift normally runs and still be on it — matching by time alone would lose them.',
        group: 'role',
      },
      breaks: {
        type: 'array',
        items: ShiftBreakSchema(),
      },
      status: {
        type: 'string',
        enum: ['draft', 'open', 'offered', 'accepted', 'declined', 'published', 'claimed', 'scheduled', 'confirmed', 'started', 'completed', 'no_show', 'cancelled'],
        default: 'draft',
        description: 'Draft until the week is published. An unassigned published shift is "open" and staff can claim it.',
        group: 'status',
      },
      publishedAt: { type: 'string', format: 'date-time', group: 'status' },
      offeredAt: { type: 'string', format: 'date-time', description: 'When the shift was put to the employee.', group: 'status' },
      respondedAt: { type: 'string', format: 'date-time', description: 'When they accepted or declined.', group: 'status' },
      declineReason: { type: 'string', description: 'Why they turned it down — shown to the manager.', group: 'status' },
      acknowledgedRest: { type: 'boolean', default: false, description: 'Employee consented to a short turnaround on this shift.', group: 'status' },
      claimedBy: { type: 'string', description: 'Employee who claimed an open shift.', group: 'status' },
      claimedAt: { type: 'string', format: 'date-time', group: 'status' },
      breakMinutes: { type: 'number', default: 0, description: 'Unpaid break, deducted from scheduled hours and cost.', group: 'time' },
      clockInTime: { type: 'string', format: 'date-time' },
      clockOutTime: { type: 'string', format: 'date-time' },
      actualHours: { type: 'number' },
      notes: { type: 'string' },
      swapRequestId: { type: 'string' },
      swapStatus: {
        type: 'string',
        enum: ['pending', 'approved', 'rejected'],
      },
      isOvertime: { type: 'boolean', default: false },
    },
    required: ['date', 'startTime', 'endTime'],
  } as const;
};

export const EmployeeScheduleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::sch-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      ...BusinessLocationField(),
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
      status: {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        group: 'status',
      },
      publishedAt: { type: 'string', format: 'date-time' },
      publishedBy: { type: 'string' },
      shifts: {
        type: 'array',
        collapsible: true,
        items: ShiftSchema(),
      },
      totalScheduledHours: {
        type: 'number',
        readOnly: true,
      },
      laborCost: {
        type: 'number',
        readOnly: true,
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['periodStart', 'periodEnd'],
  } as const;
};

const es = EmployeeScheduleSchema();
export type EmployeeScheduleModel = FromSchema<typeof es>;

const sh = ShiftSchema();
export type ShiftModel = FromSchema<typeof sh>;

registerCollection('Employee Schedule', DataType.bm_schedule, EmployeeScheduleSchema());
