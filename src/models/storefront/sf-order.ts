import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

// Order item schema - shared between products and rentals
const OrderItemSchema = {
  type: 'object',
  properties: {
    sku: { type: 'string' },
    name: { type: 'string' },
    image: { type: 'string' },
    quantity: { type: 'number' },
    unitPrice: { type: 'number', description: 'Price per unit' },
    amount: { type: 'number', description: 'unitPrice * quantity' },
    discount: { type: 'number', description: 'Discount amount for this item' },
    deposit: {
      type: 'number',
      description: 'Deposit for this item (rentals only)',
    },
    depositWaived: {
      type: 'boolean',
      description: 'Deposit waived by discount',
    },
    categoryId: { type: 'string' },
    itemType: { type: 'string', enum: ['product', 'rental', 'fee', 'addon'] },
    parentSku: {
      type: 'string',
      description: 'Links fee/addon to parent item',
    },
    waived: { type: 'boolean' },
    // Options/variants selected by user
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
    rentalId: { type: 'string', description: 'Reference to sf_rental record' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    rentalPeriod: {
      type: 'string',
      enum: ['hourly', 'daily', 'weekly', 'monthly'],
    },
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
        fee: {
          type: 'number',
          description: 'Delivery fee (if delivery selected)',
        },
        feeWaived: {
          type: 'boolean',
          description: 'Delivery fee waived by discount',
        },
        scheduledDate: {
          type: 'string',
          format: 'date',
          description: 'Scheduled delivery/pickup date',
        },
        scheduledTime: {
          type: 'string',
          description: 'Scheduled delivery/pickup time slot',
        },
        distance: {
          type: 'number',
          description: 'Distance in miles (for delivery)',
        },
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
        fee: {
          type: 'number',
          description: 'Return pickup fee (if pickup selected)',
        },
        feeWaived: {
          type: 'boolean',
          description: 'Return fee waived by discount',
        },
        scheduledDate: {
          type: 'string',
          format: 'date',
          description: 'Scheduled return date',
        },
        scheduledTime: {
          type: 'string',
          description: 'Scheduled return time slot',
        },
        distance: {
          type: 'number',
          description: 'Distance in miles (for return pickup)',
        },
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
    feesTotal: {
      type: 'number',
      description: 'Sum of all fees for this item (rentals only)',
    },
    lineTotal: {
      type: 'number',
      description:
        'amount + feesTotal (full cost including fees, rentals only)',
    },
  },
} as const;

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
          'awaiting-payment',
          'paid-partial',
          'paid',
          'confirmed',
          'processing',
          'shipped',
          'partially-shipped',
          'delivered',
          'partially-delivered',
          'completed',
          'failed',
          'returned',
          'refunded',
          'cancelled',
        ],
      },
      orderType: {
        type: 'string',
        enum: ['product', 'rental', 'domain', 'mixed'],
        default: 'product',
        description: 'Type of order: product only, rental only, or mixed',
      },
      name: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      phone: {
        type: 'string',
      },
      currency: {
        type: 'string',
      },

      // ========== ORDER ITEMS ==========
      // ========== ORDER ITEMS ==========
      productItems: {
        type: 'array',
        description: 'Product items',
        hideLabel: true,
        displayStyle: 'table',
        items: OrderItemSchema,
      },
      rentalItems: {
        type: 'array',
        description: 'Rental items',
        items: OrderItemSchema,
      },
      // Rental IDs for mixed orders
      rentalIds: {
        type: 'array',
        description: 'References to sf_rental records for rental items',
        items: { type: 'string' },
      },

      // ========== RENTAL TOTALS ==========
      rentalSubtotal: {
        type: 'number',
        description: 'Rental items total (before discount)',
      },
      rentalDeposit: {
        type: 'number',
        description: 'Total deposit for all rental items',
      },
      rentalDiscount: {
        type: 'number',
        description: 'Total discount applied to rentals',
      },
      rentalTax: {
        type: 'number',
        description: 'Tax on rental items',
      },
      rentalDeliveryFee: {
        type: 'number',
        description: 'Delivery/drop-off fee for rentals',
      },
      rentalFees: {
        type: 'number',
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
        description:
          'Rental total (rentalSubtotal + rentalFees - rentalDiscount + rentalTax + rentalDeliveryFee)',
      },
      rentalCount: {
        type: 'number',
        description: 'Number of rental items',
      },

      // ========== PRODUCT TOTALS ==========
      productSubtotal: {
        type: 'number',
        description: 'Product items total (before discount)',
      },
      productDiscount: {
        type: 'number',
        description: 'Total discount applied to products',
      },
      productTax: {
        type: 'number',
        description: 'Tax on product items',
      },
      productShipping: {
        type: 'number',
        description: 'Shipping cost for products',
      },
      productTotal: {
        type: 'number',
        description:
          'Product total (productSubtotal - productDiscount + productTax + productShipping)',
      },
      productCount: {
        type: 'number',
        description: 'Number of product items',
      },

      // ========== COMBINED TOTALS ==========
      subtotal: {
        type: 'number',
        description: 'Combined subtotal (rentalSubtotal + productSubtotal)',
      },
      discount: {
        type: 'number',
        description: 'Combined discount (rentalDiscount + productDiscount)',
      },
      tax: {
        type: 'number',
        description: 'Combined tax (rentalTax + productTax)',
      },
      deposit: {
        type: 'number',
        description: 'Same as rentalDeposit',
      },
      amount: {
        type: 'number',
        description: 'Grand total (rentalTotal + productTotal + deposit)',
      },
      shippingMethod: {
        type: 'string',
      },
      depositStatus: {
        type: 'string',
        enum: [
          'pending',
          'held',
          'partially_refunded',
          'refunded',
          'forfeited',
          'waived',
        ],
      },
      depositWaived: {
        type: 'boolean',
        description: 'Whether deposit was waived by discount',
      },
      freeShipping: {
        type: 'boolean',
        description: 'Whether shipping was free by discount',
      },
      freeDelivery: {
        type: 'boolean',
        description: 'Rental delivery fee waived by discount',
      },
      freeReturnPickup: {
        type: 'boolean',
        description: 'Rental return pickup fee waived by discount',
      },
      feesWaived: {
        type: 'boolean',
        description: 'All fees waived by discount',
      },

      // Discount Details
      discounts: {
        type: 'array',
        description: 'All applied discounts',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            name: { type: 'string' },
            amount: { type: 'number' },
            type: { type: 'string' },
            message: { type: 'string' },
          },
        },
      },
      discountCode: {
        type: 'string',
        description: 'Comma-separated discount codes (for display)',
      },

      // Other
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

      // Addresses
      shippingAddress: { ...AddressSchema() },
      billingAddress: { ...AddressSchema() },
      shippingInfo: {
        type: 'array',
        description: 'Shipments for this order (supports multiple shipments)',
        hideLabel: true,
        items: {
          type: 'object',
          properties: {
            shipmentId: {
              type: 'string',
              description: 'Provider shipment ID (e.g., EasyPost shp_xxx)',
            },
            carrier: {
              type: 'string',
              description: 'Carrier code (e.g., USPS, FEDEX, UPS)',
            },
            service: {
              type: 'string',
              description: 'Service name (e.g., Priority, Ground)',
            },
            tracker: {
              type: 'string',
              description: 'Tracking number',
            },
            trackingUrl: {
              type: 'string',
              description: 'Tracking URL',
            },
            rate: {
              type: 'string',
              description: 'Rate/service display name',
            },
            cost: {
              type: 'string',
              description: 'Shipping cost',
            },
            labelUrl: {
              type: 'string',
              description: 'Shipping label URL',
            },
            status: {
              type: 'string',
              enum: ['pending', 'shipped', 'in_transit', 'delivered', 'cancelled'],
              description: 'Shipment status',
            },
            shippedAt: {
              type: 'string',
              format: 'date-time',
              description: 'When shipment was created',
            },
            estimatedDelivery: {
              type: 'string',
              description: 'Estimated delivery date',
            },
            parcel: {
              type: 'object',
              description: 'Primary parcel dimensions',
              properties: {
                length: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' },
                weight: { type: 'number' },
              },
            },
            packing: {
              type: 'object',
              description: 'Bin-packing result — box breakdown for fulfillment',
              properties: {
                totalBoxes: {
                  type: 'number',
                  description: 'Total number of boxes/packages for this shipment',
                },
                boxes: {
                  type: 'array',
                  description: 'Detailed breakdown of each box',
                  items: {
                    type: 'object',
                    properties: {
                      boxIndex: { type: 'number', description: 'Box number (1-based)' },
                      boxName: { type: 'string', description: 'Box/packaging name (e.g., "USPS Medium Flat Rate Box")' },
                      dimensions: {
                        type: 'object',
                        properties: {
                          length: { type: 'number' },
                          width: { type: 'number' },
                          height: { type: 'number' },
                          dimensionUnit: { type: 'string', enum: ['in', 'cm'] },
                        },
                      },
                      weight: { type: 'number', description: 'Total weight of items in this box' },
                      weightUnit: { type: 'string', enum: ['lb', 'kg'] },
                      itemCount: { type: 'number' },
                      dimensionsEstimated: { type: 'boolean' },
                      items: {
                        type: 'array',
                        description: 'Items packed in this box',
                        items: {
                          type: 'object',
                          properties: {
                            sku: { type: 'string' },
                            name: { type: 'string' },
                            quantity: { type: 'number' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            products: {
              type: 'array',
              description: 'Products in this shipment',
              items: {
                type: 'object',
                properties: {
                  sku: { type: 'string' },
                  name: { type: 'string' },
                  quantity: { type: 'number' },
                },
              },
            },
            manual: {
              type: 'boolean',
              description: 'True if added manually (not via carrier integration)',
            },
          },
        },
      },
    },
  } as const;
};

const ms = SFOrderSchema();
export type SFOrderModel = FromSchema<typeof ms>;

registerCollection('Store Order', DataType.sf_order, SFOrderSchema());
