import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

/**
 * A gift card as the platform ledger stores it (`GiftCardService`).
 *
 * The record is the ledger: `initialAmount` is what it was issued with,
 * `balance` is what is left, and `uses[]` is every movement in between —
 * redemptions, refunds, adjustments and transfers — each carrying its own
 * `transactionId`, which is the reference a payment is verified against.
 *
 * The PIN is never stored; `pinHash` is. `code` is the customer-facing
 * redemption code, `codeKey` its normalised form (upper-case, no separators)
 * that lookups match on exactly. `serial` is the operator's identifier.
 *
 * `type` decides the money: a `purchased` card is a liability until it is
 * redeemed; a `promotional` card was never paid for and is not.
 */
export const SFGiftCardSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        group: 'identity',
      },
      serial: {
        type: 'string',
        readOnly: true,
        unique: true,
        group: 'identity',
        description: 'Operator identifier, e.g. GC-7K2M-9QX4-H1P7. Every admin endpoint addresses a card by this.',
      },
      code: {
        type: 'string',
        readOnly: true,
        unique: true,
        group: 'identity',
        description: 'Redemption code given to the customer. Not the serial.',
      },
      codeKey: {
        type: 'string',
        readOnly: true,
        unique: true,
        hidden: true,
        textSearch: false,
        description: 'The code with separators removed and upper-cased; what a redemption looks the card up by.',
      },
      pinHash: {
        type: 'string',
        hidden: true,
        readOnly: true,
        textSearch: false,
      },
      batch: {
        type: 'string',
        readOnly: true,
        group: 'identity',
      },
      batchName: { type: 'string', group: 'identity', description: 'The batch\'s name, written onto every card in it.' },
      batchNote: { type: 'string', group: 'identity', description: 'What the batch is for / where the stock is kept.' },
      campaign: { type: 'string', group: 'identity', description: 'Promotional campaign the card was issued for — reported in gift card insights.' },
      type: {
        type: 'string',
        enum: ['physical', 'digital', 'promotional'],
        default: 'digital',
        group: 'status',
      },
      status: {
        type: 'string',
        enum: ['inactive', 'active', 'used', 'expired', 'cancelled', 'suspended'],
        default: 'inactive',
        group: 'status',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'value',
      },
      initialAmount: {
        type: 'number',
        group: 'value',
        description: 'Value the card was issued with.',
      },
      balance: {
        type: 'number',
        readOnly: true,
        group: 'value',
        description: 'Remaining value. Only the ledger moves this.',
      },
      purchaseDate: { type: 'string', format: 'date-time', readOnly: true, group: 'dates' },
      activationDate: { type: 'string', format: 'date-time', readOnly: true, group: 'dates' },
      expirationDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
        description: 'Empty means the card never expires. Purchased cards default to never; promotional cards may carry a date.',
      },
      purchasedBy: {
        type: 'string',
        group: 'people',
        description: 'Email of the buyer.',
      },
      purchaseOrderNumber: {
        type: 'string',
        readOnly: true,
        group: 'people',
        description: 'The order that sold this card.',
      },
      customerId: {
        type: 'string',
        group: 'people',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: 'email',
        },
        description: 'The customer whose wallet holds this card.',
      },
      recipientName: { type: 'string', group: 'recipient' },
      recipientEmail: { type: 'string', format: 'email', group: 'recipient' },
      recipientPhone: { type: 'string', group: 'recipient', description: 'For sending the card by SMS or WhatsApp.' },
      shareToken: {
        type: 'string',
        readOnly: true,
        unique: true,
        hidden: true,
        textSearch: false,
        description: 'Signed token behind the card\'s shareable link; reveals the code to whoever holds the link.',
      },
      deliveries: {
        type: 'array',
        readOnly: true,
        group: 'recipient',
        description: 'Every time the card was sent, on which channel, to whom.',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            channel: { type: 'string', enum: ['email', 'sms', 'whatsapp', 'link', 'print'] },
            to: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
            by: { type: 'string' },
          },
        },
      },
      recipientMessage: { type: 'string', 'x-control-variant': 'textarea', group: 'recipient' },
      messageTemplate: {
        type: 'string',
        group: 'recipient',
        description: 'Optional. The Message Template the card is sent with; its `<name>-sms` sibling (or gift-card-issued-sms) goes by text. Empty means the platform default, gift-card-issued.',
      },
      deliverAt: {
        type: 'string',
        format: 'date-time',
        group: 'recipient',
        description: 'When to email the card to the recipient. Empty means as soon as it is issued.',
      },
      deliveredAt: { type: 'string', format: 'date-time', readOnly: true, group: 'recipient' },
      restrictions: {
        type: 'object',
        group: 'restrictions',
        properties: {
          minPurchase: { type: 'number', description: 'Order must total at least this before the card can be applied.' },
          maxUsePerTransaction: { type: 'number', description: 'Most that may be redeemed in one order.' },
          productSkus: {
            type: 'array',
            items: { type: 'string' },
            'x-control-variant': 'chip',
            'x-control': ControlType.selectMany,
            dataSource: { source: 'collection', collection: DataType.sf_product, value: 'sku', label: 'name' },
          },
          categoryIds: {
            type: 'array',
            items: { type: 'string' },
            'x-control-variant': 'chip',
            'x-control': ControlType.selectMany,
            dataSource: { source: 'collection', collection: DataType.category, value: 'name', label: 'name' },
          },
          customerGroups: {
            type: 'array',
            items: { type: 'string' },
            'x-control-variant': 'chip',
            'x-control': ControlType.selectMany,
            dataSource: { source: 'collection', collection: DataType.usergroup, value: 'name', label: 'name' },
          },
          excludeDiscountedItems: { type: 'boolean' },
        },
      },
      uses: {
        type: 'array',
        readOnly: true,
        group: 'ledger',
        description: 'Every movement of value on the card, newest last.',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            transactionId: {
              type: 'string',
              unique: true,
              description: 'GCT-… reference. A payment recorded against the card is verified by this.',
            },
            idempotencyKey: {
              type: 'string',
              unique: true,
              description: 'Caller-supplied key; a repeat with the same key returns the first result instead of moving value twice.',
            },
            kind: {
              type: 'string',
              enum: ['redeem', 'refund', 'adjust', 'transfer_in', 'transfer_out', 'reload'],
            },
            date: { type: 'string', format: 'date-time' },
            amount: {
              type: 'number',
              description: 'Positive takes value off the card, negative puts it on.',
            },
            balanceAfter: { type: 'number' },
            orderNumber: { type: 'string' },
            usedBy: { type: 'string' },
            reason: { type: 'string' },
            channel: { type: 'string', description: 'Where it happened: checkout, pos, invoice, admin.' },
          },
        },
      },
      events: {
        type: 'array',
        readOnly: true,
        description: 'What happened to the card besides money: issued, activated, blocked, unblocked, cancelled, holder-changed, template-changed, reissued, purchase-refunded, shared, reloaded.',
        items: {
          type: 'object',
          properties: {
            kind: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
            by: { type: 'string' },
            reason: { type: 'string' },
            detail: { type: 'string' },
          },
        },
      },
      metadata: {
        type: 'object',
        hidden: true,
        additionalProperties: true,
      },
    },
    required: ['serial', 'code', 'type', 'status', 'initialAmount', 'balance', 'currency'],
  } as const;
};
const ms = SFGiftCardSchema();
export type SFGiftCardModel = FromSchema<typeof ms>;

registerCollection('Store Gift Card', DataType.sf_gift_card, SFGiftCardSchema());
