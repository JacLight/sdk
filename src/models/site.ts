import { PageModel } from "./page";

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

export const SiteSchema = (title = '', description = '') => {
  return {
    type: 'object',
    title: title,
    description: description,
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
      friendly_url: {
        type: 'string',
      },
      icon: {
        type: 'string',
      },
      theme_pk: {
        type: 'string',
        enum: ['Item 1', 'Item 2'],
      },
      color_scheme_id: {
        type: 'string',
        enum: ['Item 1', 'Item 2'],
      },
      css: {
        type: 'string',
      },
      javascript: {
        type: 'string',
      },
      publish_date: {
        type: 'string',
        format: 'date-time',
      },
      priority: {
        type: 'integer',
      },
    },
    required: ['name'],
  };
};

export const SiteUISchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      title: {
        type: 'string',
      },
      pagepk: {
        type: 'string',
      },
      pages: {
        type: 'array',
      },
      sitenavigation: {
        type: 'array',
      },
      css: {
        type: 'string',
      },
      javascript: {
        type: 'string',
      },
    },
    required: ['name'],
  };
};
