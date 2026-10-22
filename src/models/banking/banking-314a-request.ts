import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

/**
 * A FinCEN 314(a) request: a list of subjects to search for in accounts kept in the last 12
 * months and transactions in the last 6 (31 CFR 1010.520). Positive matches are reported within
 * 14 days; nothing is reported for no match. Confidential like a SAR: only compliance-granted
 * staff see it. The search run and its results are kept as proof it was done.
 */
export const Banking314aRequestSchema = () => {
  return {
    type: 'object',
    properties: {
      trackingNumber: { type: 'string', unique: true },
      receivedAt: { type: 'string', format: 'date' },
      dueBy: { type: 'string', format: 'date', readOnly: true, description: 'receivedAt + 14 days.' },
      status: { type: 'string', enum: ['open', 'searched', 'responded', 'closed'], default: 'open' },
      subjects: {
        type: 'array',
        title: 'Subjects',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'The subject’s number on FinCEN’s list.' },
            kind: { type: 'string', enum: ['individual', 'business'], default: 'individual' },
            firstName: { type: 'string' },
            middleName: { type: 'string' },
            lastName: { type: 'string' },
            entityName: { type: 'string' },
            aliases: { type: 'array', items: { type: 'string' } },
            dob: { type: 'string', format: 'date' },
            tin: { type: 'string', description: 'SSN, EIN or other number. Stored encrypted.' },
            tinLast4: { type: 'string', readOnly: true },
            address: { type: 'string' },
            country: { type: 'string' },
          },
          required: ['key'],
        },
      },
      search: {
        type: 'object',
        readOnly: true,
        title: 'Search run',
        properties: {
          at: { type: 'string', format: 'date-time' },
          by: { type: 'string' },
          accountsFrom: { type: 'string', format: 'date' },
          transactionsFrom: { type: 'string', format: 'date' },
          searched: { type: 'object', description: 'How many records of each kind were searched.' },
        },
      },
      matches: {
        type: 'array',
        title: 'Matches',
        items: {
          type: 'object',
          properties: {
            subject: { type: 'string', description: 'The subject key.' },
            datatype: { type: 'string' },
            id: { type: 'string' },
            label: { type: 'string' },
            score: { type: 'integer', minimum: 0, maximum: 100 },
            matchedOn: { type: 'array', items: { type: 'string', enum: ['name', 'alias', 'dob', 'tin', 'address'] } },
            disposition: { type: 'string', enum: ['pending', 'match', 'no_match'], default: 'pending' },
            decidedBy: { type: 'string' },
            decidedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      respondedAt: { type: 'string', format: 'date-time' },
      respondedBy: { type: 'string' },
      note: { type: 'string' },
      accessLog: {
        type: 'array',
        hidden: true,
        readOnly: true,
        items: { type: 'object', properties: { by: { type: 'string' }, at: { type: 'string', format: 'date-time' }, what: { type: 'string' } } },
      },
    },
    required: ['trackingNumber'],
  } as const;
};

const s = Banking314aRequestSchema();
export type Banking314aRequestModel = FromSchema<typeof s>;

registerCollection('Banking 314(a) Request', DataType.banking_314a_request, Banking314aRequestSchema());
