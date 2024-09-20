import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';

export const SiteDomainSchema = () => {
  return {
    type: 'object',
    properties: {
      domainName: {
        type: 'string',
        isUnique: true,
        pattern: '^[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}$',
      },
      orgId: {
        type: 'string',
      },
      siteId: {
        type: 'string',
      },
      siteName: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['new', 'pending', 'active', 'inactive'],
      },
    },
  } as const;
};

const rt = SiteDomainSchema();
export type SiteDomainModel = FromSchema<typeof rt>;

registerCollection(
  'Site Domain',
  DataType.site_domain,
  SiteDomainSchema(),
  [],
  [],
  true,
  false
);
