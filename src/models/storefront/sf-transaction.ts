import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { ControlType, DataType } from '../../types';

export const SFTransactionSchema = () => {
  return {
    type: 'object',
    properties: {
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getCustomerRecipients',
        },
      },
      invoiceType: {
        type: 'string',
        group: 'number',
        enum: ['order', 'subscription', 'invoice', 'refund', 'other'],
      },
      invoiceNumber: {
        type: 'string',
        group: 'number',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        fetchData: { datatype: DataType.sf_invoice },
        dataSource: {
          source: 'collection',
          collection: DataType.sf_invoice,
        },
        rules: [
          { operation: 'equal', valueA: '{{invoiceType}}', valueB: 'order', action: 'set-property', property: [{ key: 'dataSource.collection', value: DataType.sf_order }, { key: 'fetchData', value: { datatype: DataType.sf_order } }] },
          { operation: 'equal', valueA: '{{invoiceType}}', valueB: 'subscription', action: 'set-property', property: [{ key: 'dataSource.collection', value: DataType.sf_subscription }, { key: 'fetchData', value: { datatype: DataType.sf_subscription } }] },
          { operation: 'equal', valueA: '{{invoiceType}}', valueB: 'invoice', action: 'set-property', property: [{ key: 'dataSource.collection', value: DataType.sf_invoice }, { key: 'fetchData', value: { datatype: DataType.sf_invoice } }] },
          { operation: 'equal', valueA: '{{invoiceType}}', valueB: 'refund', action: 'set-property', property: [{ key: 'dataSource.collection', value: DataType.sf_refund }, { key: 'fetchData', value: { datatype: DataType.sf_refund } }] },
          { operation: 'equal', valueA: '{{invoiceType}}', valueB: 'other', action: 'set-property', property: [{ key: 'x-control', value: 'text' }, { key: 'x-control-variant', value: '' }, { key: 'fetchData', value: '' }] },
        ]
      },
      currency: {
        type: 'string',
        group: 'name',
        dataBind: 'invoiceNumber.data.currency',
      },
      amount: {
        type: 'string',
        group: 'name',
        dataBind: 'invoiceNumber.data.amount',
      },
      tax: {
        type: 'string',
        group: 'name',
        dataBind: 'invoiceNumber.data.tax',
      },
      remarks: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      status: {
        type: 'string',
        enum: ['new', 'pending', 'paid', 'failed', 'mismatch', 'cancelled', 'refunded'],
        group: 'status',
      },
      gateway: {
        type: 'string',
        enum: ['stripe', 'paypal', 'razorpay', 'paytm', 'payu', 'instamojo', 'ccavenue', 'cash', 'cheque', 'bank-transfer', 'gift-card', 'other'],
        group: 'status',
      },
      ref: {
        type: 'string',
      },
      captureInfo: {
        type: 'string',
        hidden: true,
      },
      requestInfo: {
        type: 'string',
        hidden: true,
      },
    },
  } as const;
};

const ms = SFTransactionSchema();
export type SFTransactionModel = FromSchema<typeof ms>;

export const SFTransactionUI = (): CollectionUI[] => {
  return null;
};
export const SFTransactionRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Store Transaction',
  DataType.sf_transaction,
  SFTransactionSchema(),
  SFTransactionUI(),
  SFTransactionRules(),
  true
);
