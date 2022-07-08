import { FromSchema } from 'json-schema-to-ts';

export const PhoneSchema = () => {
  return {
    type: 'object',
    properties: {
      phone: {
        type: 'string',
        pattern: '^[-$0-9]*$',
      },
      extension: {
        type: 'string',
      },
      typeid: {
        type: 'string',
      },
      primary: {
        type: 'string',
        default: 'false',
      },
    },
  } as const;
};

const dd = PhoneSchema();
export type PhoneModel = FromSchema<typeof dd>;
