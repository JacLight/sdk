import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';

/**
 * Money kept back on an account: a card authorization waiting to settle, a deposited check
 * waiting to clear, an outgoing payment not yet sent, a legal or compliance hold. Active holds
 * add up to the account's `heldAmount`, which the available balance subtracts.
 */
export const BankingHoldSchema = () => {
  return {
    type: 'object',
    properties: {
      // The currency the amounts are stored in; the server fills the org base currency when empty.
      currency: { type: 'string', title: 'Currency' },
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      amount: { ...cents('Kept back.'), minimum: 1 },
      reason: {
        type: 'string',
        enum: ['card_authorization', 'check_deposit', 'pending_payment', 'legal_order', 'compliance', 'dispute', 'other'],
      },
      status: {
        type: 'string',
        enum: ['pending', 'active', 'releasing', 'released', 'captured', 'expired'],
        default: 'active',
        description: 'captured: the money left with the transaction it was for. released: it went back to available.',
      },
      effect: {
        type: 'object', hidden: true, readOnly: true,
        properties: { version: { type: 'integer', enum: [1] }, hash: { type: 'string' }, checkAvailable: { type: 'boolean' },
          refused: { type: 'boolean' }, reserveStartedAt: { type: 'string', format: 'date-time' }, releaseStartedAt: { type: 'string', format: 'date-time' }, reservedAt: { type: 'string', format: 'date-time' }, releasedAt: { type: 'string', format: 'date-time' },
          releaseStatus: { type: 'string', enum: ['released', 'expired'] },
        }, required: ['version', 'hash', 'checkAvailable'],
      },
      transaction: bankingRef(DataType.banking_transaction, 'reference'),
      expiresAt: { type: 'string', format: 'date-time', description: 'Released on its own at this time (card authorizations, check holds).' },
      releasedAt: { type: 'string', format: 'date-time', readOnly: true },
      note: { type: 'string' },
      placedBy: { type: 'string' },
      regcc: {
        type: 'object',
        title: 'Funds availability (Reg CC)',
        collapsible: true,
        description: 'Why a deposited check is held, until when, and the notice the depositor was given (12 CFR 229.13(g), 229.16).',
        properties: {
          reason: {
            type: 'string',
            enum: ['next_day', 'second_day', 'new_account', 'large_deposit', 'redeposit', 'repeated_overdraft', 'reasonable_cause', 'emergency'],
          },
          exception: { type: 'boolean', description: 'An exception hold (229.13): the notice must state the reason.' },
          exceptionNote: { type: 'string', description: 'The facts behind a reasonable-cause or emergency hold.' },
          availableOn: { type: 'string', format: 'date', description: 'The business day the funds are available.' },
          depositDate: { type: 'string', format: 'date', description: 'The banking day of deposit.' },
          noticeGivenAt: { type: 'string', format: 'date-time' },
          delivery: { type: 'string', enum: ['in_person', 'mail', 'email', 'in_app'] },
        },
      },
    },
    required: ['account', 'amount', 'reason'],
  } as const;
};

const s = BankingHoldSchema();
export type BankingHoldModel = FromSchema<typeof s>;

registerCollection('Banking Hold', DataType.banking_hold, BankingHoldSchema());
