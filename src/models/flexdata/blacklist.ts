import { FieldType } from '../../types';
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
        inputStyle: 'html',
        fieldType: FieldType.code,
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
export type FlexDataViewTemplateModel = FromSchema<typeof rt>;