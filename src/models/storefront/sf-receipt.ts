import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const SFReceiptSchema = () => {
  return {
    type: 'object',
    properties: {
      parent: {
        type: 'string',
      },
      message: {
        type: 'string',
      },
      template: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      source: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      from: {
        type: 'string',
      },
      to: {
        type: 'string',
      },
      attachments: FileInfoSchema(),
      conversation: {
        type: 'string',
      },
    },
  } as const;
};

const ms = SFReceiptSchema();
export type SFReceiptModel = FromSchema<typeof ms>;

registerCollection(
  'Store Receipt',
  DataType.sf_receipt,
  SFReceiptSchema(),
);
