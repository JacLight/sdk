import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';

export const UsageSchema = () => {
  return {
    type: 'object',
    properties: {
      appId: {
        type: 'string',
      },
      appKey: {
        type: 'string',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      route: {
        type: 'string',
      },
      pillar: {
        type: 'string',
      },
      feature: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['success', 'pending', 'failed'],
      },
      durationMs: {
        type: 'number',
      },
      bytesIn: {
        type: 'number',
      },
      bytesOut: {
        type: 'number',
      },
      tokenCost: {
        type: 'number',
      },
      dollarCost: {
        type: 'number',
      },
      meta: {
        type: 'object',
      },
    },
  } as const;
};

const ush = UsageSchema();

export type UsageModel = FromSchema<typeof ush>;
registerCollection(
  'Usage',
  DataType.usage,
  UsageSchema()
);
