import { ControlType } from '../../types';
import { FromSchema } from 'json-schema-to-ts';

// const domainNameRegex = /^(?!-)(?:[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,}$/;
const domainNameRegex = '^(?!-)(?:[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,}$';

export const FDBlacklistSchema = () => {
  return {
    type: 'object',
    properties: {
      domain: {
        type: 'string',
        pattern: domainNameRegex,
        'x-control-variant': 'html',
        'x-control': ControlType.code,
        css: { height: '600px' },
        hideLabel: true,
      },
      reason: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
    },
  } as const;
};

const rt = FDBlacklistSchema();
export type FDBlacklistModel = FromSchema<typeof rt>;