import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType } from '../../types';
import { SharedAccountField } from '../_shared-account-fields';

export const SFSubscriptionSchema = () => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        group: 'status',
        readOnly: true,
        enum: ['new', 'trialing', 'active', 'past_due', 'paused', 'cancelled', 'expired', 'inactive'],
      },
      referenceId: {
        type: 'string',
        group: 'status',
        readOnly: true,
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri',
        group: 'name',
        readOnly: true,
      },
      plan: {
        type: 'string',
        group: 'name',
        readOnly: true,
      },
      renewalDate: {
        type: 'string',
        group: 'date'
      },
      startDate: {
        type: 'string',
        group: 'date'
      },
      endDate: {
        type: 'string',
        group: 'date'
      },
      addOns: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            price: { type: 'number' },
          },
        },
      },
      benefits: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
          },
        },
      },
      ...SharedAccountField(),
      email: {
        type: 'string',
      },
      renewals: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            plan: { type: 'string' },
            amount: { type: 'number' },
            paymentRef: { type: 'string' },
            paymentGateway: { type: 'string' },
            renewalDate: { type: 'string' },
          },
        },
      },
      // ── lifecycle (written by the server; the UI renders these) ──
      planTitle: { type: 'string', group: 'name', readOnly: true },
      amount: { type: 'number', group: 'pricing', readOnly: true },
      currency: { type: 'string', group: 'pricing', readOnly: true },
      customer: {
        type: 'string',
        description: 'The subscriber (customer record)',
        readOnly: true,
        dataSource: { source: 'collection', collection: DataType.customer, value: 'sk', label: ['email', 'username'] },
      },
      periodStart: { type: 'string', group: 'date', readOnly: true },
      isTrial: { type: 'boolean', readOnly: true },
      autoRenew: { type: 'boolean', readOnly: true },
      cancelAtPeriodEnd: { type: 'boolean', readOnly: true },
      cancelReason: { type: 'string', readOnly: true },
      cancelDate: { type: 'string', readOnly: true },
      pausedAt: { type: 'string', readOnly: true },
      pausedFrom: { type: 'string', readOnly: true },
      resumeAt: { type: 'string', readOnly: true },
      pendingPlan: { type: 'string', description: 'Plan it switches to at the end of this period', readOnly: true },
      failedAttempts: { type: 'number', readOnly: true },
      nextRetry: { type: 'string', readOnly: true },
      lastPaymentError: { type: 'string', readOnly: true },
      nextCycleAt: { type: 'string', description: 'When the renewal job next runs for it', readOnly: true },
      paymentUrl: { type: 'string', readOnly: true },
      provider: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        properties: {
          name: { type: 'string' },
          subscriptionId: { type: 'string' },
          customerId: { type: 'string' },
          status: { type: 'string' },
        },
      },
      trial: {
        collapsible: true,
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            startDate: { type: 'string' },
            endDate: { type: 'string' },
            ref: { type: 'string' },
          },
        },
      },
      history: {
        collapsible: true,
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            date: { type: 'string' },
            action: { type: 'string' },
            status: { type: 'string' },
            from: { type: 'string' },
            plan: { type: 'string' },
            by: { type: 'string' },
            note: { type: 'string' },
          },
        },
      },
      remarks: {
        type: 'string',
        'x-control-variant': 'textarea',
      }
    },
  } as const;
};

const dd = SFSubscriptionSchema();
export type SFSubscriptionModel = FromSchema<typeof dd>;

registerCollection(
  'Store Subscription',
  DataType.sf_subscription,
  SFSubscriptionSchema(),
);
