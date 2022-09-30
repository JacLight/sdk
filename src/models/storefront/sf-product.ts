import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const SFProductSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        label: 'Title'
      },
      sku: {
        type: 'string',
        pattern: '^[a-zA-Z_$0-9\-]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      description: {
        type: 'string',
        hideLabel: true,
        fieldType: FieldType.richtext
      },
      brand: {
        type: 'string',
      },
      price: {
        type: 'number',
      },
      cost: {
        type: 'number',
      },
      tax: {
        type: 'boolean'
      },
      subscription: {
        type: 'boolean',
      },
      posts: { type: 'object', hidden: true },//  PostSchema(),
      images: {
        hideLabel: true,
        ...FileInfoSchema()
      },
      isbn: {
        type: 'string',
      },
      stock: { type: 'number' },
      shipping: {
        type: 'object',
        layout: 'horizontal',
        properties: {
          weight: {
            type: 'number'
          },
          length: {
            type: 'number'
          },
          height: {
            type: 'number'
          },
          width: {
            type: 'number'
          },
        }
      },
      points: { type: 'number' },
      available: { type: 'boolean' },
      attributes: {
        type: 'array',
        hideLabel: true,
        showIndex: true,
        layout: 'horizontal',
        items: {
          type: 'object',
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
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              inputStyle: 'chip',
              dataSource: {
                source: 'collection',
                collection: DataType.sf_attribute,
                filter: { property: 'name', operation: 'equal', value: '{{/properties/attributes/items/properties/name}}' },
                value: 'options',
                label: 'options',
              },
            }
          }
        }
      },
      variations: {
        type: 'array',
        hideLabel: true,
        showIndex: true,
        displayStyle: 'card',
        items: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
              disabled: true
            },
            price: {
              type: 'number'
            },
            stock: { type: 'number' },
            options: {
              type: 'array',
              title: 'Options',
              readonly: true,
              displayStyle: 'card',
              layout: 'horizontal',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    disabled: true
                  },
                  label: {
                    type: 'string',
                    disabled: true
                  },
                  value: {
                    type: 'string',
                    disabled: true
                  },
                }
              }
            },
            images: FileInfoSchema(),
          }
        }
      },
      bundle: {
        type: 'array',
        inputStyle: 'table',
        hideLabel: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        items: {
          type: 'object',
          properties: {
            sk: {
              type: 'string'
            },
            sku: {
              type: 'string'
            },
            name: {
              type: 'string'
            }
          }
        },

      },
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
        },
        {
          '0': '/properties/price',
          '1': '/properties/cost',
          '3': '/properties/points',

        },
        {
          '0': '/properties/tax',
          '1': '/properties/available',
          '2': '/properties/subscription',
        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      title: 'Description',
      collapsible: true,
      items: [
        {
          '0': '/properties/description',
        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Images',
      items: [
        {
          '0': '/properties/images',
        },

      ]
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
          '0': '/properties/shipping',
        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Attributes',
      items: [
        {
          '0': '/properties/attributes',
        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Variations',
      items: [
        {
          '0': '/properties/variations',
        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Bundle',
      items: [
        {
          '0': '/properties/bundle',
        },

      ]
    },
    // {
    //   type: FormViewSectionType.section2column,
    //   default: true,
    //   collapsible: true,
    // }
  ]
}

export const SFProductRules = (): CollectionRule[] => {
  return [
    {
      name: 'Manual Selection',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/attributes/items/properties/options/dataSource/filterValue',
          sourceField: '/properties/attributes/items/properties/name',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/attributes/items/properties/name',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ]
};

const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

registerCollection('Store Product', DataType.sf_product, SFProductSchema(), SFProductUI(), SFProductRules(), false, true)
