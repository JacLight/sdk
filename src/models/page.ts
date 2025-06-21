import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';

export const PageSchema = () => {
  return {
    type: 'object',
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
        layoutGroup: 'x-layout.main.items.0',
        group: 'site',
      },
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.page,
          value: 'name',
          label: 'name',
          filter: {
            operation: 'equal',
            property: 'site',
            value: '{{site}}',
          },
        },
        layoutGroup: 'x-layout.main.items.0',
        group: 'site',
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        uniqueScope: ['site'],
        transform: 'uri',
        layoutGroup: 'x-layout.main.items.0',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9/]*$',
        event: 'onBlur',
        unique: true,
        uniqueScope: ['site'],
        default: '{{title}}',
        transform: ['uri', 'lowercase'],
        layoutGroup: 'x-layout.main.items.0',
      },
      title: {
        type: 'string',
        layoutGroup: 'x-layout.main.items.0',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        layoutGroup: 'info',
      },
      datatype: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: 'collection',
          value: 'name',
          label: 'name',
        },
        group: 'datatype',
        layoutGroup: 'info',
        styling: {
          container: 'mb-4',
        },
      },
      inheritParent: {
        type: 'boolean',
        default: true,
        layoutGroup: 'info',
        group: 'hidden',
        labelPosition: 'top',
        styling: {
          label: 'text-[9px]',
          container: 'w-full',
          group: 'mt-2',
        },
      },
      childNavigation: {
        type: 'boolean',
        layoutGroup: 'info',
        group: 'hidden',
        labelPosition: 'top',
        styling: {
          label: 'text-[9px]',
          container: 'w-full',
        },
      },
      hidden: {
        type: 'boolean',
        layoutGroup: 'info',
        group: 'hidden',
        labelPosition: 'top',
        styling: {
          label: 'text-[9px]',
          container: 'w-full',
        },
      },
      hideScrollToTop: {
        type: 'boolean',
        default: true,
        layoutGroup: 'info',
        group: 'animate',
        labelPosition: 'top',
        styling: {
          label: 'text-[9px]',
          container: 'w-full',
        },
      },
      animateScroll: {
        type: 'boolean',
        default: true,
        layoutGroup: 'info',
        group: 'animate',
        'x-control-variant': 'switch',
        labelPosition: 'top',
        styling: {
          label: 'text-[9px]',
          container: 'w-full',
        },
      },
      animateContent: {
        type: 'boolean',
        default: true,
        layoutGroup: 'info',
        group: 'animate',
        labelPosition: 'top',
        styling: {
          label: 'text-[9px]',
          container: 'w-full',
        },
      },
      keywords: {
        type: 'string',
        'x-control-variant': 'textarea',
        layoutGroup: 'x-layout.main.items.1',
      },
      robots: {
        type: 'string',
        'x-control-variant': 'textarea',
        layoutGroup: 'x-layout.main.items.1',
        styling: {
          container: 'mb-2',
        },
      },
      tracking: {
        type: 'object',
        collapsible: true,
        styling: {
          container: 'px-0',
        },
        properties: {
          pixel: {
            type: 'string',
          },
          googleAnalytic: {
            type: 'string',
          },
        },
        layoutGroup: 'x-layout.main.items.1',
      },
      breakpoints: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            high: { type: 'number', displaySize: 'small', group: 'breakpoint' },
            low: { type: 'number', displaySize: 'small', group: 'breakpoint' },
            columns: {
              type: 'number',
              displaySize: 'small',
              group: 'breakpoint',
            },
            name: { type: 'string', displaySize: 'small', group: 'breakpoint' },
          },
        },
        layoutGroup: 'breakpoint',
      },
      content: {
        type: 'array',
        hidden: true,
      },
      animations: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
        },
      },
      actions: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
        },
      },
      initData: {
        type: 'object',
        hidden: true,
      },
      clientData: {
        type: 'object',
        hidden: true,
      },
      exports: {
        type: 'object',
        hidden: true,
      },
      isTemplate: {
        type: 'boolean',
        hidden: true,
      }, 
      appType:{
        type: 'string',
        enum: ['web', 'mobile','form', 'presentation'],
        default: 'web',
        hidden: true,
      },
      thumbnail: {
        type: 'string',
        'x-renderer': 'image',
      },
    },
    'x-layout': {
      main: {
        type: 'tab',
        id: 'main',
        items: [
          { id: 'info', title: 'Information' },
          { id: 'seo', title: 'SEO' },
        ],
      },
    },
    required: ['name', 'slug', 'site'],
  } as const;
};

export const PageDataSchema = () => {
  return {
    type: 'object',
    displayStyle: 'card',
    properties: {
      name:{
        type: 'string',
        group: 'name',
      },
      datatypes: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'combo',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
        hidden: true, 
        group: 'name',
      },
      datatype: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'combo',
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
        group: 'name',
      },
      
      keyword:{
        type: 'string',
      },
      categories: {
        type: 'array',
        'x-control': ControlType.selectMany,
        items: {
          type: 'string',
        },
        'x-control-variant': 'combo',
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
          children: 'children',
        },
        categories: 'name',
      },
      tags: {
        type: 'array',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          value: 'name',
          label: 'name',
        },
        categories: 'name',
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
        group: 'sort',
      },
      maxItems: {
        type: 'number',
        displayStyle: 'outlined',
        group: 'sort',
        styling: {
          container: 'w-30',
        },
      },
      random: {
        type: 'boolean',
        group: 'sort',
      },
      rows: {
        type: 'array',
        styling: {
          container: 'px-0',
        },
        collapsible: 'close',
        dataSource: {
          source: 'collection',
          value: '{{datatype}}',
        },
        operations: ['pick', 'delete'],
        items: {
          styling: {
            container: 'px-0',
          },
          type: 'object',
          properties: {
            datatype: {
              type: 'string',
              group: 'select',
            },
            id: {
              type: 'string',
              group: 'select',
            },
            name: {
              type: 'string',
              group: 'select',
            },
          },
        },
      },
    },
  } as const;
};

const pageDataSchema = PageDataSchema();
const pageSchema = PageSchema();

export type PageDataModel = FromSchema<typeof pageDataSchema>;
export type PageModel = FromSchema<typeof pageSchema>;

registerCollection('Page', DataType.page, PageSchema(), null, null);
