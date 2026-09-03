import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

/**
 * Time & attendance policy: overtime thresholds, break rules, punch rounding
 * and the maximum shift length the clock enforces.
 *
 * Scope resolution (most specific wins): location → state → org-wide.
 * `maxShiftHours` is read by the timesheet service when auto-closing a shift;
 * 0 means "no cap".
 */
export const TimePolicySchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string' },
      scope: {
        type: 'string',
        enum: ['org-wide', 'state', 'location'],
        default: 'org-wide',
      },
      state: {
        type: 'string',
        description: 'Two-letter state code; only used when scope is "state"',
        maxLength: 2,
      },
      businessLocationId: BusinessLocationField(),
      weeklyOTThreshold: {
        type: 'number',
        description: 'Hours per week before overtime applies',
        default: 40,
      },
      dailyOTThreshold: {
        type: 'number',
        description: 'Hours per day before overtime applies; 0 disables daily OT',
        default: 8,
      },
      doubleTimeThreshold: {
        type: 'number',
        description: 'Hours per day before double time applies; 0 disables',
        default: 12,
      },
      maxShiftHours: {
        type: 'number',
        description: 'Longest shift the clock allows before auto clock-out; 0 = no cap',
        default: 0,
      },
      otMultiplier: { type: 'number', default: 1.5 },
      doubleTimeMultiplier: { type: 'number', default: 2 },
      mealBreakRule: {
        type: 'string',
        description: 'Human-readable meal break rule, e.g. "30 min unpaid before 5h"',
      },
      restBreakRule: {
        type: 'string',
        description: 'Human-readable rest break rule, e.g. "10 min paid per 4h"',
      },
      rounding: {
        type: 'string',
        enum: ['exact', 'nearest_5min', 'nearest_15min', 'nearest_30min'],
        default: 'nearest_15min',
      },
      autoBreakDeduct: { type: 'boolean', default: false },
      requirePhoto: { type: 'boolean', default: false },
      requireGeofence: { type: 'boolean', default: false },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['name', 'scope'],
  } as const;
};

const tp = TimePolicySchema();
export type TimePolicyModel = FromSchema<typeof tp>;

registerCollection('Time Policy', DataType.bm_time_policy, TimePolicySchema());
