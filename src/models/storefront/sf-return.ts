import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const SFReturnSchema = () => {
  return {
    type: 'object',
    properties: {
      order: {
        type: 'string',
      },
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

export const SFReturnUI = (): CollectionUI[] => {
  return null;
};
export const SFReturnRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Return',
  DataType.sf_return,
  SFReturnSchema(),
  SFReturnUI(),
  SFReturnRules(),
  true
);
