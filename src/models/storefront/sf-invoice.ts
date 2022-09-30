import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType, FormViewSectionType } from '../../types';

export const SFInvoiceSchema = () => {
  return {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        pattern: '^[a-zA-Z_$0-9\-]*$',
        minLength: 10,
        maxLength: 10,
        unique: true,
      },
      billTo: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_vendor,
          value: 'sk',
          label: 'name',
        },
      },
      po: {
        type: 'string',
      },
      invoiceData: {
        type: 'string',
      },
      dueDate: {
        type: 'string',
      },
      paymentDate: {
        type: 'string',
      },
      total: {
        type: 'string',
      },
      tax: {
        type: 'string',
      },
      discount: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      remarks: {
        type: 'string',
      },
      items: {
        type: 'array',
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        inputStyle: 'picker',
        items: {
          type: 'object',
          properties: {
            sk: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            quantity: { type: 'number' },
            amount: { type: 'number', readonly: true },
          }
        }
      },
    },
    required: ['name', 'sku'],
  } as const;
};


export const SFInvoiceUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/billTo',
        },
        {
          '0': '/properties/id',
          '1': '/properties/po',
        },
        {
          '0': '/properties/invoiceData',
          '1': '/properties/dueDate',
          '2': '/properties/paymentDate',

        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      title: 'Items',
      collapsible: true,
      items: [
        {
          '0': '/properties/items',
        },
      ]
    },
    {
      type: FormViewSectionType.section2column,
      title: 'Summary',
      items: [
        {
          '0': '/properties/tax',
          '1': '/properties/discount',
          '2': '/properties/total',
        },
        {
          '0': '/properties/status',
          '1': '/properties/remarks',
        }
      ]
    },
  ]
}

const is = SFInvoiceSchema();
export type SFInvoiceModel = FromSchema<typeof is>;

export const SFInvoiceRules = (): CollectionRule[] => { return null };
registerCollection('Store Invoice', DataType.sf_invoice, SFInvoiceSchema(), [], SFInvoiceRules(), true)