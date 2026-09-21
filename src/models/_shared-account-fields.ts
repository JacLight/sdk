/**
 * Shared schema fragment for acting on a shared account.
 *
 * A shared account is an ordinary `customer` record — an agency, department or
 * wholesale account — that other customers are linked to through
 * `customer_association`. Members keep their own sign-in and choose which
 * account they are buying for; the choice rides in their token.
 *
 * On a commercial record the two identities are kept side by side rather than
 * one replacing the other:
 *
 * - the record's own customer fields (`customer` / `email` / `name`, and the
 *   base-model `author`) stay the member who acted, so attribution, notification
 *   and audit are unaffected;
 * - `sharedAccountId`, when present, is the account that owns and is billed for
 *   the record, and is what pricing resolves against — its benefits, its groups,
 *   its price lists (`PriceCalculationContext.sharedAccountId`).
 *
 * Absent on ordinary personal orders, in which case everything resolves against
 * the customer as before. Who bought is not duplicated here — the base-model
 * `author` already carries it.
 */
import { DataType, ControlType } from '../types';

export const SharedAccountField = () => ({
  sharedAccountId: {
    type: 'string',
    description: 'Shared account this record was placed on, when buying for one',
    'x-control': ControlType.selectMany,
    maxItems: 1,
    dataSource: {
      source: 'collection',
      collection: DataType.customer,
      value: 'sk',
      label: ['username', 'email'],
    },
    group: 'sharedAccount',
  },
} as const);
