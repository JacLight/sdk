import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const SFProductSchema = () => {
  return {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        hidden: true,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      name: {
        type: 'string',
        label: 'Title',
      },
      sku: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      description: {
        type: 'string',
        hideLabel: true,
        fieldType: FieldType.richtext,
      },
      brand: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
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
      subscription: {
        type: 'boolean',
      },
      posts: { type: 'object', hidden: true }, //  PostSchema(),
      image: {
        type: 'string',
      },
      images: {
        type: 'array',
        fieldType: FieldType.file,
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
              fieldType: FieldType.selectionmultiple,
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
              fieldType: FieldType.selectionmultiple,
              inputStyle: 'chip',
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
            stock: { type: 'number' },
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
              fieldType: FieldType.file,
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
      defaultImage: { type: 'string', hidden: true },
      discount: { type: 'string', hidden: true },
      promotion: { type: 'string', hidden: true },
      status: { type: 'string' },
      views: { type: 'number', fieldType: 'label' },
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
        },
        {
          '0': '/properties/sku',
          '1': '/properties/brand',
          '2': '/properties/points',
        },
        {
          '0': '/properties/price',
          '1': '/properties/points',
          '2': '/properties/cost',
        },
        {
          '0': '/properties/tax',
          '1': '/properties/available',
          '2': '/properties/subscription',
        },
      ],
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
    // {
    //   type: FormViewSectionType.section2column,
    //   default: true,
    //   collapsible: true,
    // }
  ];
};

export const SFProductRules = (): CollectionRule[] => {
  return null
};

const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

registerCollection(
  'Store Product',
  DataType.sf_product,
  SFProductSchema(),
  SFProductUI(),
  SFProductRules(),
  false,
  true
);
