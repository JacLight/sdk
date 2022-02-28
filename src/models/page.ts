import { CollectionRule, CollectionUI } from "./collection";

export interface PageModel {
  name: string,
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  hidden?: string;
  slug?: string;
  iconUrl?: string;
  theme?: string;
  color?: string;
  css?: string;
  javascript?: string;
  priority?: number;
  publishDate?: Date;
  sections?: PageSection[];
  links?: string[];
}

export interface PageSection {
  id: string;
  type?: string;
  startRow: number;
  startCol: number;
  colSpan: number;
  rowSpan: number;
  class?: string;
  css?: string;
  javascript?: string;
  links?: string[];
  content?: any;
  data?: {};
  elements?: any[]
}

export const PageSchema = (title = '', description = '') => {
  return {
    type: 'object',
    title: title,
    description: description,
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true
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
        type: 'boolean',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        fn: 'return a.name.replace(/\\n/g, "")',
        event: 'onBlur',
      },
      iconUrl: {
        type: 'string',
      },
      theme: {
        type: 'string',
      },
      color: {
        type: 'string',
      },
      css: {
        type: 'string',
      },
      links: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      javascript: {
        type: 'string',
      },
      priority: {
        type: 'integer',
      },
    },
    required: ['name', 'slug'],
  };
};


export const PageUI = (): CollectionUI[] => {
  return null
};


export const PageRules = (): CollectionRule[] => {
  return null;
}