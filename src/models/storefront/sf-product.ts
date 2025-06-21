import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const SFProductSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        label: 'Title',
        group: 'name',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        default: '{{name}}',
        transform: ['uri', 'lowercase', 'suffix-', 'random-string'],
        textSearch: true,
        group: 'slug',
      },
      sku: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        textSearch: true,
        group: 'slug',
      },
      price: {
        type: 'number',
        group: 'price',
      },
      cost: {
        type: 'number',
        group: 'price',
      },
      tax: {
        type: 'boolean',
        group: 'price',
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
        group: 'status',
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
        group: 'status',
      },
      status: {
        type: 'string',
        group: 'status',
        enum: [
          'draft',
          'new',
          'pre-order',
          'available',
          'sold-out',
          'discontinued',
          'not-for-sale',
        ],
      },
      stock: {
        type: 'number',
        group: 'stock',
      },
      available: {
        type: 'boolean',
        group: 'stock',
      },
      isbn: {
        type: 'string',
        group: 'stock',
      },
      discount: {
        type: 'string',
        group: 'discount',
      },
      points: {
        type: 'number',
        group: 'discount',
      },
      download: {
        type: 'string',
        group: 'discount',
      },
      description: {
        type: 'string',
        hideLabel: true,
        'x-control': ControlType.richtext,
        textSearch: true,
      },
      sold: {
        type: 'number',
        hidden: true,
      },
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
      parcel: {
        type: 'object',
        collapsible: true,
        properties: {
          weight: {
            type: 'number',
            group: 'weight',
          },
          length: {
            type: 'number',
            group: 'weight',
          },
          height: {
            type: 'number',
            group: 'weight',
          },
          width: {
            type: 'number',
            group: 'weight',
          },
        },
      },
      attributes: {
        type: 'array',
        showIndex: true,
        collapsible: true,
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
              group: 'attribute',
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
              group: 'attribute',
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
        collapsible: true,
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
              type: 'number',
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
        collapsible: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        items: {
          type: 'object',
          properties: {
            sk: {
              type: 'string',
              group: 'bundle',
            },
            sku: {
              type: 'string',
              group: 'bundle',
            },
            name: {
              type: 'string',
              group: 'bundle',
            },
          },
        },
      },
    },
    required: ['name', 'sku'],
  } as const;
};

const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

registerCollection(
  'Store Product',
  DataType.sf_product,
  SFProductSchema()
);
