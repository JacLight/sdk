import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * A sanctions screening hit: a customer, payee or payment party that matched an entry on the
 * OFAC SDN or Consolidated list (or FinCEN special measures). Until a list provider is connected
 * hits are recorded by staff. A hit is cleared as a false positive with a reason, or is a true
 * match: the property is blocked or the transaction rejected, and OFAC must be told within 10
 * business days (31 CFR 501.603/604). Records are kept 10 years.
 */
export const BankingScreeningSchema = () => {
  return {
    type: 'object',
    properties: {
      subject: {
        type: 'object',
        title: 'Screened',
        properties: {
          kind: { type: 'string', enum: ['customer', 'counterparty', 'transaction_party', 'instrument_payee', 'loan_party'] },
          customer: bankingRef(DataType.customer, 'email'),
          counterparty: bankingRef(DataType.banking_counterparty, 'name'),
          name: { type: 'string' },
          dob: { type: 'string', format: 'date' },
          address: { type: 'string' },
          country: { type: 'string' },
        },
      },
      transaction: bankingRef(DataType.banking_transaction, 'reference', 'The payment held by the hit.'),
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      amount: cents('The property or payment involved.', { minimum: 0 }),
      list: {
        type: 'object',
        title: 'Matched entry',
        properties: {
          name: { type: 'string', enum: ['sdn', 'consolidated', 'fincen_special_measures', 'other'] },
          version: { type: 'string', description: 'The list publication date or version screened against.' },
          entryId: { type: 'string' },
          entryName: { type: 'string' },
          program: { type: 'string', description: 'Sanctions program (e.g. SDGT, IRAN).' },
          score: { type: 'integer', minimum: 0, maximum: 100, description: 'Match strength.' },
        },
      },
      source: { type: 'string', enum: ['manual', 'onboarding', 'payment', 'rescreen'], default: 'manual' },
      result: {
        type: 'string',
        enum: ['no_match', 'potential_match'],
        default: 'potential_match',
        description: 'no_match: the check was run and found nothing (kept as proof). potential_match: a hit to work.',
      },
      heldPayment: { type: 'boolean', readOnly: true, description: 'The hit put its payment on hold for review; clearing it lets the payment carry on.' },
      holds: { type: 'array', readOnly: true, items: bankingRef(DataType.banking_hold, 'reason'), description: 'Holds keeping blocked property back.' },
      accessLog: {
        type: 'array',
        hidden: true,
        readOnly: true,
        items: { type: 'object', properties: { by: { type: 'string' }, at: { type: 'string', format: 'date-time' }, what: { type: 'string' } } },
      },
      status: { type: 'string', enum: ['pending', 'cleared', 'blocked', 'rejected'], default: 'pending' },
      disposition: {
        type: 'object',
        properties: {
          reason: { type: 'string', description: 'Why it was cleared, or the legal authority for blocking or rejecting (program, part, EO — not just “SDN”).' },
          by: { type: 'string', readOnly: true },
          at: { type: 'string', format: 'date-time', readOnly: true },
        },
      },
      approval: bankingRef(DataType.banking_approval, 'summary', 'The second approver’s request, when a held payment is released.'),
      reportDueBy: { type: 'string', format: 'date', readOnly: true, description: '10 business days after blocking or rejecting.' },
      reportedAt: { type: 'string', format: 'date-time' },
      reportReference: { type: 'string', description: 'The OFAC Reporting System reference.' },
    },
  } as const;
};

const s = BankingScreeningSchema();
export type BankingScreeningModel = FromSchema<typeof s>;

registerCollection('Banking Screening', DataType.banking_screening, BankingScreeningSchema());
