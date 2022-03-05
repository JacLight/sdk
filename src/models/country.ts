import { FromSchema } from 'json-schema-to-ts';

export const CountrySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      state: {
        type: 'array',
      },
      currency: {
        type: 'string',
      },
      code: {
        type: 'string',
      },
      idd: {
        type: 'string',
      },
      ziprequired: {
        type: 'string',
        default: 'false',
      },
    },
  } as const;
};

const dd = CountrySchema();
export type CountryModel = FromSchema<typeof dd>;
