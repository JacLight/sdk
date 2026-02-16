import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const BenefitSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        unique: true,
        description: 'Benefit name',
        group: 'general',
      },
      title: {
        type: 'string',
        description: 'Display title',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        default: 'active',
        group: 'general',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      information: {
        type: 'string',
        'x-control': ControlType.richtext,
      },
      legalAgreement: {
        type: 'string',
        description:
          'Legal agreement text customer must accept during enrollment',
        'x-control': ControlType.richtext,
        group: 'enrollment',
      },
      applicationForm: {
        type: 'string',
        description: 'Application form collection for enrollment',
        'x-control': ControlType.selectMany,
        group: 'enrollment',
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
      },
      requiresApproval: {
        type: 'boolean',
        default: true,
        description: 'Enrollment requires admin approval',
        group: 'enrollment',
      },
      customerGroups: {
        type: 'array',
        description: 'Customer groups that automatically receive this benefit',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.customer_group,
          value: 'name',
          label: 'name',
        },
        items: { type: 'string' },
        group: 'targeting',
      },
      perks: {
        type: 'object',
        collapsible: true,
        description: 'Benefits/perks included',
        properties: {
          discount: {
            type: 'number',
            minimum: 0,
            description: 'Discount amount',
            group: 'discount',
          },
          discountType: {
            type: 'string',
            enum: ['percentage', 'fixed'],
            default: 'percentage',
            description: 'Type of discount',
            group: 'discount',
          },
          earlyAccess: {
            type: 'boolean',
            default: false,
            description: 'Early access to new products',
            group: 'perks',
          },
          prioritySupport: {
            type: 'boolean',
            default: false,
            description: 'Priority customer support',
            group: 'perks',
          },
          freeShipping: {
            type: 'boolean',
            default: false,
            description: 'Free shipping on all orders',
            group: 'perks',
          },
          freeShippingMinimum: {
            type: 'number',
            description: 'Free shipping on orders over this amount',
            group: 'shipping',
          },
          shippingDiscount: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: '% off shipping costs',
            group: 'shipping',
          },
          exclusiveProducts: {
            type: 'array',
            description: 'Access to exclusive products',
            'x-control': ControlType.lookup,
            dataSource: {
              source: 'collection',
              collection: DataType.sf_product,
              value: 'sku',
              label: ['name', 'sku'],
            },
            items: { type: 'string' },
          },
        },
      },
      color: {
        type: 'string',
        'x-control': ControlType.color,
        description: 'Badge color',
        group: 'display',
      },
      icon: {
        type: 'string',
        description: 'Icon name or URL',
        'x-control': ControlType.icon,
        group: 'display',
      },
      showBadge: {
        type: 'boolean',
        default: true,
        description: 'Show benefit badge to customer',
        group: 'display',
      },
      badgeText: {
        type: 'string',
        description: 'Custom badge text',
      },
      notifications: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            trigger: {
              type: 'string',
              enum: [
                'enrollment_submitted',
                'enrollment_approved',
                'enrollment_rejected',
                'benefit_expiring',
                'benefit_expired',
              ],
              'x-control': ControlType.selectMany,
              description: 'When to send notification',
            },
            deliveryType: {
              type: 'string',
              enum: ['email', 'sms'],
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
            },
            template: {
              type: 'string',
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'name',
                label: 'name',
              },
            },
            subject: {
              type: 'string',
              description: 'Email subject line',
            },
            html: {
              type: 'string',
              hideIn: ['form', 'table'],
              'x-control': ControlType.richtext,
              personalize: true,
            },
            text: {
              type: 'string',
              hideIn: ['form', 'table'],
              'x-control-variant': 'textarea',
              personalize: true,
            },
          },
        },
      },
      validityPeriod: {
        type: 'object',
        collapsible: true,
        description: 'Benefit validity settings',
        properties: {
          duration: {
            type: 'number',
            description: 'Duration value',
          },
          unit: {
            type: 'string',
            enum: ['days', 'months', 'years', 'unlimited'],
            default: 'unlimited',
            description: 'Duration unit',
          },
          renewable: {
            type: 'boolean',
            default: true,
            description: 'Can be renewed',
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const schema = BenefitSchema();
export type BenefitModel = FromSchema<typeof schema>;

registerCollection('Benefit', DataType.benefit, BenefitSchema());
