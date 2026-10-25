import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const SFReturnSchema = () => {
  return {
    type: 'object',
    properties: {
      order: {
        type: 'string',
      },
      // The currency the amounts are stored in; the server fills the org base currency when empty.
      currency: { type: 'string', title: 'Currency' },
      product: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      condition: {
        type: 'string',
      },
      remarks: {
        type: 'string',
      },
      returnto: {
        type: 'string',
      },
      startDate: {
        type: 'string',
      },
      receiveDate: {
        type: 'string',
      },
      attachments: FileInfoSchema(),
    },
  } as const;
};

const ms = SFReturnSchema();
export type SFReturnModel = FromSchema<typeof ms>;

registerCollection(
  'Store Return',
  DataType.sf_return,
  SFReturnSchema(),
);
