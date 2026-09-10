import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * When a person CAN work — set by the person (staff portal) or their manager.
 * Information for the scheduler, never a lock: the board flags a shift that
 * falls outside it and the fill prefers people inside it, but a manager can
 * still put anyone anywhere. One record per employee.
 */
const WindowSchema = () => ({
  type: 'object',
  properties: {
    from: { type: 'string', description: 'Clock time, HH:MM' },
    to: { type: 'string', description: 'Clock time, HH:MM; <= from means past midnight' },
  },
  required: ['from', 'to'],
} as const);

export const StaffAvailabilitySchema = () => {
  return {
    type: 'object',
    properties: {
      employeeId: { type: 'string', description: 'Employee code (bm_employee.data.employeeId)' },
      /** Recurring week. A day with no entry = available all day. */
      weekly: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            day: { type: 'string', enum: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] },
            off: { type: 'boolean', description: 'Never available this day' },
            windows: { type: 'array', items: WindowSchema() },
          },
          required: ['day'],
        },
      },
      /** Dated overrides — a specific date off, or different hours that day. */
      exceptions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date' },
            off: { type: 'boolean' },
            windows: { type: 'array', items: WindowSchema() },
            note: { type: 'string' },
          },
          required: ['date'],
        },
      },
      maxHoursPerWeek: { type: 'number', description: 'What the person asked for; informational' },
      notes: { type: 'string' },
      updatedBy: { type: 'string' },
    },
    required: ['employeeId'],
  } as const;
};

const av = StaffAvailabilitySchema();
export type StaffAvailabilityModel = FromSchema<typeof av>;
registerCollection('StaffAvailability', DataType.bm_availability, StaffAvailabilitySchema());
