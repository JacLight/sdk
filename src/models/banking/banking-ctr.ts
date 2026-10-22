import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BankingIdentifiedPersonField, bankingRef, cents } from './_banking-fields';

/**
 * A Currency Transaction Report (FinCEN 112): a person's currency in, or out, passed $10,000 in
 * one business day across every branch and channel (31 CFR 1010.311/313). Cash-in and cash-out
 * are totalled apart, never netted. Drafted by the bank when the total passes the threshold,
 * completed with the subject's and the conductor's identification, and filed through BSA
 * E-Filing within 15 calendar days; staff record the BSA ID FinCEN returns.
 */
export const BankingCtrSchema = () => {
  return {
    type: 'object',
    properties: {
      number: { type: 'string', unique: true, readOnly: true, transform: ['random-string::8', 'uppercase'] },
      status: {
        type: 'string',
        enum: ['draft', 'ready', 'filed'],
        default: 'draft',
        description: 'draft: identification is missing. ready: complete, waiting to be filed. filed: BSA ID recorded.',
      },
      bsaDate: { type: 'string', format: 'date', readOnly: true, description: 'The business day of the transactions.' },
      dueBy: { type: 'string', format: 'date', readOnly: true, description: 'bsaDate + 15 calendar days.' },
      personKey: { type: 'string', readOnly: true, description: 'Who the day’s totals are for: cust:<customer sk>, biz:<EIN or account>, or id:<ID type>:<number> for someone who is not a customer.' },
      person: BankingIdentifiedPersonField('Whose total passed the threshold (the person on whose behalf, or the conductor acting for themselves).'),
      conductor: BankingIdentifiedPersonField('The individual who presented the cash, when not the person above.'),
      conductedFor: { type: 'string', enum: ['self', 'another'], default: 'self', description: 'self: the conductor acted on their own behalf.' },
      cashIn: { ...cents('Total currency in for the day.'), readOnly: true },
      cashOut: { ...cents('Total currency out for the day.'), readOnly: true },
      cashInTypes: { type: 'array', items: { type: 'string', enum: ['deposit', 'payment', 'exchange', 'prepaid_access', 'instrument_purchase', 'wire_out', 'other'] } },
      cashOutTypes: { type: 'array', items: { type: 'string', enum: ['withdrawal', 'advance', 'wire_in', 'instrument_cashed', 'exchange', 'other'] } },
      transactions: { type: 'array', items: bankingRef(DataType.banking_transaction, 'reference'), readOnly: true },
      accounts: { type: 'array', items: bankingRef(DataType.banking_account, 'accountNumber') },
      location: bankingRef(DataType.location, 'name', 'Where the transactions happened.'),
      aggregated: { type: 'boolean', readOnly: true, description: 'More than one transaction made up the total.' },
      bsaId: { type: 'string', description: 'The BSA identifier FinCEN returned for the filing.' },
      filedAt: { type: 'string', format: 'date-time' },
      filedBy: { type: 'string' },
      amends: bankingRef(DataType.banking_ctr, 'number', 'The CTR this one corrects (it carries the prior BSA ID).'),
      note: { type: 'string' },
    },
  } as const;
};

const s = BankingCtrSchema();
export type BankingCtrModel = FromSchema<typeof s>;

registerCollection('Banking CTR', DataType.banking_ctr, BankingCtrSchema());
