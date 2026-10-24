import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef, cents } from './_banking-fields';
import { AddressSchema } from '../crm/crm-address';

/**
 * A debit card on an account. The card number, CVV and PIN live only with the card processor;
 * the bank keeps the processor's token and the last four.
 */
export const BankingCardSchema = () => {
  return {
    type: 'object',
    properties: {
      account: bankingRef(DataType.banking_account, 'accountNumber'),
      cardholder: bankingRef(DataType.customer, 'email', 'One of the account’s holders or authorized users.'),
      nameOnCard: { type: 'string' },
      last4: { type: 'string', readOnly: true },
      expMonth: { type: 'integer', minimum: 1, maximum: 12, readOnly: true },
      expYear: { type: 'integer', readOnly: true },
      network: { type: 'string', enum: ['visa', 'mastercard'], readOnly: true },
      form: { type: 'string', enum: ['physical', 'virtual'], default: 'physical' },
      status: {
        type: 'string',
        enum: ['ordered', 'shipped', 'active', 'locked', 'lost', 'stolen', 'closed', 'expired'],
        default: 'ordered',
        description: 'locked is the holder’s own pause and can be undone; lost, stolen and closed are final.',
      },
      processorId: { type: 'string', readOnly: true, hidden: true },
      shipping: {
        type: 'object',
        collapsible: true,
        properties: {
          address: AddressSchema(),
          method: { type: 'string', enum: ['standard', 'express'], default: 'standard' },
          shippedAt: { type: 'string', format: 'date-time' },
          tracking: { type: 'string' },
        },
      },
      controls: {
        type: 'object',
        title: 'Controls',
        collapsible: true,
        properties: {
          perTransaction: cents('Most for one purchase.', { minimum: 0 }),
          dailySpend: cents('Most spent in a day.', { minimum: 0 }),
          dailyAtm: cents('Most taken out at ATMs in a day.', { minimum: 0 }),
          online: { type: 'boolean', default: true },
          atm: { type: 'boolean', default: true },
          international: { type: 'boolean', default: false },
          blockedCategories: { type: 'array', items: { type: 'string' }, description: 'Merchant category codes refused.' },
          allowedCategories: { type: 'array', items: { type: 'string' }, description: 'When set, only these merchant category codes.' },
        },
      },
      customerLimits: {
        type: 'object', title: 'Customer spending preferences',
        description: 'Optional personal limits, bounded by bank-approved controls. Null resets to the bank ceiling.',
        properties: {
          perTransaction: { type: ['integer', 'null'], minimum: 0, description: 'Personal per-purchase preference in cents; null uses the bank limit.' },
          dailySpend: { type: ['integer', 'null'], minimum: 0, description: 'Personal daily purchase preference in cents; null uses the bank limit.' },
          dailyAtm: { type: ['integer', 'null'], minimum: 0, description: 'Personal daily ATM preference in cents; null uses the bank limit.' },
        },
      },
      pinSet: { type: 'boolean', readOnly: true, default: false },
      activatedAt: { type: 'string', format: 'date-time', readOnly: true },
      replaces: bankingRef(DataType.banking_card, 'last4', 'The card this one replaced.'),
    },
    required: ['account', 'cardholder'],
  } as const;
};

const s = BankingCardSchema();
export type BankingCardModel = FromSchema<typeof s>;

registerCollection('Banking Card', DataType.banking_card, BankingCardSchema());
