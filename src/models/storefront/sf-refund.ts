import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { SaleRateFields } from '../_sale-rate-fields';

export const SFRefundSchema = () => {
  return {
    type: 'object',
    properties: {
      ...SaleRateFields(),
      // The currency the amounts are stored in; the server fills the org base currency when empty.
      currency: { type: 'string', title: 'Currency' },
      order: {
        type: 'string',
      },
      receipt: {
        type: 'string',
      },
      return: {
        type: 'string',
      },
      amount: {
        type: 'string',
      },
      refundType: {
        type: 'string',
        enum: ['account', 'giftcard', 'cash'],
      },
      tranction: {
        type: 'string',
      },
      remark: {
        type: 'string',
      },
      attachments: FileInfoSchema(),
    },
  } as const;
};

const ms = SFRefundSchema();
export type SFRefundModel = FromSchema<typeof ms>;

registerCollection(
  'Store Refund',
  DataType.sf_refund,
  SFRefundSchema(),
);
