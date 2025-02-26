import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const SFProductSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        label: 'Title',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        default: '{{name}}',
        transform: ['uri', 'lowercase', 'suffix-', 'random-string'],
        textSearch: true,
      },
      sku: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        textSearch: true,
      },
      description: {
        type: 'string',
        hideLabel: true,
        'x-control': ControlType.richtext,
        textSearch: true,
      },
      brand: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_brand,
          value: 'name',
          label: 'name',
        },
      },
      price: {
        type: 'number',
      },
      cost: {
        type: 'number',
      },
      tax: {
        type: 'boolean',
      },
      plan: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_subscription_plan,
          value: 'name',
          label: 'name',
        },
      },
      sold: {
        type: 'number',
        hidden: true
      },
      posts: { type: 'object', hidden: true }, //  PostSchema(),
      image: {
        type: 'string',
        hidden: true,
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        hideLabel: true,
      },
      isbn: {
        type: 'string',
      },
      stock: { type: 'number' },
      parcel: {
        type: 'object',
        layout: 'horizontal',
        properties: {
          weight: {
            type: 'number',
          },
          length: {
            type: 'number',
          },
          height: {
            type: 'number',
          },
          width: {
            type: 'number',
          },
        },
      },
      points: { type: 'number' },
      available: { type: 'boolean' },
      attributes: {
        type: 'array',
        hideLabel: true,
        showIndex: true,
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            name: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.sf_attribute,
                value: 'name',
                label: 'name',
              },
            },
            options: {
              type: 'array',
              hideLabel: true,
              items: {
                type: 'object',
                properties: {
                  label: {
                    type: 'string',
                  },
                  value: {
                    type: 'string',
                  },
                  param: {
                    type: 'string',
                  },
                },
              },
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              styleClass: 'w-[60%]',
              dataSource: {
                source: 'collection',
                collection: DataType.sf_attribute,
                filter: {
                  property: 'name',
                  operation: 'equal',
                  value: '{{/properties/attributes/items/properties/name}}',
                },
                value: 'options',
                label: 'options',
              },
            },
          },
        },
      },
      variations: {
        type: 'array',
        hideLabel: true,
        showIndex: true,
        // displayStyle: 'card',
        items: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
              disabled: true,
            },
            price: {
              type: 'number',
            },
            stock: {
              type: 'number'
            },
            options: {
              type: 'array',
              title: 'Options',
              readOnly: true,
              displayStyle: 'card',
              items: {
                type: 'object',
                layout: 'horizontal',
                properties: {
                  name: {
                    type: 'string',
                    disabled: true,
                  },
                  label: {
                    type: 'string',
                    disabled: true,
                  },
                  value: {
                    type: 'string',
                    disabled: true,
                  },
                },
              },
            },
            image: {
              type: 'string',
            },
            images: {
              type: 'array',
              'x-control': ControlType.file,
              items: FileInfoSchema(),
              hideLabel: true,
            },
          },
        },
      },
      bundle: {
        type: 'array',
        displayStyle: 'table',
        hideLabel: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        items: {
          type: 'object',
          properties: {
            sk: {
              type: 'string',
            },
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      discount: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['draft', 'new', 'pre-order', 'available', 'sold-out', 'discontinued', 'not-for-sale'],
      },
    },
    required: ['name', 'sku'],
  } as const;
};

export const SFProductUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
          '1': '/properties/slug',
        },
        {
          '0': '/properties/sku',
          '1': '/properties/brand',
          '2': '/properties/status',
        },
        {
          '0': '/properties/price',
          '1': '/properties/discount',
          '2': '/properties/cost',
        },
        {
          '0': '/properties/tax',
          '1': '/properties/points',
          '2': '/properties/plan',
        },
      ],
    },
    {
      type: FormViewSectionType.section1column,
      default: true,
      title: 'Default',
      collapsible: true,
      items: [],
    },
    {
      type: FormViewSectionType.section2column,
      title: 'Description',
      collapsible: true,
      items: [
        {
          '0': '/properties/description',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Images',
      items: [
        {
          '0': '/properties/images',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Inventory',
      items: [
        {
          '0': '/properties/stock',
          '1': '/properties/isbn',
        },
        {
          '0': '/properties/parcel',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Attributes',
      items: [
        {
          '0': '/properties/attributes',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Variations',
      items: [
        {
          '0': '/properties/variations',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Bundle',
      items: [
        {
          '0': '/properties/bundle',
        },
      ],
    },
  ];
};

const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

registerCollection(
  'Store Product',
  DataType.sf_product,
  SFProductSchema(),
  SFProductUI(),
  null,
  false,
  true
);
