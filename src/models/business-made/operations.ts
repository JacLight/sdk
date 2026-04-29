import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

/**
 * Operations: Queue, Check-in, Pipelines (generic multi-step flow).
 * Used for walk-in seating, pickup, service-bay, will-call, kitchen,
 * print shop, custom furniture, auto service, drop-off repair, etc.
 */

// ============================================================
// Queue
// ============================================================
export const QueueSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      unique: true,
      transform: 'uri',
      group: 'name',
    },
    title: { type: 'string', group: 'name' },
    ...BusinessLocationField(),
    serviceType: {
      type: 'string',
      enum: ['walkin_seating', 'order_pickup', 'service_bay', 'will_call', 'retail_counter', 'drop_off', 'event_check_in', 'other'],
      group: 'name',
    },
    averageWaitMin: { type: 'number', default: 10, description: 'Initial estimate; updated by service times' },
    maxCapacity: { type: 'number' },
    notifyBeforeReadyMin: { type: 'number', default: 5, description: 'Pre-notify guest when their position is N or fewer' },
    smsTemplateId: { type: 'string' },
    active: { type: 'boolean', default: true },
    notes: { type: 'string' },
  },
  required: ['businessLocationId', 'serviceType'],
} as const);
const q = QueueSchema();
export type QueueModel = FromSchema<typeof q>;
registerCollection('Queue', DataType.bm_queue, QueueSchema());

export const QueueEntrySchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: ['prefix::qe-', 'random-string::8', 'uppercase'],
    },
    queueId: { type: 'string' },
    ...BusinessLocationField(),
    position: { type: 'number' },
    customerName: { type: 'string' },
    partySize: { type: 'number', default: 1 },
    phone: { type: 'string' },
    email: { type: 'string', format: 'email' },
    note: { type: 'string' },
    status: {
      type: 'string',
      enum: ['waiting', 'notified', 'serving', 'served', 'no_show', 'left', 'transferred'],
      default: 'waiting',
    },
    joinedAt: { type: 'string', format: 'date-time' },
    notifiedAt: { type: 'string', format: 'date-time' },
    servingStartedAt: { type: 'string', format: 'date-time' },
    servedAt: { type: 'string', format: 'date-time' },
    waitedMin: { type: 'number' },
    serverId: { type: 'string', description: 'Staff member who handled' },
    pipelineItemId: { type: 'string', description: 'Linked pipeline item if queue feeds a flow' },
    source: {
      type: 'string',
      enum: ['walk_in', 'check_in', 'reservation', 'sms', 'web', 'kiosk'],
      default: 'walk_in',
    },
  },
  required: ['queueId', 'businessLocationId'],
} as const);
const qe = QueueEntrySchema();
export type QueueEntryModel = FromSchema<typeof qe>;
registerCollection('Queue Entry', DataType.bm_queue_entry, QueueEntrySchema());

// ============================================================
// Check-in
// ============================================================
export const CheckInSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: ['prefix::ci-', 'random-string::8', 'uppercase'],
    },
    ...BusinessLocationField(),
    serviceId: {
      type: 'string',
      description: 'Service the guest is checking in for (walk-in seating, order pickup, etc.)',
    },
    customerId: { type: 'string', description: 'Existing customer record if matched' },
    customerName: { type: 'string' },
    phone: { type: 'string' },
    email: { type: 'string', format: 'email' },
    partySize: { type: 'number', default: 1 },
    note: { type: 'string' },
    queueEntryId: { type: 'string', description: 'Resulting queue entry if check-in feeds a queue' },
    pipelineItemId: { type: 'string', description: 'Resulting pipeline item if check-in starts a flow' },
    reservationId: { type: 'string', description: 'Linked reservation if checking in for one' },
    source: {
      type: 'string',
      enum: ['kiosk', 'host', 'sms', 'web', 'qr', 'mobile_app'],
      default: 'host',
    },
    checkedInAt: { type: 'string', format: 'date-time' },
    completedAt: { type: 'string', format: 'date-time' },
    status: {
      type: 'string',
      enum: ['queued', 'in_service', 'done', 'cancelled', 'no_show'],
      default: 'queued',
    },
  },
  required: ['businessLocationId', 'serviceId'],
} as const);
const ci = CheckInSchema();
export type CheckInModel = FromSchema<typeof ci>;
registerCollection('Check-in', DataType.bm_checkin, CheckInSchema());

// ============================================================
// Pipeline (generic multi-step flow)
// ============================================================
export const PipelineStageSchema = () => ({
  type: 'object',
  properties: {
    id: { type: 'string' },
    label: { type: 'string' },
    order: { type: 'number' },
    slaMinutes: { type: 'number', description: 'Target time in this stage before flagging late' },
    optional: { type: 'boolean', default: false, description: 'Stage can be skipped per item' },
    rolesAllowed: {
      type: 'array',
      items: { type: 'string' },
      description: 'Roles allowed to advance items out of this stage',
    },
    onEnter: {
      type: 'object',
      description: 'Triggers fired when item enters this stage (notify, print, charge, etc.)',
      properties: {
        notify: { type: 'array', items: { type: 'string' } },
        webhook: { type: 'string' },
      },
    },
  },
  required: ['id', 'label'],
} as const);

export const PipelineSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      unique: true,
      transform: 'uri',
      group: 'name',
    },
    title: { type: 'string', group: 'name' },
    ...BusinessLocationField(),
    vertical: {
      type: 'string',
      enum: ['kitchen', 'pickup', 'print', 'furniture', 'auto_service', 'repair', 'event', 'custom'],
      group: 'name',
    },
    description: { type: 'string', 'x-control-variant': 'textarea' },
    stages: {
      type: 'array',
      items: PipelineStageSchema(),
    },
    active: { type: 'boolean', default: true },
    publicTracking: {
      type: 'boolean',
      default: false,
      description: 'Generate public per-item tracking URL (Domino\'s-style)',
    },
  },
  required: ['businessLocationId', 'vertical'],
} as const);
const pp = PipelineSchema();
export type PipelineModel = FromSchema<typeof pp>;
registerCollection('Pipeline', DataType.bm_pipeline, PipelineSchema());

export const PipelineItemSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: ['prefix::pi-', 'random-string::8', 'uppercase'],
    },
    pipelineId: { type: 'string' },
    ...BusinessLocationField(),
    title: { type: 'string', description: 'Short label (e.g. "Branzino, Caesar, Frites")' },
    customer: { type: 'string', description: 'Display name of customer / order owner' },
    customerId: { type: 'string' },
    refNumber: { type: 'string', description: 'External reference (order #, ticket #, RO#, JOB#)' },
    currentStageId: { type: 'string' },
    stagesSkipped: {
      type: 'array',
      items: { type: 'string' },
      description: 'IDs of stages that don\'t apply to this item',
    },
    stageHistory: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          stageId: { type: 'string' },
          enteredAt: { type: 'string', format: 'date-time' },
          exitedAt: { type: 'string', format: 'date-time' },
          ageMin: { type: 'number' },
          actor: { type: 'string' },
        },
      },
    },
    enteredCurrentStageAt: { type: 'string', format: 'date-time' },
    priority: {
      type: 'string',
      enum: ['low', 'normal', 'rush', 'vip'],
      default: 'normal',
    },
    notes: { type: 'string' },
    eta: { type: 'string', format: 'date-time' },
    completedAt: { type: 'string', format: 'date-time' },
    cancelledAt: { type: 'string', format: 'date-time' },
    status: {
      type: 'string',
      enum: ['active', 'completed', 'cancelled', 'paused'],
      default: 'active',
    },
    payload: {
      type: 'object',
      description: 'Free-form payload — order lines, vehicle info, item details, etc.',
      properties: {},
    },
  },
  required: ['pipelineId', 'businessLocationId'],
} as const);
const pi = PipelineItemSchema();
export type PipelineItemModel = FromSchema<typeof pi>;
registerCollection('Pipeline Item', DataType.bm_pipeline_item, PipelineItemSchema());

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
