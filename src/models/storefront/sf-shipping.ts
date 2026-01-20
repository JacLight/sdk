import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';


import { DataType, ControlType } from '../../types';
import { AddressSchema } from '../crm/crm-address';

export const SFShippingSchema = () => {
  return {
    type: 'object',
    properties: {
      // Order reference
      orderNumber: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.sf_order,
          value: 'number',
          label: 'number',
        },
        group: 'order',
      },
      orderId: {
        type: 'string',
        description: 'Order ID for direct lookup',
        group: 'order',
      },

      // Carrier and service info
      courier: {
        type: 'string',
        description: 'Carrier code (e.g., FEDEX, UPS, USPS)',
        group: 'carrier',
      },
      courierName: {
        type: 'string',
        description: 'Carrier display name',
        group: 'carrier',
      },
      service: {
        type: 'string',
        description: 'Service code (e.g., GROUND, EXPRESS)',
        group: 'carrier',
      },
      serviceName: {
        type: 'string',
        description: 'Service display name (e.g., "FedEx Ground")',
        group: 'carrier',
      },

      // Tracking
      tracking: {
        type: 'string',
        description: 'Tracking number',
        group: 'tracking',
      },
      trackingUrl: {
        type: 'string',
        description: 'Direct tracking URL',
        group: 'tracking',
      },
      status: {
        type: 'string',
        enum: ['pending', 'label_created', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'exception'],
        default: 'pending',
        group: 'tracking',
      },

      // Dates
      shipDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      expectedDeliveryDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      deliveryDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      estimatedDeliveryDays: {
        type: 'number',
        description: 'Estimated business days for delivery',
        group: 'dates',
      },

      // Cost & pricing
      cost: {
        type: 'number',
        description: 'Actual carrier cost',
        group: 'cost',
      },
      customerPrice: {
        type: 'number',
        description: 'Price charged to customer (includes markup)',
        group: 'cost',
      },
      markup: {
        type: 'number',
        description: 'Markup amount applied',
        group: 'cost',
      },
      currency: {
        type: 'string',
        default: 'USD',
        group: 'cost',
      },

      // Addresses
      from: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'sk',
          label: 'name',
        },
        group: 'addresses',
      },
      fromAddress: {
        ...AddressSchema(),
        collapsible: true,
        title: 'From Address',
      },
      to: { ...AddressSchema(), collapsible: true, title: 'To Address' },

      // Products being shipped
      products: {
        type: 'array',
        hideIn: ['table'],
        collapsible: true,
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
              group: 'product',
            },
            name: {
              type: 'string',
              group: 'product',
            },
            options: {
              type: 'string',
              group: 'product',
            },
            qty: {
              type: 'number',
              group: 'product',
            },
            image: {
              type: 'string',
            },
            parcel: {
              type: 'object',
              layout: 'horizontal',
              properties: {
                weight: { type: 'number' },
                length: { type: 'number' },
                height: { type: 'number' },
                width: { type: 'number' },
              },
            },
          },
        },
      },

      // Package details
      parcels: {
        type: 'array',
        title: 'Package and weight',
        collapsible: true,
        layout: 'horizontal',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            length: { type: 'number' },
            width: { type: 'number' },
            height: { type: 'number' },
            weight: { type: 'number' },
            weightUnit: { type: 'string', enum: ['lb', 'kg', 'oz', 'g'] },
            dimensionUnit: { type: 'string', enum: ['in', 'cm'] },
          },
        },
      },

      // Label info
      labelUrl: {
        type: 'string',
        description: 'URL to shipping label',
      },
      labelFormat: {
        type: 'string',
        enum: ['PDF', 'PNG', 'ZPL', 'EPL2'],
        default: 'PDF',
      },
      shipmentId: {
        type: 'string',
        description: 'Provider shipment ID for label retrieval',
      },

      // Notifications
      notificationSent: {
        type: 'boolean',
        default: false,
        description: 'Has shipping notification been sent to customer',
        group: 'notifications',
      },
      notificationSentAt: {
        type: 'string',
        format: 'date-time',
        group: 'notifications',
      },
      customerEmail: {
        type: 'string',
        description: 'Customer email for notifications',
        group: 'notifications',
      },

      // Delivery confirmation
      proofOfDelivery: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['signature', 'photo', 'document'] },
            url: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
      signatureRequired: {
        type: 'boolean',
        default: false,
      },

      // Additional info
      remarks: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      insurance: {
        type: 'object',
        collapsible: true,
        properties: {
          insured: { type: 'boolean', default: false },
          amount: { type: 'number' },
          currency: { type: 'string', default: 'USD' },
        },
      },
    },
  } as const;
};


const ms = SFShippingSchema();
export type SFShippingModel = FromSchema<typeof ms>;

registerCollection(
  'Store Shipping',
  DataType.sf_shipping,
  SFShippingSchema(),
);
