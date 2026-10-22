import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * An investigation: alerts about the same people or money, worked to a decision. When the
 * activity is suspicious the bank files a SAR with FinCEN — due 30 days after it was detected
 * (60 when no suspect is identified) — and records the filing here.
 */
export const BankingCaseSchema = () => {
  return {
    type: 'object',
    properties: {
      number: {
        type: 'string',
        unique: true,
        readOnly: true,
        transform: ['random-string::8', 'uppercase'],
      },
      title: { type: 'string' },
      status: { type: 'string', enum: ['open', 'investigating', 'pending_filing', 'closed'], default: 'open' },
      priority: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
      customers: { type: 'array', items: bankingRef(DataType.customer, 'email') },
      accounts: { type: 'array', items: bankingRef(DataType.banking_account, 'accountNumber') },
      alerts: { type: 'array', items: bankingRef(DataType.banking_alert, 'summary') },
      assignedTo: { type: 'string', description: 'The investigator’s user sk.' },
      detectedAt: { type: 'string', format: 'date-time', description: 'When the activity was first detected — starts the SAR clock.' },
      narrative: { type: 'string', 'x-control-variant': 'textarea', description: 'What the investigation found.' },
      decision: { type: 'string', enum: ['no_action', 'sar_filed', 'restrict', 'exit_relationship'] },
      sar: {
        type: 'object',
        title: 'SAR',
        collapsible: true,
        properties: {
          dueBy: { type: 'string', format: 'date', readOnly: true },
          noSuspect: { type: 'boolean', default: false, description: 'No suspect identified yet: the SAR is due 60 days after detection instead of 30.' },
          filedAt: { type: 'string', format: 'date-time' },
          bsaId: { type: 'string', description: 'The BSA identifier FinCEN returns.' },
          amount: cents('The suspicious amount reported.'),
          activityFrom: { type: 'string', format: 'date' },
          activityTo: { type: 'string', format: 'date' },
          continuingReviewBy: { type: 'string', format: 'date', readOnly: true, description: 'Activity that goes on is reviewed again, and refiled, every 90 days.' },
        },
      },
      closedAt: { type: 'string', format: 'date-time', readOnly: true },
      accessLog: {
        type: 'array',
        hidden: true,
        readOnly: true,
        description: 'Who opened the case and when (SAR records are read-logged).',
        items: { type: 'object', properties: { by: { type: 'string' }, at: { type: 'string', format: 'date-time' }, what: { type: 'string' } } },
      },
    },
  } as const;
};

const s = BankingCaseSchema();
export type BankingCaseModel = FromSchema<typeof s>;

registerCollection('Banking Case', DataType.banking_case, BankingCaseSchema());
