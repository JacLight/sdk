import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { getCountryDropDownOptions } from '../../data';

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
        group: 'name',
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
      pricing: {
        type: 'string',
        description: 'Select pricing table for this product',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_price_list,
          value: 'name',
          label: 'name',
        },
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
          weightUnit: {
            type: 'string',
            enum: ['oz', 'lb', 'g', 'kg'],
            default: 'lb',
            group: 'weight',
          },
          length: {
            type: 'number',
            group: 'dimensions',
          },
          height: {
            type: 'number',
            group: 'dimensions',
          },
          width: {
            type: 'number',
            group: 'dimensions',
          },
          dimensionUnit: {
            type: 'string',
            enum: ['in', 'cm'],
            default: 'in',
            group: 'dimensions',
          },
        },
      },
      shipping: {
        type: 'object',
        collapsible: true,
        properties: {
          config: {
            type: 'string',
            description: 'Select shipping configuration (leave empty to use site default)',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.sf_shipping_config,
              value: 'name',
              label: 'title',
            },
            group: 'shipping-config',
          },
          override: {
            type: 'string',
            enum: ['', 'free', 'flat'],
            description: 'Quick override: free shipping or flat rate',
            group: 'shipping-config',
          },
          flatRate: {
            type: 'number',
            description: 'Flat rate amount (when override is flat)',
            rules: [
              { operation: 'notEqual', valueA: '{{override}}', valueB: 'flat', action: 'hide' },
            ],
            group: 'shipping-config',
          },
          currency: {
            type: 'string',
            default: 'USD',
            group: 'shipping-config',
          },
          shipsFrom: {
            type: 'string',
            description: 'Ship from location (overrides config origin)',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.location,
              value: 'name',
              label: 'name',
            },
          },
          restrictions: {
            type: 'object',
            collapsible: true,
            properties: {
              excludeCountries: {
                type: 'string',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                dataSource: {
                  source: 'json',
                  json: getCountryDropDownOptions(),
                },
              },
              excludeStates: {
                type: 'array',
                items: { type: 'string' },
                description: 'States/regions where this product cannot be shipped',
              },
              requiresSignature: {
                type: 'boolean',
                default: false,
                group: 'shipping-rules',
              },
              isHazmat: {
                type: 'boolean',
                default: false,
                group: 'shipping-rules',
              },
              isFragile: {
                type: 'boolean',
                default: false,
                group: 'shipping-rules',
              },
            },
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
