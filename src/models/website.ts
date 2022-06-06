import { FromSchema } from 'json-schema-to-ts';

export const WebsiteSchema = () => {
  return {
    type: 'object',
    properties: {
      url: {
        type: 'string',
        minLength: 3,
        maxLength: 200,
        unique: true,
      },
      typeid: {
        type: 'integer',
      },
      primary_: {
        type: 'string',
        default: 'false',
      },
      lastpublishdate: {
        type: 'string',
        format: 'date-time',
      },
    },
  } as const;
};

const dd = WebsiteSchema();
export type WebsiteModel = FromSchema<typeof dd>;
