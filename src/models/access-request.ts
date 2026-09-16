import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

/**
 * Someone asked to open a screen their role does not include.
 *
 * Decided through the org's access-approval workflow (settings.approvals):
 * the task the workflow raises carries the approvers, this record carries the
 * ask, the chain of decisions and, on approval, how access was granted —
 * always through a role or a group, never a one-off.
 */
export const AccessRequestSchema = () => {
  return {
    type: 'object',
    properties: {
      requester: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          name: { type: 'string' },
          userId: { type: 'string' },
        },
      },
      app: {
        type: 'string',
        enum: ['appmint', 'business-made'],
        notes: 'Which app the screen belongs to; paths are only meaningful per app.',
      },
      path: { type: 'string', notes: 'The menu path as the sidebar knows it, e.g. /storefront/orders or /welcome-crm.' },
      label: { type: 'string', notes: 'What the person saw it called.' },
      reason: { type: 'string', 'x-control-variant': 'textarea' },
      status: {
        type: 'string',
        enum: ['pending', 'approved', 'rejected', 'cancelled'],
        default: 'pending',
      },
      round: { type: 'number', default: 1, notes: 'Asking again after a rejection starts a new round.' },
      approver: {
        type: 'object',
        properties: {
          emails: { type: 'array', items: { type: 'string' } },
          roles: { type: 'array', items: { type: 'string' } },
          since: { type: 'string', format: 'date-time' },
          escalatesAt: { type: 'string', format: 'date-time' },
        },
      },
      approvalChain: {
        type: 'array',
        notes: 'Every step of every round, oldest first. A resubmission appends; nothing is rewritten.',
        items: {
          type: 'object',
          properties: {
            round: { type: 'number' },
            level: { type: 'number' },
            approverEmail: { type: 'string' },
            approverName: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'escalated', 'cancelled'] },
            assignedAt: { type: 'string', format: 'date-time' },
            decidedAt: { type: 'string', format: 'date-time' },
            decidedBy: { type: 'string' },
            comments: { type: 'string' },
            taskId: { type: 'string' },
          },
        },
      },
      grant: {
        type: 'object',
        notes: 'How access was given on approval.',
        properties: {
          via: { type: 'string', enum: ['role', 'group'] },
          name: { type: 'string' },
        },
      },
      taskId: { type: 'string' },
      workflowName: { type: 'string' },
      submittedAt: { type: 'string', format: 'date-time' },
      decidedAt: { type: 'string', format: 'date-time' },
      decidedBy: { type: 'string' },
      comments: { type: 'string' },
    },
    required: ['requester', 'app', 'path'],
  } as const;
};

const ar = AccessRequestSchema();
export type AccessRequestModel = FromSchema<typeof ar>;
registerCollection('AccessRequest', DataType.access_request, AccessRequestSchema());
