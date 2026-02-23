import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const BankCardSchema = () => {
  return {
    type: 'object',
    properties: {
      // Card Identification
      cardId: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 12,
        maxLength: 16,
        unique: true,
        transform: ['random-string::12'],
        group: 'identification',
      },

      // Card Type
      cardType: {
        type: 'string',
        enum: ['virtual', 'physical'],
        default: 'virtual',
        group: 'type',
      },
      cardBrand: {
        type: 'string',
        enum: ['visa', 'mastercard'],
        default: 'visa',
        group: 'type',
      },
      cardProduct: {
        type: 'string',
        enum: ['debit', 'prepaid', 'credit'],
        default: 'debit',
        group: 'type',
      },

      // Card Details
      last4: {
        type: 'string',
        maxLength: 4,
        description: 'Last 4 digits of card number',
        group: 'details',
      },
      expirationMonth: {
        type: 'number',
        minimum: 1,
        maximum: 12,
        group: 'details',
      },
      expirationYear: {
        type: 'number',
        group: 'details',
      },
      cardholderName: {
        type: 'string',
        group: 'details',
      },

      // Linked Bank Account
      bankAccountId: {
        type: 'string',
        description: 'Links to bank_account for funding',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.bank_account,
          value: 'sk',
          label: ['name', 'accountNumber'],
        },
        group: 'account',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'active', 'frozen', 'cancelled', 'expired', 'lost', 'stolen'],
        default: 'pending',
        group: 'status',
      },
      statusReason: {
        type: 'string',
        group: 'status',
      },

      // Limits
      limits: {
        type: 'object',
        title: 'Card Limits',
        collapsible: true,
        properties: {
          dailySpendLimit: {
            type: 'number',
            description: 'Daily spend limit in cents',
            group: 'limits',
          },
          monthlySpendLimit: {
            type: 'number',
            description: 'Monthly spend limit in cents',
            group: 'limits',
          },
          perTransactionLimit: {
            type: 'number',
            description: 'Per transaction limit in cents',
            group: 'limits',
          },
          dailyAtmLimit: {
            type: 'number',
            description: 'Daily ATM withdrawal limit in cents',
            group: 'limits',
          },
          dailySpentAmount: {
            type: 'number',
            default: 0,
            description: 'Amount spent today in cents',
            group: 'usage',
          },
          monthlySpentAmount: {
            type: 'number',
            default: 0,
            description: 'Amount spent this month in cents',
            group: 'usage',
          },
        },
      },

      // Controls
      controls: {
        type: 'object',
        title: 'Card Controls',
        collapsible: true,
        properties: {
          atmEnabled: {
            type: 'boolean',
            default: true,
            group: 'channels',
          },
          onlineEnabled: {
            type: 'boolean',
            default: true,
            group: 'channels',
          },
          internationalEnabled: {
            type: 'boolean',
            default: false,
            group: 'channels',
          },
          contactlessEnabled: {
            type: 'boolean',
            default: true,
            group: 'channels',
          },
          // Merchant Category Code restrictions
          blockedMccs: {
            type: 'array',
            items: { type: 'string' },
            description: 'Blocked merchant category codes',
          },
          allowedMccs: {
            type: 'array',
            items: { type: 'string' },
            description: 'Allowed merchant category codes (if set, only these are allowed)',
          },
        },
      },

      // Provider Info
      provider: {
        type: 'string',
        enum: ['marqeta', 'galileo', 'stripe_issuing', 'internal'],
        default: 'marqeta',
        group: 'provider',
      },
      providerCardId: {
        type: 'string',
        description: 'External provider card ID',
        group: 'provider',
      },
      providerToken: {
        type: 'string',
        description: 'Provider card token',
        group: 'provider',
      },

      // Physical Card Details
      physicalCard: {
        type: 'object',
        title: 'Physical Card',
        collapsible: true,
        properties: {
          shippingStatus: {
            type: 'string',
            enum: ['pending', 'shipped', 'delivered', 'returned'],
            group: 'shipping',
          },
          shippingCarrier: { type: 'string', group: 'shipping' },
          trackingNumber: { type: 'string', group: 'shipping' },
          shippedAt: { type: 'string', format: 'date-time' },
          deliveredAt: { type: 'string', format: 'date-time' },
          shippingAddress: {
            type: 'object',
            properties: {
              line1: { type: 'string' },
              line2: { type: 'string' },
              city: { type: 'string' },
              state: { type: 'string' },
              postalCode: { type: 'string' },
              country: { type: 'string' },
            },
          },
          activatedAt: { type: 'string', format: 'date-time' },
          activationRequired: { type: 'boolean', default: true },
        },
      },

      // PIN
      pinSet: {
        type: 'boolean',
        default: false,
        description: 'Whether PIN has been set',
        group: 'pin',
      },
      pinFailedAttempts: {
        type: 'number',
        default: 0,
        group: 'pin',
      },
      pinLockedAt: {
        type: 'string',
        format: 'date-time',
        group: 'pin',
      },

      // Digital Wallet
      digitalWallets: {
        type: 'array',
        title: 'Digital Wallets',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['apple_pay', 'google_pay', 'samsung_pay'],
              group: 'wallet',
            },
            status: {
              type: 'string',
              enum: ['active', 'suspended', 'removed'],
              group: 'wallet',
            },
            deviceId: { type: 'string' },
            tokenizedAt: { type: 'string', format: 'date-time' },
          },
        },
      },

      // Usage Statistics
      stats: {
        type: 'object',
        title: 'Usage Statistics',
        collapsible: true,
        readOnly: true,
        properties: {
          totalTransactions: { type: 'number', default: 0, group: 'stats' },
          totalSpent: { type: 'number', default: 0, description: 'Total lifetime spent in cents', group: 'stats' },
          lastUsedAt: { type: 'string', format: 'date-time' },
          lastUsedMerchant: { type: 'string' },
          lastUsedAmount: { type: 'number' },
        },
      },

      // Dates
      issuedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      activatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      cancelledAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },

      // Replacement
      replacesCardId: {
        type: 'string',
        description: 'ID of card this replaces',
        group: 'replacement',
      },
      replacedByCardId: {
        type: 'string',
        description: 'ID of card that replaced this',
        group: 'replacement',
      },

      // Internal Notes
      internalNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: ['cardType', 'cardBrand', 'bankAccountId'],
  } as const;
};

const sc = BankCardSchema();
export type BankCardModel = FromSchema<typeof sc>;

registerCollection('Bank Card', DataType.bank_card, BankCardSchema());
