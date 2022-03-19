import { FromSchema } from 'json-schema-to-ts';

export const WCBasicSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        disabled: true
      },
      description: {
        type: 'string',
        inputStyle: 'richtext',
      },
      content: {
        type: 'string',
        inputStyle: 'richtext',
      },
    },
  } as const;
};

const wc = WCBasicSchema();
export type WCBasicModel = FromSchema<typeof wc>;
