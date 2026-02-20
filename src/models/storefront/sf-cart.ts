import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { DataType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

// Cart item schema - shared between products and rentals
const CartItemSchema = {
  type: 'object',
  properties: {
    sku: { type: 'string' },
    name: { type: 'string' },
    image: { type: 'string' },
    quantity: { type: 'number', default: 1 },
    unitPrice: { type: 'number', description: 'Price per unit' },
    amount: { type: 'number', description: 'unitPrice * quantity' },
    discount: { type: 'number', default: 0, description: 'Discount amount for this item' },
    deposit: { type: 'number', default: 0, description: 'Deposit for this item (rentals only)' },
    depositWaived: { type: 'boolean', default: false, description: 'Deposit waived by discount' },
    categoryId: { type: 'string' },
    itemType: { type: 'string', enum: ['product', 'rental', 'fee', 'addon'], default: 'product' },
    parentSku: { type: 'string', description: 'Links fee/addon to parent item' },
    waived: { type: 'boolean', default: false, description: 'Waived by discount' },
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'string' },
        },
      },
    },
    // Rental-specific
    rentalId: { type: 'string', description: 'Reference to created sf_rental record' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    rentalPeriod: { type: 'string', enum: ['hourly', 'daily', 'weekly', 'monthly'] },
    duration: { type: 'number' },
    timezone: { type: 'string' },
    fulfillment: {
      type: 'object',
      description: 'Customer selected fulfillment method',
      properties: {
        type: { type: 'string', enum: ['pickup', 'delivery'] },
        address: {
          type: 'object',
          properties: {
            street1: { type: 'string' },
            street2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
            country: { type: 'string' },
          },
        },
        instructions: { type: 'string' },
        fee: { type: 'number', description: 'Delivery fee (if delivery selected)' },
        feeWaived: { type: 'boolean', default: false, description: 'Delivery fee waived by discount' },
        scheduledDate: { type: 'string', format: 'date', description: 'Scheduled delivery/pickup date' },
        scheduledTime: { type: 'string', description: 'Scheduled delivery/pickup time slot' },
        distance: { type: 'number', description: 'Distance in miles (for delivery)' },
      },
    },
    return: {
      type: 'object',
      description: 'Customer selected return method',
      properties: {
        type: { type: 'string', enum: ['dropoff', 'pickup'] },
        address: {
          type: 'object',
          properties: {
            street1: { type: 'string' },
            street2: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            postalCode: { type: 'string' },
            country: { type: 'string' },
          },
        },
        instructions: { type: 'string' },
        fee: { type: 'number', description: 'Return pickup fee (if pickup selected)' },
        feeWaived: { type: 'boolean', default: false, description: 'Return fee waived by discount' },
        scheduledDate: { type: 'string', format: 'date', description: 'Scheduled return date' },
        scheduledTime: { type: 'string', description: 'Scheduled return time slot' },
        distance: { type: 'number', description: 'Distance in miles (for return pickup)' },
      },
    },
    fees: {
      type: 'array',
      description: 'Applied fees (mandatory + customer-selected optional)',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          amount: { type: 'number' },
          waived: { type: 'boolean' },
        },
      },
    },
    feesTotal: { type: 'number', default: 0, description: 'Sum of all fees for this item (rentals only)' },
    lineTotal: { type: 'number', default: 0, description: 'amount + feesTotal (full cost including fees, rentals only)' },
    // Tier/volume pricing info
    originalPrice: { type: 'number', description: 'Price before tier discount' },
    finalPrice: { type: 'number', description: 'Price after tier discount (same as unitPrice)' },
    totalPrice: { type: 'number', description: 'finalPrice * quantity' },
    tierDiscount: { type: 'number', description: 'Tier discount amount per unit' },
    discountPercent: { type: 'number', description: 'Tier discount percentage' },
    appliedRule: { type: 'string', description: 'Display label e.g. "Volume: 3+"' },
    appliedRuleType: { type: 'string', enum: ['product_tier', 'group_pricing', 'price_list'], description: 'Type of pricing rule applied' },
    tier: {
      type: 'object',
      properties: {
        minQty: { type: 'number' },
        maxQty: { type: 'number' },
      },
    },
    currency: { type: 'string', description: 'Currency code e.g. USD' },
  },
} as const;

export const SFCartSchema = () => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
      },
      source: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },

      // ========== ITEMS ==========
      productItems: {
        type: 'array',
        description: 'Product items',
        items: CartItemSchema,
      },
      rentalItems: {
        type: 'array',
        description: 'Rental items',
        items: CartItemSchema,
      },

      // ========== RENTAL TOTALS ==========
      rentalSubtotal: {
        type: 'number',
        default: 0,
        description: 'Rental items total (before discount)',
      },
      rentalDeposit: {
        type: 'number',
        default: 0,
        description: 'Total deposit for all rental items',
      },
      rentalDiscount: {
        type: 'number',
        default: 0,
        description: 'Total discount applied to rentals',
      },
      rentalTax: {
        type: 'number',
        default: 0,
        description: 'Tax on rental items',
      },
      rentalDeliveryFee: {
        type: 'number',
        default: 0,
        description: 'Delivery/drop-off fee for rentals',
      },
      rentalFees: {
        type: 'number',
        default: 0,
        description: 'Total of additional fees (Cleaning, Insurance, etc.)',
      },
      rentalFeesList: {
        type: 'array',
        description: 'Itemized additional fees for display',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            amount: { type: 'number' },
            waived: { type: 'boolean' },
          },
        },
      },
      rentalTotal: {
        type: 'number',
        default: 0,
        description: 'Rental total (rentalSubtotal + rentalFees - rentalDiscount + rentalTax + rentalDeliveryFee)',
      },
      rentalCount: {
        type: 'number',
        default: 0,
        description: 'Number of rental items',
      },

      // ========== PRODUCT TOTALS ==========
      productSubtotal: {
        type: 'number',
        default: 0,
        description: 'Product items total (before discount)',
      },
      productDiscount: {
        type: 'number',
        default: 0,
        description: 'Total discount applied to products',
      },
      productTax: {
        type: 'number',
        default: 0,
        description: 'Tax on product items',
      },
      productShipping: {
        type: 'number',
        default: 0,
        description: 'Shipping cost for products',
      },
      productTotal: {
        type: 'number',
        default: 0,
        description: 'Product total (productSubtotal - productDiscount + productTax + productShipping)',
      },
      productCount: {
        type: 'number',
        default: 0,
        description: 'Number of product items',
      },

      // ========== COMBINED TOTALS ==========
      subtotal: {
        type: 'number',
        default: 0,
        description: 'Combined subtotal (rentalSubtotal + productSubtotal)',
      },
      discount: {
        type: 'number',
        default: 0,
        description: 'Combined discount (rentalDiscount + productDiscount)',
      },
      tax: {
        type: 'number',
        default: 0,
        description: 'Combined tax (rentalTax + productTax)',
      },
      deposit: {
        type: 'number',
        default: 0,
        description: 'Same as rentalDeposit',
      },
      total: {
        type: 'number',
        default: 0,
        description: 'Grand total (rentalTotal + productTotal + deposit)',
      },
      shippingMethod: {
        type: 'string',
      },
      depositWaived: {
        type: 'boolean',
        default: false,
        description: 'Deposit waived by discount',
      },
      freeShipping: {
        type: 'boolean',
        default: false,
        description: 'Shipping waived by discount',
      },
      freeDelivery: {
        type: 'boolean',
        default: false,
        description: 'Rental delivery fee waived by discount',
      },
      freeReturnPickup: {
        type: 'boolean',
        default: false,
        description: 'Rental return pickup fee waived by discount',
      },
      feesWaived: {
        type: 'boolean',
        default: false,
        description: 'All fees waived by discount',
      },

      // Applied discounts
      discounts: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['percent', 'fixed', 'free_shipping', 'free_deposit', 'free_delivery', 'waive_fees', 'buy_x_get_y'] },
            message: { type: 'string' },
          },
        },
      },

      // Checkout Info
      checkoutInfo: {
        type: 'object',
        properties: {
          paymentMethod: { type: 'string' },
          paymentStatus: { type: 'string' },
          paymentId: { type: 'string' },
          transactionId: { type: 'string' },
          deliveryMethod: { type: 'string' },
          deliveryAddress: { type: 'string' },
          deliveryDate: { type: 'string' },
          deliveryTime: { type: 'string' },
          notes: { type: 'string' },
        },
      },

      // Addresses
      billingAddress: AddressSchema(),
      shippingAddress: AddressSchema(),
    },
  } as const;
};

const ms = SFCartSchema();
export type SFCartModel = FromSchema<typeof ms>;

registerCollection(
  'Store Cart',
  DataType.sf_cart,
  SFCartSchema(),
);
