import { FromSchema } from 'json-schema-to-ts';
import { DataType, FieldType, FormViewSectionType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { registerCollection } from '../defaultschema';

export const PageSchema = (title = '', description = '') => {
  return {
    type: 'object',
    title: title,
    description: description,
    properties: {
      site: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.site,
          value: 'name',
          label: 'name',
        },
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        uniqueScope: ['site'],
        transform: 'uri'
      },
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          value: 'name',
          label: 'name',
        },
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
        pattern: '^[a-zA-Z_\\-0-9]*$',
        // fn: 'return a.name.replace(/\\n/g, "")',
        event: 'onBlur',
        unique: true,
        uniqueScope: ['site'],
        transform: 'uri'
      },
      dataType: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        dataSource: {
          source: 'json',
          json: [],
        }
      },
      iconUrl: {
        type: 'string',
      },
      childEditing: {
        type: 'string',
        enum: ['append', 'locked'],
        default: 'append',
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
            name: { type: 'string', displaySize: 'small' },
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
    required: ['name', 'slug', 'site'],
  } as const;
};

export const PageSectionSchema = () => {
  return {
    type: 'object',
    displayStyle: 'card',
    properties: {
      id: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        hidden: true,
      },
      startRow: {
        type: 'number',
        hidden: true,
      },
      startCol: {
        type: 'string',
        hidden: true,
      },
      colSpan: {
        type: 'string',
        hidden: true,
      },
      rowSpan: {
        type: 'number',
        hidden: true,
      },
      style: {
        type: 'string' || 'object',
        hidden: true,
      },
      classes: {
        type: 'string' || 'array',
        hidden: true,
      },
      config: {
        type: 'string' || 'array' || 'object',
        hidden: true,
      },
      content: {
        type: 'string',
        hidden: true,
      },
      component: {
        type: 'string',
        hidden: true,
      },
      close: {
        type: 'boolean',
        hidden: true,
      },
      fieldMap: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            htmlId: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'json',
                json: [],
              },
            },
            dataId: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'json',
                json: [],
              },
            },
            hide: {
              type: 'boolean',
            },
          },
        },
      },
      dataType: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        group: 'datatype-select',
        groupItemId: 1,
        inputStyle: 'chip',
        dataSource: {
          source: 'json',
          json: []
        },
      },
      useContextData: {
        type: 'boolean',
        inputStyle: 'switch',
      },
      selection: {
        type: 'array',
        title: 'Selections',
        fieldType: FieldType.collection,
        displayStyle: 'table',
        inputStyle: 'picker',
        dataSource: {
          source: 'collection',
          collection: DataType.post,
        },
        items: {
          type: 'object',
          properties: {
            datatype: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      category: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
        },
      },
      tag: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          value: 'name',
          label: 'name',
        },
      },
      sort: {
        type: 'string',
        enum: [
          'Auto',
          'Title Asc',
          'Title Desc',
          'Name Asc',
          'Name Desc',
          'Published Asc',
          'Published Desc',
          'Created Asc',
          'Created Desc',
          'Modified Asc',
          'Modified Desc',
        ],
      },
    },
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
              '0': '/properties/site',
              '1': '/properties/parent',
            },
            {
              '0': '/properties/name',
              '1': '/properties/slug',
            },
            {
              '0': '/properties/title',
            },
            {
              '0': '/properties/description',
            },
            {
              '0': '/properties/keywords',
            },
            {
              '0': '/properties/robots',
            },
            {
              '0': '/properties/childEditing',
            },
            {
              '0': '/properties/iconUrl',
            },
            {
              '0': '/properties/hidden',
              '1': '/properties/dataType',
            },
          ],
        },
        {
          title: 'Breakpoints',
          items: [
            {
              '0': '/properties/minWidth',
              '1': '/properties/maxWidth',
            },
            {
              '0': '/properties/minHeight',
              '1': '/properties/maxHeight',
            },
            {
              '0': '/properties/breakpoints',
            },
          ],
        },
      ],
    },
  ];
};

export const PageSectionUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.sectiontab,
      tab: [
        {
          title: 'Data Selection',
          items: [
            {
              '0': '/properties/dataType',
            },
            {
              '0': '/properties/selection',
            },
            {
              '0': '/properties/category',
            },
            {
              '0': '/properties/tag',
            },
            {
              '0': '/properties/sort',
            },
            {
              '0': '/properties/useContextData',
            },
          ],
        },
        {
          title: 'Field Map',
          items: [
            {
              '0': '/properties/fieldMap',
            },
          ],
        },
      ],
    },
  ];
};

export const PageRules = (): CollectionRule[] => {
  return [];
};

export const PageSectionRules = (): CollectionRule[] => {
  return [
    // {
    //   name: 'Wait for DataType',
    //   action: [
    //     {
    //       operation: 'show',
    //       targetField: [
    //         '/properties/selection',
    //         '/properties/category',
    //         '/properties/tag',
    //       ],
    //     },
    //   ],
    //   condition: {
    //     type: 'and',
    //     param: [
    //       {
    //         value: true,
    //         field1: '/properties/dataType',
    //         operation: 'notEmpty',
    //       },
    //     ],
    //   },
    // },
  ];
};

const pageSectionSchema = PageSectionSchema();
const pageSchema = PageSchema();

export type PageSectionModel = FromSchema<typeof pageSectionSchema>;
export type PageModel = FromSchema<typeof pageSchema>;

registerCollection('Page', DataType.page, PageSchema(), PageUI(), PageRules());
