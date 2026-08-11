import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { getCountryDropDownOptions } from '../../data';

// Product is entity-wide catalog. Per-location pricing, tax, availability,
// and station routing live on `bm_location_product` (LocationProduct overlay).

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
      hide: {
        type: 'boolean',
        'x-control-variant': 'checkbox',
        group: 'price',
      },
      // Tiered pricing - can be for all customers or specific groups
      tiers: {
        type: 'array',
        collapsible: true,
        description: 'Pricing tiers (volume discounts, group pricing)',
        items: {
          type: 'object',
          properties: {
            minQuantity: {
              type: 'number',
              minimum: 1,
              description: 'Minimum quantity for this tier',
            },
            maxQuantity: {
              type: 'number',
              description: 'Maximum quantity (empty = unlimited)',
            },
            price: {
              type: 'number',
              description: 'Price per unit at this tier',
            },
            discountPercent: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Or % discount from base price',
            },
            groups: {
              type: 'array',
              description: 'Limit to specific groups (empty = all customers)',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              dataSource: {
                source: 'collection',
                collection: DataType.customer_group,
                value: 'name',
                label: 'name',
              },
              items: { type: 'string' },
            },
          },
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
      // Live-preview / mockup definition. Lets a product (e.g. a printable
      // shirt) declare a base mockup image and placement zones so the UI can
      // composite the customer's uploaded artwork onto it. The server only
      // stores this config + the base images; the UI does the compositing.
      // A zone maps to a `file`-type attribute by name; the UI overlays the
      // file the shopper uploaded for that attribute at the zone's position.
      preview: {
        type: 'object',
        collapsible: true,
        properties: {
          enabled: {
            type: 'boolean',
            description: 'Show a live design preview on the product page.',
          },
          views: {
            type: 'array',
            description: 'One entry per angle/side (Front, Back, …), each with its own mockup image and zones.',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Label for this view, e.g. "Front".' },
                baseImage: {
                  type: 'array',
                  'x-control': ControlType.file,
                  description: 'The mockup image for this view (the blank shirt). Single file.',
                  items: FileInfoSchema(),
                },
                zones: {
                  type: 'array',
                  description: 'Where uploaded artwork is placed on this view.',
                  items: {
                    type: 'object',
                    layout: 'horizontal',
                    properties: {
                      attribute: {
                        type: 'string',
                        description: 'Name of the file-type attribute whose upload fills this zone (e.g. "artwork").',
                        'x-control': ControlType.selectMany,
                        dataSource: { source: 'collection', collection: DataType.sf_attribute, value: 'name', label: 'name' },
                      },
                      label: { type: 'string', description: 'Human label for the zone, e.g. "Chest logo".' },
                      // Position + size as PERCENT of the base image (0–100) so
                      // the overlay scales with the mockup at any resolution.
                      x: { type: 'number', description: 'Left offset, % of image width (0–100).' },
                      y: { type: 'number', description: 'Top offset, % of image height (0–100).' },
                      width: { type: 'number', description: 'Zone width, % of image width.' },
                      height: { type: 'number', description: 'Zone height, % of image height.' },
                      rotation: { type: 'number', description: 'Rotation in degrees (default 0).' },
                      fit: {
                        type: 'string',
                        enum: ['contain', 'cover', 'fill'],
                        description: 'How the uploaded art fits the zone box.',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      // Which sales channels this product should be listed on (Google Merchant,
      // Facebook/Instagram Shop, TikTok Shop, eBay, …). Multi-select; the option
      // list is DYNAMIC — pulled from the server's channel registry
      // (GET sales-channel/channels) via the `getSalesChannels` dataSource
      // function, so new channels appear automatically. Values are channel ids.
      //
      // ENFORCED AT SYNC: null / empty  = list on ALL channels (opt-out model);
      // a non-empty list = list on ONLY those channels. So leaving it blank keeps
      // the product everywhere; adding channels restricts it to just those.
      salesChannels: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'channels',
        dataSource: { source: 'function', value: 'getSalesChannels' },
        items: { type: 'string' },
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
            description:
              'Select shipping configuration (leave empty to use site default)',
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
              {
                operation: 'notEqual',
                valueA: '{{override}}',
                valueB: 'flat',
                action: 'hide',
              },
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
                description:
                  'States/regions where this product cannot be shipped',
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
                  price: {
                    type: 'number',
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
                filter: { 'data.name': '{{name}}' },
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
      affiliateEligible: {
        type: 'boolean',
        default: true,
        description:
          'Whether this product is eligible for affiliate commissions',
        group: 'affiliate',
      },
      affiliateCommission: {
        type: 'number',
        description:
          'Product-specific commission rate (percentage). Overrides program default. Leave empty to use program rate.',
        group: 'affiliate',
      },
      workflow: {
        type: 'object',
        description:
          'Default processing pipeline this product fires into when added to an order (kitchen, bar, lab, prep station, etc.). Operator can override per fire.',
        collapsible: true,
        properties: {
          workflowId: {
            type: 'string',
            description: 'Default workflow definition this product routes to',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.workflow_definition,
              value: 'sk',
              label: 'name',
            },
            group: 'workflow',
          },
          defaultCourse: {
            type: 'string',
            description:
              'Default course/grouping (appetizer, main, dessert, drinks, etc.)',
            group: 'workflow',
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
