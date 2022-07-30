import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType, FormViewSectionType } from '../../types';

export const SFProductSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      sku: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
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
        type: 'array',
        hideLabel: true,
        fieldType: FieldType.file,
        items: {
          type: 'object',
          properties: {
            path: {
              type: 'string'
            },
            url: {
              type: 'string'
            }
          }
        }
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
        items: {
          type: 'string',
          fieldType: FieldType.selectionmultiple,
          dataSource: {
            source: 'collection',
            collection: DataType.sf_attribute,
            field: 'options',
          },
        }
      },
      variations: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            price: {
              type: 'number'
            },
            stock: { type: 'number' },
            attributes: {
              type: 'array',
              items: {
                type: 'string',
              }
            },
            images: {
              type: 'array',
              items: {
                fieldType: FieldType.file,
                type: 'string'
              }
            }
          }
        }
      },
      bundle: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
          field: 'name',
        },
      },
      discount: { type: 'string', hidden: true },
      promotion: { type: 'string', hidden: true },
      status: { type: 'string' },
      views: { type: 'number', fieldType: 'label' },
    },
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
      title: 'Attributes & Variations',
      items: [
        {
          '0': '/properties/attributes',
        },
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
const dd = SFProductSchema();
export type SFProductModel = FromSchema<typeof dd>;

export const SFProductRules = (): CollectionRule[] => { return null };
registerCollection('Store Product', DataType.sf_product, SFProductSchema(), SFProductUI(), SFProductRules(), false, true)
