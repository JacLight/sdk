import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const SFInvoiceSchema = () => {
  return {
    type: 'object',
    properties: {
      number: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 8,
        maxLength: 8,
        unique: true,
        transform: ['random-string::8'],
        group: 'number',
      },
      po: {
        type: 'string',
        group: 'number',
      },
      billTo: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'username',
          label: ['username', 'email'],
        },
        group: 'address',
      },
      shipTo: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'username',
          label: ['username', 'email'],
        },
        group: 'address',
      },
      invoiceDate: {
        type: 'string',
        default: '{{fn:new Date().toLocaleDateString()}}',
        group: 'date',
      },
      dueDate: {
        type: 'string',
        default: '{{fn:new Date().toLocaleDateString()}}',
        group: 'date',
      },
      paymentDate: {
        type: 'string',
        group: 'date',
        readOnly: true,
      },
      products: {
        type: 'array',
        collapsible: true,
        showIndex: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        'x-control-variant': 'picker',
        displayStyle: 'table',
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            sk: { type: 'string', hideIn: ['table'] },
            sku: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string', hideIn: ['table'] },
            price: { type: 'number', readOnly: true },
            quantity: {
              type: 'number',
              editable: true,
              default: 1,
              styleClass: 'w-16 text-right',
            },
            discount: {
              type: 'number',
              editable: true,
              default: 0,
              styleClass: 'w-32 text-right',
            },
            amount: {
              type: 'number',
              format: 'currency',
              readOnly: true,
              fn:
                '((rowData.quantity || 1) * (rowData.price || 0)) - (rowData.discount || 0)',
            },
          },
        },
      },
      itemCount: {
        type: 'number',
        readOnly: true,
        group: 'subTotal',
      },
      subTotal: {
        type: 'string',
        group: 'subTotal',
        readOnly: true,
        fn: 'data.products.reduce((acc, item) => acc + (item.amount || 0), 0)',
        format: 'currency',
      },
      discount: {
        type: 'string',
        group: 'discount',
        format: 'currency',
      },
      discountCode: {
        type: 'string',
        group: 'discount',
      },
      tax: {
        type: 'string',
        group: 'discount',
        format: 'currency',
      },
      paymentRef: {
        type: 'string',
        group: 'payment',
      },
      total: {
        type: 'string',
        group: 'payment',
        readOnly: true,
        fn:
          'parseFloat(data.products.reduce((acc, item) => acc + (item.amount || 0), 0) || 0) + parseFloat(data.tax || 0) - parseFloat(data.discount || 0)',
        format: 'currency',
      },
      template: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'name',
          label: ['name', 'from'],
        },
        items: {
          type: 'string',
        },
        group: 'template',
      },
      delivery: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'template',
        dataSource: {
          source: 'json',
          json: ['Email', 'SMS', 'WhatsApp'].map(item => ({
            value: item,
            label: item,
          })),
        },
      },
      paymentMethods: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        group: 'template',
        dataSource: {
          source: 'collection',
          collection: DataType.config,
          value: 'name',
          label: ['name', 'from'],
          filter: { property: 'type', value: 'payment' },
        },
      },
      status: {
        type: 'string',
        group: 'status',
      },
      remarks: {
        type: 'string',
        group: 'status',
      },
    },
    required: ['number'],
  } as const;
};


const is = SFInvoiceSchema();
export type SFInvoiceModel = FromSchema<typeof is>;
registerCollection(
  'Store Invoice',
  DataType.sf_invoice,
  SFInvoiceSchema()
);
