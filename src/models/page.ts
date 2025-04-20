import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';

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
      tracking: {
        type: 'object',
        properties: {
          pixel: {
            type: 'string',
          },
          googleAnalytic: {
            type: 'string',
          },
        }
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
      favicon: {
        type: 'string',
      },
      childNavigation: {
        type: 'boolean',
      },
      inheritParent: {
        type: 'boolean',
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
      content: {
        type: 'object',
        hidden: true,
      },
      priority: {
        type: 'integer',
      },
      animations: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
        }
      },
      actions: {
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
      clientData: {
        type: 'object',
        hidden: true,
      }
    },
    'x-layout': {
      main: {
        type: 'tab',
        id: 'main',
        items: [
          { id: 'Info', title: 'Info' },
          { id: 'seo', title: 'SEO' },
        ]
      }
    },
    required: ['name', 'slug', 'site'],
  } as const;
};

export const PageDataSchema = () => {
  return {
    type: 'object',
    displayStyle: 'card',
    properties: {
      dataType: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string'
        },
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
      },
      categories: {
        type: 'array',
        'x-control': ControlType.selectMany,
        items: {
          type: 'string'
        },
        'x-control-variant': 'combo',
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
          children: 'children',
        },
      },
      tags: {
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
        group: 'sort',
      },
      maxItems: {
        type: 'number',
        displayStyle: 'outlined',
        group: 'sort',
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
        group: 'random',
      },
      random: {
        type: 'boolean',
        group: 'random',
      },
      selection: {
        type: 'array',
        styling: {
          container: 'px-0'
        },
        collapsible: 'close',
        dataSource: {
          source: 'collection',
          value: '{{dataType}}',
        },
        operations: ['pick', 'delete'],
        items: {
          styling: {
            container: 'px-0'
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
