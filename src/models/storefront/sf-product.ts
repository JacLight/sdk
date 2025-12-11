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
              items: {
                type: 'object',
                properties: {
                  label: {
                    type: 'string',
                    group: 'option',
                  },
                  value: {
                    type: 'string',
                    group: 'option',
                  },
                  param: {
                    type: 'string',
                    group: 'option',
                  },
                },
              },
              group: 'attribute',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              dataSource: {
                source: 'collection',
                collection: DataType.sf_attribute,
                filter: {
                  property: 'name',
                  operation: 'equal',
                  value: '{{name}}',
                },
                value: 'options',
                label: 'options',
                valueAsOption: true,
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
              group: 'sku',
            },
            price: {
              type: 'number',
              group: 'sku',
            },
            stock: {
              type: 'number',
              group: 'sku',
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
                    group: 'option',
                  },
                  label: {
                    type: 'string',
                    disabled: true,
                    group: 'option',
                  },
                  value: {
                    type: 'string',
                    disabled: true,
                    group: 'option',
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
      extraInfo: {
        type: 'array',
        displayStyle: 'table',
        hideLabel: true,
        collapsible: true,
        operations: ['pick', 'add', 'edit', 'delete'],
        dataSource: {
          source: 'collection',
          collection: DataType.post,
        },
        items: {
          type: 'object',
          properties: {
            title: {
              group: 'bundle',
              type: 'string',
            },
            id: {
              type: 'string',
              group: 'bundle',
            },
            content: {
              type: 'string',
              'x-control': ControlType.richtext,
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
        operations: ['pick'],
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
      source: {
        type: 'string',
      },
      sourceUrl: {
        type: 'string',
      },
      batch: {
        type: 'string',
      },
    },
    required: ['name', 'sku'],
  } as const;
};

const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

registerCollection('Store Product', DataType.sf_product, SFProductSchema());
