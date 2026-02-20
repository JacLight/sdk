import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

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
        group: 'employee',
      },
      employeeName: {
        type: 'string',
        group: 'employee',
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
      breaks: {
        type: 'array',
        items: ShiftBreakSchema(),
      },
      status: {
        type: 'string',
        enum: ['scheduled', 'confirmed', 'started', 'completed', 'no_show', 'cancelled'],
        default: 'scheduled',
        group: 'status',
      },
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
    required: ['employeeId', 'date', 'startTime', 'endTime'],
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
      locationId: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
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
