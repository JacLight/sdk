import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType, FormViewSectionType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFOrderSchema = () => {
  return {
    type: 'object',
    properties: {
      store: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
      },
      number: {
        type: 'string',
        unique: true,
        readOnly: true,
      },
      status: {
        type: 'string',
        enum: [
          'new',
          'processing',
          'shipped',
          'delivered',
          'returned',
          'refunded',
          'cancelled',
        ],
      },
      name: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      currency: {
        type: 'string',
      },
      amount: {
        type: 'number',
      },
      tax: {
        type: 'number',
      },
      discount: {
        type: 'number',
      },
      discountInfo: {
        type: 'string',
      },
      discountCode: {
        type: 'string',
      },
      commission: {
        type: 'number',
      },
      affiliate: {
        type: 'string',
      },
      remarks: {
        type: 'string',
      },
      ip: {
        type: 'string',
      },
      paymentRef: {
        type: 'string',
      },
      paymentGateway: {
        type: 'string',
      },
      products: {
        type: 'array',
        hideLabel: true,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_product,
        },
        displayStyle: 'table',
        items: {
          type: 'object',
          properties: {
            sku: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            options: {
              type: 'string',
            },
            quantity: {
              type: 'number',
            },
            image: {
              type: 'string',
            },
          },
        },
      },
      shippingAddress: { ...AddressSchema() },
      billingAddress: { ...AddressSchema() },
      shippingInfo: {
        type: 'array',
        hideLabel: true,
        items: {
          type: 'object',
          properties: {
            carrier: {
              type: 'string',
            },
            tracker: {
              type: 'string',
            },
            rate: {
              type: 'string',
            },
            cost: {
              type: 'string',
            },
          },
        },
      },
    },
  } as const;
};

export const SFOrderUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/store',
          '1': '/properties/number',
          '2': '/properties/status',
        },
        {
          '0': '/properties/name',
          '1': '/properties/email',
        },
      ],
    },
    {
      type: FormViewSectionType.sectiontable,
      collapsible: true,
      title: 'products',
      items: [
        {
          '0': '/properties/products',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      title: 'Payment',
      collapsible: true,
      items: [
        {
          '0': '/properties/paymentRef',
          '1': '/properties/paymentGateway',
        },
        {
          '0': '/properties/currency',
          '1': '/properties/tax',
          '2': '/properties/amount',
        },
        {
          '0': '/properties/discount',
          '1': '/properties/discountInfo',
          '2': '/properties/discountCode',
        },
        {
          '1': '/properties/commission',
          '2': '/properties/affiliate',
        },
        {
          '0': '/properties/ip',
          '1': '/properties/remarks',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Shipping Address',
      items: [
        {
          '0': '/properties/shippingAddress',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Billing Address',
      items: [
        {
          '0': '/properties/billingAddress',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      title: 'Shipping Info',
      items: [
        {
          '0': '/properties/shippingInfo',
        },
      ],
    },
  ];
};

const ms = SFOrderSchema();
export type SFOrderModel = FromSchema<typeof ms>;

export const SFOrderRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Order',
  DataType.sf_order,
  SFOrderSchema(),
  SFOrderUI(),
  SFOrderRules()
);
