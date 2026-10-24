import { FromSchema } from 'json-schema-to-ts';
import { registerBankingCollection as registerCollection } from './_banking-register';
import { DataType } from '../../types';
import { bankingRef } from './_banking-fields';
import { AddressSchema } from '../crm/crm-address';

/**
 * An account at another bank that a customer sends to or pulls from — their own account
 * elsewhere, a landlord, a supplier. Account numbers are stored encrypted and never sent back
 * in full; responses carry `accountLast4`.
 */
export const BankingCounterpartySchema = () => {
  return {
    type: 'object',
    properties: {
      customer: bankingRef(DataType.customer, 'email', 'The customer this payee belongs to.'),
      name: { type: 'string', description: 'What the customer calls it.' },
      holderName: { type: 'string', description: 'The name on the other account.' },
      holderType: { type: 'string', enum: ['individual', 'business'], default: 'individual' },
      kind: { type: 'string', enum: ['domestic', 'international'], default: 'domestic' },
      routingNumber: { type: 'string', pattern: '^[0-9]{9}$' },
      accountNumber: { type: 'string', writeOnly: true, description: 'Stored encrypted. Never returned.' },
      accountLast4: { type: 'string', readOnly: true },
      accountType: { type: 'string', enum: ['checking', 'savings'], default: 'checking' },
      bankName: { type: 'string', readOnly: true, description: 'Looked up from the routing number.' },
      swiftBic: { type: 'string' },
      iban: { type: 'string', writeOnly: true, description: 'Stored encrypted. Never returned.' },
      address: AddressSchema(),
      rails: {
        type: 'array',
        items: { type: 'string', enum: ['ach', 'wire', 'rtp', 'fednow'] },
        description: 'How money can reach it. Set from what the routing number supports.',
      },
      verification: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['unverified', 'pending', 'verified', 'failed'], default: 'unverified' },
          method: { type: 'string', enum: ['plaid', 'micro_deposits', 'manual'] },
          verifiedAt: { type: 'string', format: 'date-time' },
          attemptsLeft: { type: 'integer', minimum: 0 },
        },
        description: 'Pulling money (ACH debit) needs a verified account; sending does not.',
      },
      status: { type: 'string', enum: ['active', 'disabled'], default: 'active' },
    },
    required: ['customer', 'holderName'],
  } as const;
};

const s = BankingCounterpartySchema();
export type BankingCounterpartyModel = FromSchema<typeof s>;

registerCollection('Banking Counterparty', DataType.banking_counterparty, BankingCounterpartySchema());
