import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';
import { FileInfoSchema } from '../file-info';

/**
 * A customer saying a transaction is wrong — they didn't make it, it charged twice, the goods
 * never came. Error resolution has legal clocks (Reg E: 10 business days to decide or give
 * provisional credit, 45 days to finish), so the dates are on the record.
 */
export const BankingDisputeSchema = () => {
  return {
    type: 'object',
    properties: {
      number: {
        type: 'string',
        unique: true,
        readOnly: true,
        transform: ['random-string::8', 'uppercase'],
      },
      transaction: bankingRef(DataType.banking_transaction, 'reference'),
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      customer: bankingRef(DataType.customer, 'email'),
      reason: {
        type: 'string',
        enum: ['unauthorized', 'not_received', 'duplicate', 'wrong_amount', 'cancelled_recurring', 'not_as_described', 'atm_cash_not_received', 'other'],
      },
      amount: { ...cents('The part of the transaction disputed.'), minimum: 1 },
      description: { type: 'string', 'x-control-variant': 'textarea', description: 'What happened, in the customer’s words.' },
      documents: { type: 'array', items: FileInfoSchema() },
      status: {
        type: 'string',
        enum: ['submitted', 'investigating', 'provisional_credit', 'won', 'lost', 'withdrawn'],
        default: 'submitted',
      },
      provisionalCredit: bankingRef(DataType.banking_transaction, 'reference', 'The credit given while it is investigated.'),
      decideBy: { type: 'string', format: 'date', readOnly: true, description: 'Provisional credit or a decision is due by this day.' },
      resolveBy: { type: 'string', format: 'date', readOnly: true },
      networkCase: { type: 'string', description: 'The card network’s or the other bank’s case number.' },
      resolution: { type: 'string', description: 'What was decided and why, as sent to the customer.' },
      resolvedAt: { type: 'string', format: 'date-time', readOnly: true },
      regE: {
        type: 'object',
        title: 'Reg E facts',
        collapsible: true,
        description: 'What the error-resolution clocks (12 CFR 1005.11) and the liability limits (1005.6) are computed from.',
        properties: {
          caseType: {
            type: 'string',
            enum: ['standard', 'new_account', 'pos_debit', 'foreign_initiated'],
            readOnly: true,
            description: 'Computed by the server: new_account (the transfer was within 30 days of the first deposit), pos_debit (a debit card purchase), foreign_initiated (started outside the US).',
          },
          noticeAt: { type: 'string', format: 'date-time', description: 'When the customer first told the bank (oral or written). The clocks start here; the filing time when not given.' },
          noticeChannel: { type: 'string', enum: ['phone', 'branch', 'online', 'mail', 'email', 'chat'] },
          statementSentAt: { type: 'string', format: 'date', description: 'The day the statement the error first appeared on was sent.' },
          learnedOfLossAt: { type: 'string', format: 'date-time', description: 'When the customer learned the card (or other access device) was lost or stolen. Empty when it was not lost or stolen.' },
          accessDevice: { type: 'boolean', description: 'A card, PIN or other access device was used. Empty: the server decides from the transaction.' },
          extenuating: { type: 'boolean', description: 'Extended travel, hospitalization or similar kept the customer from telling the bank in time (1005.6(b)(4)).' },
          extenuatingNote: { type: 'string' },
          writtenConfirmationRequestedAt: { type: 'string', format: 'date-time', description: 'The bank asked for written confirmation of an oral notice (due in 10 business days).' },
          writtenConfirmationReceivedAt: { type: 'string', format: 'date-time' },
          reasserted: { type: 'boolean', description: 'The customer reasserts an error already resolved (1005.11(e)): no new investigation is required.' },
          liability: {
            type: 'object',
            readOnly: true,
            description: 'The last liability calculation (1005.6), kept with the decision.',
            properties: {
              amount: cents('The most the customer can be held to.', { minimum: 0 }),
              tier: { type: 'string', enum: ['none', 'two_day', 'late_notice', 'sixty_day', 'extenuating'] },
              computedAt: { type: 'string', format: 'date-time' },
              computedBy: { type: 'string' },
            },
          },
        },
      },
      notices: {
        type: 'array',
        readOnly: true,
        description: 'The notices sent to the customer about this claim.',
        items: {
          type: 'object',
          properties: {
            kind: { type: 'string', enum: ['written_confirmation_request', 'provisional_credit', 'result', 'reversal', 'documents'] },
            sentAt: { type: 'string', format: 'date-time' },
            sentBy: { type: 'string' },
            channel: { type: 'string', enum: ['mail', 'email', 'online', 'phone', 'branch'] },
            note: { type: 'string' },
          },
        },
      },
    },
    required: ['transaction', 'reason'],
  } as const;
};

const s = BankingDisputeSchema();
export type BankingDisputeModel = FromSchema<typeof s>;

registerCollection('Banking Dispute', DataType.banking_dispute, BankingDisputeSchema());
