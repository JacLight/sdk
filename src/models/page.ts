import { CollectionRule, CollectionUI } from './collection';
import { FromSchema } from 'json-schema-to-ts';

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
        unique: true,
      },
      parent: {
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
        type: 'boolean',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        fn: 'return a.name.replace(/\\n/g, "")',
        event: 'onBlur',
        unique: true,
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
      links: {
        type: 'array',
        items: {
          type: 'string', //this is css or java links in the head section
        },
      },
      css: {
        type: 'string',
        inputStyle: 'textarea'
      },
      javascript: {
        type: 'string',
        inputStyle: 'textarea'
      },
      priority: {
        type: 'integer',
      },
      sections: {
        type: 'array',
        hidden: true,
        items: PageSectionSchema(),
      },
      settings: PageSettingSchema(),
    },
    required: ['name', 'slug'],
  } as const;
};

export const PageSectionSchema = () => {
  return {
    type: 'object',
    displayStyle: 'card',
    hidden: true,
    properties: {
      id: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      type: {
        type: 'string',
      },
      startRow: {
        type: 'number',
      },
      startCol: {
        type: 'number',
      },
      colSpan: {
        type: 'number',
      },
      rowSpan: {
        type: 'number',
      },
      class: {
        type: 'string',
      },
      css: {
        type: 'string',
        inputStyle: 'textarea',
      },
      javascript: {
        type: 'string',
        inputStyle: 'textarea',
      },
      content: {
        type: 'string',
        hidden: true,
      },
      links: {
        type: 'array',
        items: {
          type: 'string', //this is css or java links in the head section
        },
      },
      elements: {
        hidden: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
            },
            props: {
              type: 'object',
              properties: {
                '^setting_': {
                  type: 'string',
                },
              },
            },
            data: {
              type: 'object',
            },
          },
        },
      },
    },
    required: ['id'],
  } as const;
};

export const PageSettingSchema = () => {
  return {
    type: 'object',
    displayStyle: 'inline',
    properties: {
      childEditing: {
        type: 'string',
        enum: ['append', 'editable', 'locked'],
        default: 'append',
      },
      breakpoints: {
        type: 'array',
        layout: 'horizontal',
        arrange: false,
        items: {
          type: 'object',
          properties: {
            high: { type: 'number', displaySize: 'small' },
            low: { type: 'number', displaySize: 'small' },
            columns: { type: 'number', displaySize: 'small' },
          },
        },
      },
      maxWidth: {
        type: 'number',
      },
      maxHeight: {
        type: 'number',
      },
      minWidth: {
        type: 'number',
      },
      minHeight: {
        type: 'number',
      },
    },
  } as const;
};

export const PageUI = (): CollectionUI[] => {
  return null;
};

export const PageRules = (): CollectionRule[] => {
  return null;
};

const pageSettings = PageSettingSchema();
const pageSectionSchema = PageSectionSchema();
const pageSchema = PageSchema();

export type PageSettingModel = FromSchema<typeof pageSettings>;
export type PageSectionModel = FromSchema<typeof pageSectionSchema>;
export type PageModel = FromSchema<typeof pageSchema>;
