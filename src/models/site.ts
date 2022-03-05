import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';
import { PageModel } from './page';

export interface Site {
  title?: string;
  description?: string;
  favicon?: string;
  home_page: string;
  css?: string;
  javascript?: string;
  navigations?: [];
  pages?: PageModel[];
}

export const SiteSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      keywords: {
        type: 'string',
      },
      robots: {
        type: 'string',
      },
      hidden: {
        type: 'string',
      },
      slug: {
        type: 'string',
      },
      icon: {
        type: 'string',
      },
      theme: {
        type: 'string',
      },
      css: {
        type: 'string',
      },
      javascript: {
        type: 'string',
      },
    },
  } as const;
};

const dd = SiteSchema();
export type SiteModel = FromSchema<typeof dd>;

export const SiteUI = (): CollectionUI[] => {
  return null;
};

export const SiteRules = (): CollectionRule[] => {
  return [{ name: 'norule' }];
};
