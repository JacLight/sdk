import { CollectionRule, CollectionUI } from './collection';
import { FromSchema } from 'json-schema-to-ts';
import { FormViewSectionType } from '../types';

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
      childEditing: {
        type: 'string',
        enum: ['append', 'editable', 'locked'],
        default: 'append',
      },
      color: {
        type: 'string',
      },
      links: {
        type: 'array',
        layout: 'horizontal',
        items: {
          type: 'object', //this is css or java links in the head section
          properties: {
            link: {
              type: 'string'
            }
          }
        },
      },
      css: {
        type: 'string',
        fieldType: 'Code',
        inputStyle: 'css',
      },
      javascript: {
        type: 'string',
        fieldType: 'Code',
        inputStyle: 'javascript',
      },
      priority: {
        type: 'integer',
      },
      sections: {
        type: 'array',
        hidden: true,
        items: PageSectionSchema(),
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
        fieldType: 'Code',
        inputStyle: 'css',
      },
      javascript: {
        type: 'string',
        fieldType: 'Code',
        inputStyle: 'javascript',
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

export const PageUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'SEO & Info',
          items: [
            {
              '0': '/properties/parent'
            },
            {
              '0': '/properties/name',
              '1': '/properties/slug'
            },
            {
              '0': '/properties/title'
            },
            {
              '0': '/properties/description'
            },
            {
              '0': '/properties/keywords'
            },
            {
              '0': '/properties/robots'
            },
            {
              '0': '/properties/childEditing',
            },
            {
              '0': '/properties/hidden'
            },
            {
              '0': '/properties/iconUrl'
            }
          ]
        },
        {
          title: 'Look & Feel',
          items: [
            {
              '0': '/properties/theme'
            },
            {
              '0': '/properties/color'
            },
            {
              '0': '/properties/links'
            },
            {
              '0': '/properties/css'
            },
            {
              '0': '/properties/javascript'
            },
          ]
        },
        {
          title: 'Breakpoints',
          items: [
            {
              '0': '/properties/minWidth',
              '1': '/properties/maxWidth'
            },
            {
              '0': '/properties/minHeight',
              '1': '/properties/maxHeight'
            },
            {
              '0': '/properties/breakpoints',
            },
          ]
        }
      ]
    },
  ]
};

export const PageRules = (): CollectionRule[] => {
  return null;
};

const pageSectionSchema = PageSectionSchema();
const pageSchema = PageSchema();

export type PageSectionModel = FromSchema<typeof pageSectionSchema>;
export type PageModel = FromSchema<typeof pageSchema>;
