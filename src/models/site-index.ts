import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const SiteIndexSchema = () => {
  return {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      url: {
        type: 'string',
      },
      links: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      content: {
        type: 'string',
        textSearch: true,
      },
      hash: {
        type: 'string',
      },
    },
  } as const;
};

const rt = SiteIndexSchema();
export type SiteIndexModel = FromSchema<typeof rt>;

registerCollection(
  'Web Traffic',
  DataType.site_index,
  SiteIndexSchema(),
  [],
  [],
  false,
  false
);
