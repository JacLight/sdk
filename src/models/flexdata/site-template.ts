import { FromSchema } from 'json-schema-to-ts';

export const FDSiteTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      orgId: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      usage: {
        type: 'number',
      },
      price: {
        type: 'number',
      }
    },
  } as const;
};

const rt = FDSiteTemplateSchema();
export type FDSiteTemplateModel = FromSchema<typeof rt>;