import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BusinessLocationField } from '../_location-fields';


// ============================================================
// Period close + budgets
// ============================================================
export const PeriodCloseSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: ['prefix::close-', 'random-string::6', 'uppercase'],
    },
    period: { type: 'string', description: 'YYYY-MM (or YYYY-Q[1-4], or YYYY)' },
    periodStart: { type: 'string', format: 'date' },
    periodEnd: { type: 'string', format: 'date' },
    businessLocationIds: {
      type: 'array',
      items: { type: 'string' },
      description: 'Empty = consolidated close across all venues',
    },
    status: {
      type: 'string',
      enum: ['open', 'in_progress', 'pending_review', 'closed', 'reopened'],
      default: 'open',
    },
    checklist: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
          required: { type: 'boolean', default: true },
          completed: { type: 'boolean', default: false },
          completedBy: { type: 'string' },
          completedAt: { type: 'string', format: 'date-time' },
          note: { type: 'string' },
        },
      },
    },
    closedBy: { type: 'string' },
    closedAt: { type: 'string', format: 'date-time' },
    reopenedBy: { type: 'string' },
    reopenedAt: { type: 'string', format: 'date-time' },
    reopenReason: { type: 'string' },
  },
  required: ['period', 'periodStart', 'periodEnd'],
} as const);
const pc = PeriodCloseSchema();
export type PeriodCloseModel = FromSchema<typeof pc>;
registerCollection('Period Close', DataType.bm_period_close, PeriodCloseSchema());

export const BudgetSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: 'uri',
      unique: true,
    },
    title: { type: 'string' },
    ...BusinessLocationField(),
    fiscalYear: { type: 'number' },
    period: {
      type: 'string',
      enum: ['monthly', 'quarterly', 'annual'],
      default: 'annual',
    },
    lines: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          glAccountCode: { type: 'string' },
          accountName: { type: 'string' },
          months: {
            type: 'array',
            items: { type: 'number' },
            description: '12 monthly budget amounts (Jan-Dec)',
          },
          annual: { type: 'number' },
        },
      },
    },
    status: {
      type: 'string',
      enum: ['draft', 'approved', 'active', 'archived'],
      default: 'draft',
    },
  },
  required: ['fiscalYear'],
} as const);
const bg = BudgetSchema();
export type BudgetModel = FromSchema<typeof bg>;
registerCollection('Budget', DataType.bm_budget, BudgetSchema());
