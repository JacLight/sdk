import { FromSchema } from 'json-schema-to-ts';

export const CompanySchema = () => {
  return {
    type: 'object',
    properties: {
      mvccversion: {
        type: 'integer',
      },
      companyid: {
        type: 'integer',
      },
      accountid: {
        type: 'integer',
      },
      webid: {
        type: 'string',
      },
      mx: {
        type: 'string',
      },
      homeurl: {
        type: 'string',
      },
      logoid: {
        type: 'integer',
      },
      system: {
        type: 'string',
        default: 'false',
      },
      maxusers: {
        type: 'integer',
        format: 'int32',
      },
      active: {
        type: 'string',
        default: 'false',
      },
    },
  } as const;
};

const dd = CompanySchema();
export type CompanyModel = FromSchema<typeof dd>;
