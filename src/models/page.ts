import { FromSchema } from 'json-schema-to-ts';
import { DataType, FieldType, FormViewSectionType } from '../types';
import { viewTemplateStore } from '../ViewTemplateStore';
import { CollectionRule, CollectionUI } from './collection';
import { registerCollection } from '../defaultschema';
import { isEmpty } from '../utils';

export const PageSchema = (title = '', description = '') => {
  return {
    type: 'object',
    title: title,
    description: description,
    properties: {
      site: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        hidden: true
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          field: 'name',
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
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        // fn: 'return a.name.replace(/\\n/g, "")',
        event: 'onBlur',
        unique: true,
      },
      iconUrl: {
        type: 'string',
      },
      childEditing: {
        type: 'string',
        enum: ['append', 'editable', 'locked'],
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
    hidden: true,
    properties: {
      id: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
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
        type: 'number',
        hidden: true,
      },
      colSpan: {
        type: 'number',
        hidden: true,
      },
      rowSpan: {
        type: 'number',
        hidden: true,
      },
      content: {
        type: 'string',
        hidden: true,
      },
      detailTemplate: {
        type: 'string',
        enum: isEmpty(viewTemplateStore.templateList) ? ['default'] : viewTemplateStore.templateList.map(template => template.name)
      },
      listTemplate: {
        type: 'string',
        enum: isEmpty(viewTemplateStore.templateList) ? ['default'] : viewTemplateStore.templateList.map(template => template.name)
      },
      manualSelection: {
        type: 'boolean',
      },
      dataType: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        enum: Object.values(DataType),
      },
      selection: {
        type: 'array',
        title: 'Selections',
        fieldType: FieldType.collection,
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
            uid: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      postType: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.subschema,
          field: 'name',
        },
      },
      category: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          field: 'name',
        },
      },
      tag: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          field: 'name',
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
              '0': '/properties/parent',
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
              '0': '/properties/hidden',
            },
            {
              '0': '/properties/iconUrl',
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

export const PageRules = (): CollectionRule[] => {
  return [];
};

export const PageSectionRules = (): CollectionRule[] => {
  return [
    {
      name: 'Manual Selection',
      action: [
        {
          operation: 'show',
          targetField: '/properties/selection',
        },
        {
          operation: 'hide',
          targetField: ['/properties/postType', '/properties/category', '/properties/tag']
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            targetValue: true,
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/manualSelection',
            operation: 'equal',
          },
        ],
      },
    },
    {
      name: 'Manual Selection Datatype',
      action: [
        {
          operation: 'setProperty',
          property: 'collection',
          targetField: '/properties/selection/dataSource',
          sourceField: '/properties/dataType',
          sourceType: 'field',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            targetValue: true,
            targetType: 'value',
            targetField: 'Field2',
            field: '/properties/datatype',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ]
};

const pageSectionSchema = PageSectionSchema();
const pageSchema = PageSchema();

export type PageSectionModel = FromSchema<typeof pageSectionSchema>;
export type PageModel = FromSchema<typeof pageSchema>;

registerCollection('Page', DataType.page, PageSchema(), PageUI(), PageRules())
