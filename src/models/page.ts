import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType, FormViewSectionType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { registerCollection } from '../defaultschema';
import { FileInfoSchema } from './fileinfo';

export const PageSchema = (title = '', description = '') => {
  return {
    type: 'object',
    title: title,
    description: description,
    properties: {
      site: {
        type: 'string',
        'x-control': ControlType.selectMany,
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
        transform: 'uri',
      },
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'textarea',
      },
      keywords: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      robots: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      openGraph: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          image: {
            type: 'string',
          },
          type: {
            type: 'string',
          },
          url: {
            type: 'string',
          },
        },
      },
      hidden: {
        type: 'boolean',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9\/]*$',
        event: 'onBlur',
        unique: true,
        uniqueScope: ['site'],
        default: '{{title}}',
        transform: ['uri', 'lowercase'],
      },
      iconUrl: {
        type: 'string',
      },
      childEditing: {
        type: 'string',
        enum: ['append', 'locked'],
        default: 'append',
        displayStyle: 'outlined',
      },
      childNavigation: {
        type: 'string',
        enum: ['name', 'slug', 'id'],
        default: 'append',
        displayStyle: 'outlined',
      },
      dataType: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: [],
        }
      },
      idType: {
        type: 'string',
        enum: ['name', 'slug', 'id'],
        displayStyle: 'outlined',
      },
      priority: {
        type: 'integer',
      },
      sections: {
        type: 'array',
        hidden: true,
        items: PageSectionSchema(),
      },
      animations: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
        }
      },
      initData: {
        type: 'object',
        hidden: true,
      },
      breakpoints: {
        type: 'array',
        layout: 'horizontal',
        arrange: false,
        items: {
          type: 'object',
          layout: 'horizontal',
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
      animateScroll: {
        type: 'boolean',
        default: true,
        // description: 'Animate scroll to location when click on menu item',
      },
      animateContent: {
        type: 'boolean',
        // description: 'Animate scroll to location when click on menu item',
      },
      hideScrollToTop: {
        type: 'boolean',
        // description: 'Hide scroll to top button',
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
      dataType: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string'
        },
        dataSource: {
          source: 'json',
          json: []
        },
      },
      maxItems: {
        type: 'number',
        displayStyle: 'outlined',
      },
      shuffle: {
        type: 'boolean',
        description: 'Randomize the order of the items',
      },
      selection: {
        type: 'array',
        collapsible: true,
        title: 'Selections',
        'x-control': ControlType.collection,
        displayStyle: 'table',
        'x-control-variant': 'picker',
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
        type: 'array',
        'x-control': ControlType.selectMany,
        items: {
          type: 'string'
        },
        'x-control-variant': 'tree',
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
          children: 'children',
        },
      },
      tag: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        items: {
          type: 'string'
        },
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          value: 'name',
          label: 'name',
        },
      },
      sort: {
        type: 'string',
        displayStyle: 'outlined',
        enum: [
          'Title Asc',
          'Title Desc',
          'Name Asc',
          'Name Desc',
          'CreateDate Asc',
          'CreateDate Desc',
          'ModifyDate Asc',
          'ModifyDate Desc',
        ],
      },
      contextOverride: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        items: {
          type: 'string'
        },
        dataSource: {
          source: 'json',
          json: ['data', 'datatype', 'category', 'tag', 'sort', 'sortType', 'maxItem']
        },
        description: 'Overrides selected item with value from request',
      },
      dataInRequest: {
        type: 'boolean',
        description: "map's request params to data fetch /datatype/keyword/search, /datatype/attribute/value, /datatype/id, /datatype can also be set as query parameter ?datatype=xxx&...",
        hidden: true,
      },
      seo: {
        type: 'object',
        collapsible: 'close', // open, close, true
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          keywords: {
            type: 'string',
          },
          image: FileInfoSchema(),
        }
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
          title: 'Info',
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
              '0': '/properties/iconUrl',
            },
            {
              '0': '/properties/dataType',
              '': '/properties/idType',
            },
            {
              '0': '/properties/childEditing',
              '1': '/properties/childNavigation',
            },
            {
              '0': '/properties/hidden',
              '1': '/properties/hideScrollToTop',
            },
            {
              '0': '/properties/animateScroll',
              '1': '/properties/animateContent',
            },
          ],
        },
        {
          title: 'SEO',
          items: [
            {
              '0': '/properties/keywords',
            },
            {
              '0': '/properties/robots',
            },
            {
              '0': '/properties/openGraph',
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
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/dataType',
        },

        {
          '0': '/properties/category',
        },
        {
          '0': '/properties/tag',
        },
        {
          '0': '/properties/sort',
          '1': '/properties/maxItems',
        },
        {
          '0': '/properties/shuffle',
          '1': '/properties/contextOverride',
        },
        {
          '0': '/properties/dataInRequest',
        },
        {
          '0': '/properties/selection',
        },
        {
          '0': '/properties/seo',
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
  ];
};

const pageSectionSchema = PageSectionSchema();
const pageSchema = PageSchema();

export type PageSectionModel = FromSchema<typeof pageSectionSchema>;
export type PageModel = FromSchema<typeof pageSchema>;

registerCollection('Page', DataType.page, PageSchema(), PageUI(), PageRules());
