import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';


export const LogSchema = () => {
  return {
    type: 'object',
    'x-control': ControlType.selectMany,
    dataSource: {
      sourceType: { type: 'string' },
      source: { type: 'string' },
      logType: { type: 'string' },
      logMessage: { type: 'string' },
      status: { type: 'string' },
    },
  } as const;
};

const ush = LogSchema();

export type LogModel = FromSchema<typeof ush>;
registerCollection('Log', DataType.log, LogSchema(), null, null);
