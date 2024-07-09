import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType, FormViewSectionType } from '../../types';

export const SFInvoiceSchema = () => {
  return {
    type: 'object',
    properties: {
      number: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 10,
        maxLength: 10,
        unique: true,
        transform: ['random-string::10'],
        group: 'number'
      },
      po: {
        type: 'string',
        group: 'number'
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
        group: 'address'
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
        group: 'address'
      },
      invoiceData: {
        type: 'string',
        default: '{{fn:date-now}}',
        group: 'date'
      },
      dueDate: {
        type: 'string',
        default: '{{fn:date-now}}',
        group: 'date'
      },
      paymentDate: {
        type: 'string',
      },
      products: {
        type: 'array',
        collapsible: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        'x-control-variant': 'picker',
        displayStyle: 'table',
        items: {
          type: 'object',
          properties: {
            sk: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            quantity: { type: 'number' },
            amount: { type: 'number', readOnly: true },
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
      },
      discount: {
        type: 'string',
        group: 'discount'
      },
      discountCode: {
        type: 'string',
        group: 'discount'
      },
      tax: {
        type: 'string',
        group: 'discount'
      },
      payment: {
        type: 'string',
        group: 'payment'
      },
      total: {
        type: 'string',
        group: 'payment'
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
      ],
    },
    {
      type: FormViewSectionType.section2column,
      title: 'Items',
      collapsible: true,
      items: [
        {
          '0': '/properties/items',
        },
      ],
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
        },
      ],
    },
  ];
};

const is = SFInvoiceSchema();
export type SFInvoiceModel = FromSchema<typeof is>;

export const SFInvoiceRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Invoice',
  DataType.sf_invoice,
  SFInvoiceSchema(),
  [],
  SFInvoiceRules(),
  true
);
