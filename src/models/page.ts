import { CollectionRule, CollectionUI } from "./collection";

export interface PageModel {
  name: string,
  title?: string;
  description?: string;
  keywords?: string;
  robots?: string;
  hidden?: string;
  friendly_url?: string;
  icon?: string;
  theme_pk?: string;
  color_scheme_id?: string;
  css?: string;
  javascript?: string;
  priority?: number;
  publish_date?: Date;
  sections?: PageSection[];
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
  content?: any;
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
      friendly_url: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        fn: '_.kebabCase(_.deburr(${#ref:/properties/title))',
        event: 'onBlur',
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
    required: ['name', 'friendly_url'],
  };
};



export const PageUI = (): CollectionUI[] => {
  return null
};


export const PageRules = (): CollectionRule[] => {
  return [{ 'name': 'norule' }]

}