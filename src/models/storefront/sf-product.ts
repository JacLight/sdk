import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { getCountryDropDownOptions } from '../../data';
import { SHIPPING_CLASSES } from './sf-shipping-config';
import { BusinessLocationField, BusinessLocationsField } from '../_location-fields';

/**
 * Stock held at each business location, kept by the server from the stock ledger
 * (sf_inventory rows and their movements): one entry per location that holds a row.
 * The same shape on the product and on each variation; `stock` is the total.
 */
const LocationStockField = () => ({
  type: 'array',
  title: 'Stock by location',
  readOnly: true,
  description: 'Kept by the server from stock movements (receive, sale, return, transfer, count, adjust).',
  items: {
    type: 'object',
    properties: {
      ...BusinessLocationField(),
      stock: { type: 'number' },
    },
  },
} as const);

// Product is entity-wide catalog. Prices and availability per REGION (a
// business location the selling site serves, `site.storefront.businessLocations`)
// ride on the product itself — `businessLocations` (where it is sold) and
// `tiers[].businessLocations` — and on pricing tables
// (`sf_price_list.businessLocations`). No per-location overlay record.

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
        // Left blank, the server makes one from the name when the product is created.
        placeholder: 'Made from the name if left blank',
        group: 'slug',
      },
      price: {
        type: 'number',
        group: 'price',
      },
      rewardPointsPrice: {
        type: 'integer',
        minimum: 1,
        title: 'Price in reward points',
        description: 'Reward points needed to buy one unit. Leave empty when it cannot be bought with points.',
        group: 'price',
      },
      cost: {
        type: 'number',
        group: 'price',
        hideIn: ['public'],
        description: 'Total unit cost — the sum of costComponents when those are used. Margin is price less this.',
      },

      // Margin is sale price less ALL associated cost, so the components have to be
      // capturable individually — a single "cost" number hides whether freight and
      // packaging were counted, and a margin that quietly omits them is wrong in the
      // direction that flatters the business.
      costComponents: {
        type: 'array',
        title: 'Cost breakdown',
        hideIn: ['public'],
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'e.g. purchase, freight in, packaging, handling, prep labour',
            },
            amount: { type: 'number' },
            note: { type: 'string' },
          },
        },
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
            ...BusinessLocationsField('Limit to shoppers in these regions (business locations). Empty = every region.'),
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
      /**
       * Content Studio posts (a course, an ebook, a video) this product sells. A paid
       * order gives the buyer each one (a post_progress), for `contentAccessDays` or for good.
       */
      content: {
        type: 'array',
        title: 'Content it sells',
        'x-control': ControlType.selectMany,
        items: { type: 'string' },
        dataSource: {
          source: 'collection',
          collection: DataType.post,
          value: 'sk',
          label: 'title',
        },
        group: 'status',
      },
      contentAccessDays: {
        type: 'integer',
        minimum: 1,
        title: 'Access for (days)',
        description: 'How long a buyer keeps the content. Empty: for good.',
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
      locationStock: { ...LocationStockField(), group: 'stock' },
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
      rewardPointsContribution: {
        type: 'integer',
        minimum: 0,
        title: 'Reward points earned',
        description: 'Reward points the buyer earns for each unit bought (on a paid order).',
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
      // Regions (business locations) this product is sold in. Same opt-in model
      // as salesChannels: empty = sold everywhere; a non-empty list = sold ONLY to
      // shoppers whose region (from the selling site) is listed — not listed and
      // not purchasable elsewhere. A site serving no locations ignores it.
      businessLocations: {
        ...BusinessLocationsField('Sold only in these regions (business locations). Empty = every region.').businessLocations,
        title: 'Sold in regions',
        group: 'channels',
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
          shipsAs: {
            type: 'string',
            enum: [...SHIPPING_CLASSES],
            'x-control': ControlType.selectSingle,
            description: 'How this ships. Empty for ordinary goods.',
            group: 'shipping-config',
          },
          config: {
            type: 'string',
            description: 'Shipping configuration to price this product (empty = the site default)',
            notes: 'Rarely needed. Say what the product is with Ships As instead of pointing it at a rate.',
            'x-control': ControlType.selectSingle,
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
          boxSizes: {
            type: 'array',
            title: 'Packaging (overrides the configuration)',
            collapsible: true,
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'What to call this box' },
                quantity: { type: 'number', default: 1, description: 'Units of this product per box' },
                length: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' },
                dimensionUnit: { type: 'string', enum: ['in', 'cm'], default: 'in' },
                weight: { type: 'number', description: 'Weight of the empty box, if it matters' },
                maxWeight: { type: 'number' },
                weightUnit: { type: 'string', enum: ['lb', 'kg'], default: 'lb' },
              },
            },
            group: 'shipping-packaging',
          },
          shipsAlone: {
            type: 'boolean',
            default: false,
            description: 'Always ships in its own package',
            group: 'shipping-packaging',
          },
          shipsFrom: {
            type: 'string',
            description: 'Ship from location (overrides config origin)',
            'x-control': ControlType.selectSingle,
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
                type: 'array',
                items: { type: 'string' },
                description: 'Countries where this product cannot be shipped',
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
            // PER-PRODUCT overrides. The referenced sf_attribute is the reusable
            // definition (e.g. a "color" attribute listing every color, or an
            // "artwork" file attribute); each product picks its own subset via
            // `options[]` below and sets whether the attribute is mandatory FOR
            // THIS PRODUCT here — the same attribute can be required on one
            // product and optional on another. A required `file` attribute
            // forces at least one upload before checkout; a required
            // `text`/`selection` forces a value. Enforced in the storefront
            // renderer's submit guard.
            required: {
              type: 'boolean',
              group: 'attribute',
              default: true,
              hint: 'Shopper must provide this attribute on THIS product before checkout. Off = optional.',
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
            rewardPointsPrice: {
              type: 'integer',
              minimum: 1,
              title: 'Price in reward points',
              description: "Empty = the product's price in reward points",
              group: 'sku',
            },
            rewardPointsContribution: {
              type: 'integer',
              minimum: 0,
              title: 'Reward points earned',
              description: "Empty = the product's reward points earned",
              group: 'sku',
            },
            stock: {
              type: 'number',
              group: 'sku',
            },
            locationStock: LocationStockField(),
            available: {
              type: 'boolean',
              group: 'sku',
            },
            hide: {
              type: 'boolean',
              'x-control-variant': 'checkbox',
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
      /**
       * Sell this product AS a gift card. When a paid order carries it, the
       * ledger issues one card per unit at the line's price (or the chosen
       * denomination) and emails it to the recipient the shopper named. The
       * product's own price is the default value; `denominations` offers fixed
       * choices, `allowCustomAmount` lets the shopper type one within the range.
       */
      giftCard: {
        type: 'object',
        group: 'gift-card',
        properties: {
          enabled: { type: 'boolean', description: 'This product is a gift card: buying it issues one.' },
          denominations: {
            type: 'array',
            items: { type: 'number' },
            description: 'Fixed values the shopper can pick, e.g. 25, 50, 100. Empty means only the product price.',
          },
          allowCustomAmount: { type: 'boolean' },
          minAmount: { type: 'number' },
          maxAmount: { type: 'number' },
          cardType: { type: 'string', enum: ['digital', 'physical'], default: 'digital' },
          expiresAfterDays: {
            type: 'number',
            description: 'Days from purchase until the card expires. Empty means never — the default for purchased cards.',
          },
          collectRecipient: { type: 'boolean', default: true, description: 'Ask for a recipient name, email and message at checkout.' },
          allowScheduledDelivery: { type: 'boolean', default: true, description: 'Let the shopper pick a date for the card email.' },
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
      /**
       * Restricted sale (alcohol, tobacco…). At the POS the operator adding the
       * line must hold the matching permission: the Workforce Readiness `pos`
       * gate is checked with `permissionScope`, which matches a requirement
       * rule's `enforcement.pos.permissionScope` (e.g. an alcohol server cert).
       */
      restriction: {
        type: 'object',
        group: 'restriction',
        collapsible: true,
        properties: {
          ageRestricted: { type: 'boolean', default: false, description: 'Age-restricted product (alcohol, tobacco…)' },
          minimumAge: { type: 'number', description: 'Minimum customer age, e.g. 21' },
          permissionScope: {
            type: 'string',
            description: 'POS permission the seller needs, e.g. alcohol. Matches a requirement rule’s POS permission scope. Empty with age-restricted on = age_restricted',
          },
        },
      },
      /**
       * Who sees the price on the site. `site` follows `site.storefront.priceShown`.
       * `in_cart`: lists and the product page show "Add to cart to see the price";
       * `signed_in`: guests see "Sign in to see the price" and cannot add it. The
       * server strips every price field from what it sends a shopper who may not
       * see it; staff screens always see prices.
       */
      priceShown: {
        type: 'string',
        title: 'Price shown',
        enum: ['site', 'always', 'in_cart', 'signed_in'],
        default: 'site',
        group: 'access',
      },
      /**
       * What a shopper must meet to buy this product. Empty rules = anyone. The
       * server checks it on every shopper read, on add to cart and at payment;
       * at the POS the reason is shown and staff may sell anyway.
       */
      purchaseRequirements: {
        type: 'object',
        collapsible: true,
        group: 'access',
        properties: {
          match: { type: 'string', enum: ['all', 'any'], default: 'all', description: 'Met when all rules hold, or any one' },
          whenNotMet: {
            type: 'string',
            enum: ['locked', 'hidden'],
            default: 'locked',
            description: 'Locked: listed, with the reason. Hidden: left out of lists for that shopper; a direct link opens it locked.',
          },
          message: { type: 'string', description: 'Optional sentence shown instead of the reason the store writes from the rules' },
          rules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                kind: { type: 'string', enum: ['membership', 'group', 'benefit', 'in_cart', 'bought_before'] },
                plans: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'membership: an active or trial subscription to one of these plans',
                  'x-control': ControlType.selectMany,
                  dataSource: { source: 'collection', collection: DataType.sf_subscription_plan, value: 'name', label: 'name' },
                },
                groups: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'group: in one of these customer groups',
                  'x-control': ControlType.selectMany,
                  dataSource: { source: 'collection', collection: DataType.customer_group, value: 'name', label: 'name' },
                },
                benefits: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'benefit: an approved or active enrollment in one of these program benefits',
                  'x-control': ControlType.selectMany,
                  dataSource: { source: 'collection', collection: DataType.benefit, value: 'name', label: 'name' },
                },
                products: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'in_cart / bought_before: these products (any variation counts)',
                  'x-control': ControlType.lookup,
                  dataSource: { source: 'collection', collection: DataType.sf_product, value: 'sku', label: 'name' },
                },
                minQuantity: { type: 'integer', minimum: 1, default: 1, description: 'in_cart / bought_before: at least this many, in total' },
              },
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
          "The product's own publishing/approval workflow — the workflow a product goes through to be approved and published into the catalog. It has nothing to do with orders: order lines are prepared by their prepStation option and fired to prep-pipeline.",
        collapsible: true,
        properties: {
          workflowId: {
            type: 'string',
            description: 'Workflow definition that approves/publishes this product into the catalog (not a kitchen or prep station)',
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
