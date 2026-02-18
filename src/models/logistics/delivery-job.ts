import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { AddressSchema } from '../crm/crm-address';

export const DeliveryJobSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identification
      jobNumber: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        title: 'Job #',
        transform: ['random-string::10', 'uppercase'],
        group: 'id',
      },

      // Config used for this job
      config: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.delivery_config,
          value: 'name',
          label: 'title',
        },
        description: 'Pricing/delivery config used for this job',
        group: 'id',
      },

      status: {
        type: 'string',
        enum: [
          'draft',
          'pending',           // waiting for assignment
          'broadcasting',      // sent to agents
          'assigned',          // agent accepted
          'en_route_pickup',   // agent heading to pickup
          'arrived_pickup',    // agent at pickup
          'picked_up',         // items picked up
          'en_route_dropoff',  // heading to dropoff
          'arrived_dropoff',   // at dropoff
          'delivered',         // handed off
          'completed',         // all done, payment settled
          'cancelled',
          'failed',
        ],
        default: 'pending',
        group: 'id',
      },
      priority: {
        type: 'string',
        enum: ['low', 'standard', 'high', 'urgent'],
        default: 'standard',
        group: 'id',
      },

      // Customer (who ordered)
      customer: {
        type: 'object',
        title: 'Customer',
        properties: {
          customerId: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.customer,
              value: 'sk',
              label: 'email',
            },
          },
          firstName: { type: 'string', group: 'name' },
          lastName: { type: 'string', group: 'name' },
          email: { type: 'string', format: 'email', group: 'contact' },
          phone: { type: 'string', group: 'contact' },
        },
      },

      // === STOPS (pickup, dropoff, or multi-stop) ===
      stops: {
        type: 'array',
        title: 'Stops',
        minItems: 2,
        items: {
          type: 'object',
          properties: {
            sequence: {
              type: 'number',
              group: 'seq',
            },
            type: {
              type: 'string',
              enum: ['pickup', 'dropoff'],
              group: 'seq',
            },
            status: {
              type: 'string',
              enum: ['pending', 'en_route', 'arrived', 'completed', 'failed'],
              default: 'pending',
              group: 'seq',
            },
            // Location
            location: {
              type: 'object',
              properties: {
                address: AddressSchema(),
                lat: { type: 'number', group: 'coords' },
                lng: { type: 'number', group: 'coords' },
                placeId: { type: 'string', description: 'Google Place ID' },
                placeName: { type: 'string', description: 'Business/place name' },
              },
            },
            // Contact at this stop
            contact: {
              type: 'object',
              properties: {
                name: { type: 'string', group: 'contact' },
                phone: { type: 'string', group: 'contact' },
                email: { type: 'string', format: 'email' },
              },
            },
            // Time window
            timeWindow: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['asap', 'scheduled', 'window'],
                  default: 'asap',
                  group: 'time-type',
                },
                scheduledAt: {
                  type: 'string',
                  format: 'date-time',
                  'x-control': ControlType.date,
                },
                windowStart: {
                  type: 'string',
                  format: 'date-time',
                  'x-control': ControlType.date,
                  group: 'window',
                },
                windowEnd: {
                  type: 'string',
                  format: 'date-time',
                  'x-control': ControlType.date,
                  group: 'window',
                },
              },
            },
            instructions: {
              type: 'string',
              'x-control-variant': 'textarea',
              description: 'Delivery instructions, gate codes, etc.',
            },
            // Delivery type / requirements
            deliveryType: {
              type: 'string',
              enum: ['standard', 'no_contact', 'signature_required', 'photo_required', 'id_check', 'age_verification', 'pin_required'],
              default: 'standard',
              description: 'How delivery should be completed',
            },
            ageVerificationMinimum: {
              type: 'number',
              description: 'Minimum age if age_verification required',
            },
            // Items at this stop (what to pick up or drop off)
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string', group: 'item' },
                  quantity: { type: 'number', default: 1, group: 'item' },
                  weight: { type: 'number', description: 'Weight in lbs' },
                  dimensions: {
                    type: 'object',
                    properties: {
                      length: { type: 'number', group: 'dim' },
                      width: { type: 'number', group: 'dim' },
                      height: { type: 'number', group: 'dim' },
                    },
                  },
                  value: { type: 'number', description: 'Declared value' },
                  specialHandling: {
                    type: 'array',
                    'x-control': ControlType.selectMany,
                    'x-control-variant': 'chip',
                    items: { type: 'string' },
                    dataSource: {
                      source: 'json',
                      json: ['fragile', 'perishable', 'keep_upright', 'temperature_controlled', 'hazmat', 'live_animal', 'liquid', 'heavy'],
                    },
                  },
                  photo: FileInfoSchema(),
                  notes: { type: 'string' },
                },
              },
            },
            // Timestamps
            arrivedAt: {
              type: 'string',
              format: 'date-time',
            },
            completedAt: {
              type: 'string',
              format: 'date-time',
            },
            // Proof
            proof: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['signature', 'photo', 'pin', 'none'],
                  group: 'proof',
                },
                signature: FileInfoSchema(),
                photos: {
                  type: 'array',
                  items: FileInfoSchema(),
                },
                pin: { type: 'string' },
                recipientName: { type: 'string' },
                notes: { type: 'string' },
                collectedAt: {
                  type: 'string',
                  format: 'date-time',
                },
                location: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number', group: 'proof-loc' },
                    lng: { type: 'number', group: 'proof-loc' },
                  },
                },
              },
            },
          },
        },
      },

      // === REQUIREMENTS ===
      requirements: {
        type: 'object',
        title: 'Requirements',
        collapsible: true,
        properties: {
          vehicleTypes: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: { type: 'string' },
            dataSource: {
              source: 'json',
              json: ['car', 'motorcycle', 'bicycle', 'scooter', 'van', 'truck', 'drone', 'robot', 'walk', 'any'],
            },
          },
          agentTypes: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            items: { type: 'string' },
            dataSource: {
              source: 'json',
              json: ['human', 'drone', 'robot', 'autonomous_vehicle', 'any'],
            },
          },
          minRating: {
            type: 'number',
            description: 'Minimum agent rating',
          },
          certifications: {
            type: 'array',
            items: { type: 'string' },
            description: 'Required certifications (food handler, alcohol, medical, etc.)',
          },
          helpers: {
            type: 'number',
            description: 'Number of helpers needed',
            default: 0,
          },
          equipment: {
            type: 'array',
            items: { type: 'string' },
            description: 'Required equipment (dolly, straps, cooler, etc.)',
          },
        },
      },

      // === ASSIGNMENT ===
      assignment: {
        type: 'object',
        title: 'Assignment',
        properties: {
          mode: {
            type: 'string',
            enum: ['auto', 'broadcast', 'pool', 'offer', 'manual'],
            default: 'broadcast',
            group: 'mode',
          },
          agent: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.delivery_agent,
              value: 'sk',
              label: 'email',
            },
            description: 'Assigned agent',
          },
          agentName: { type: 'string' },
          agentPhone: { type: 'string' },
          agentPhoto: { type: 'string' },
          vehicleInfo: { type: 'string' },
          assignedAt: {
            type: 'string',
            format: 'date-time',
          },
          acceptedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // === OFFERS (tracking who was offered) ===
      offers: {
        type: 'array',
        title: 'Offer History',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            agent: { type: 'string', group: 'offer' },
            agentName: { type: 'string', group: 'offer' },
            offeredAt: {
              type: 'string',
              format: 'date-time',
              group: 'times',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              group: 'times',
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected', 'expired', 'cancelled'],
            },
            respondedAt: {
              type: 'string',
              format: 'date-time',
            },
            rejectReason: { type: 'string' },
          },
        },
      },

      // === TARGETING (who can see this job) ===
      targeting: {
        type: 'object',
        title: 'Targeting',
        collapsible: true,
        properties: {
          mode: {
            type: 'string',
            enum: ['all', 'zones', 'radius', 'specific'],
            default: 'radius',
            group: 'target',
          },
          zones: {
            type: 'array',
            items: { type: 'string' },
            rules: [
              { operation: 'notEqual', valueA: '{{mode}}', valueB: 'zones', action: 'hide' },
            ],
          },
          radius: {
            type: 'object',
            rules: [
              { operation: 'notEqual', valueA: '{{mode}}', valueB: 'radius', action: 'hide' },
            ],
            properties: {
              lat: { type: 'number', group: 'center' },
              lng: { type: 'number', group: 'center' },
              miles: { type: 'number', group: 'center' },
            },
          },
          specificAgents: {
            type: 'array',
            items: { type: 'string' },
            rules: [
              { operation: 'notEqual', valueA: '{{mode}}', valueB: 'specific', action: 'hide' },
            ],
          },
        },
      },

      // === SCHEDULING ===
      scheduling: {
        type: 'object',
        title: 'Scheduling',
        properties: {
          type: {
            type: 'string',
            enum: ['asap', 'scheduled'],
            default: 'asap',
            group: 'sched',
          },
          scheduledDate: {
            type: 'string',
            format: 'date-time',
            'x-control': ControlType.date,
            rules: [
              { operation: 'equal', valueA: '{{type}}', valueB: 'asap', action: 'hide' },
            ],
          },
        },
      },

      // === PRICING (what customer pays) ===
      pricing: {
        type: 'object',
        title: 'Pricing',
        collapsible: true,
        properties: {
          currency: {
            type: 'string',
            default: 'USD',
            group: 'currency',
          },
          basePrice: {
            type: 'number',
            description: 'Base calculated price',
            group: 'base',
          },
          adjustments: {
            type: 'number',
            description: 'Sum of all adjustments',
            default: 0,
            group: 'base',
          },
          surgeFee: {
            type: 'number',
            group: 'surge',
          },
          surgeMultiplier: {
            type: 'number',
            default: 1,
            group: 'surge',
          },
          tip: {
            type: 'number',
            default: 0,
          },
          total: {
            type: 'number',
            description: 'Final total (basePrice + adjustments + tip)',
            group: 'total',
          },
        },
      },

      // === DRIVER PAY (what driver gets) ===
      driverPay: {
        type: 'object',
        title: 'Driver Pay',
        collapsible: true,
        properties: {
          basePay: {
            type: 'number',
            description: 'Base calculated pay',
            group: 'pay',
          },
          adjustments: {
            type: 'number',
            description: 'Sum of driver adjustments (bonus, penalty, etc)',
            default: 0,
            group: 'pay',
          },
          tip: {
            type: 'number',
            default: 0,
          },
          total: {
            type: 'number',
            description: 'Total driver earns (basePay + adjustments)',
          },
        },
      },

      // === ADJUSTMENTS (line items added to job) ===
      adjustments: {
        type: 'array',
        title: 'Adjustments',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            category: {
              type: 'string',
              enum: [
                'cleaning_fee',
                'toll_fee',
                'parking_fee',
                'waiting_fee',
                'damage_charge',
                'cancellation_fee',
                'bonus',
                'rebate',
                'discount',
                'refund',
                'penalty',
                'other',
              ],
            },
            type: {
              type: 'string',
              enum: ['debit', 'credit'],
            },
            amount: { type: 'number', description: 'Amount customer pays' },
            driverPortion: {
              type: 'number',
              default: 0,
              description: 'Portion of this adjustment that goes to driver (0 = platform keeps all)',
            },
            description: { type: 'string' },
            addedAt: { type: 'string', format: 'date-time' },
            addedBy: { type: 'string' },
            notes: { type: 'string' },
            processed: {
              type: 'boolean',
              default: false,
              description: 'Whether this adjustment has been applied to driver wallet',
            },
            processedAt: { type: 'string', format: 'date-time' },
          },
        },
      },

      // === IMAGES ===
      images: {
        type: 'array',
        title: 'Images',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            ...FileInfoSchema().properties,
            category: {
              type: 'string',
              enum: ['customer', 'pickup', 'dropoff', 'proof', 'issue', 'damage', 'other'],
              description: 'Image category',
            },
            addedAt: { type: 'string', format: 'date-time' },
            addedBy: { type: 'string' },
          },
        },
      },

      // === EARNINGS (final calculation after job complete) ===
      earnings: {
        type: 'object',
        title: 'Earnings',
        collapsible: true,
        readOnly: true,
        properties: {
          driverTotal: {
            type: 'number',
            description: 'Total paid to driver',
            group: 'driver',
          },
          driverTip: {
            type: 'number',
            group: 'driver',
          },
          driverBonus: {
            type: 'number',
            group: 'driver',
          },
          platformFee: {
            type: 'number',
            description: 'Platform earnings',
            group: 'platform',
          },
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'available', 'paid'],
            default: 'pending',
            group: 'platform',
          },
          availableAt: {
            type: 'string',
            format: 'date-time',
            description: 'When earnings become available',
          },
          paidAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // === PAYMENT (customer payment) ===
      payment: {
        type: 'object',
        title: 'Payment',
        collapsible: true,
        properties: {
          method: {
            type: 'string',
            enum: ['card', 'cash', 'invoice', 'prepaid', 'merchant_account'],
            default: 'card',
            group: 'method',
          },
          status: {
            type: 'string',
            enum: ['pending', 'authorized', 'captured', 'failed', 'refunded', 'invoiced', 'account_charged'],
            default: 'pending',
            group: 'method',
          },
          transactionId: { type: 'string' },
          paidAt: {
            type: 'string',
            format: 'date-time',
          },
          refundAmount: { type: 'number' },
          refundReason: { type: 'string' },
        },
      },

      // === MERCHANT ACCOUNT BILLING (for business customers) ===
      merchantBilling: {
        type: 'object',
        title: 'Merchant Account Billing',
        description: 'For business customers with invoiced accounts',
        collapsible: true,
        properties: {
          merchantAccount: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'collection',
              collection: DataType.merchant_customer,
              value: 'sk',
              label: 'companyName',
            },
            description: 'Linked merchant account',
          },
          chargedToAccount: {
            type: 'boolean',
            default: false,
            description: 'Whether this job was charged to merchant account',
          },
          chargedAt: {
            type: 'string',
            format: 'date-time',
          },
          invoiceId: {
            type: 'string',
            description: 'Invoice this job was included in',
          },
          invoicedAt: {
            type: 'string',
            format: 'date-time',
          },
          poNumber: {
            type: 'string',
            description: 'Purchase order number from merchant',
          },
          costCenter: {
            type: 'string',
            description: 'Cost center / department code',
          },
          projectCode: {
            type: 'string',
            description: 'Project code for billing',
          },
        },
      },

      // === TRACKING / ROUTE ===
      tracking: {
        type: 'object',
        title: 'Live Tracking',
        collapsible: true,
        properties: {
          estimatedPickup: {
            type: 'string',
            format: 'date-time',
          },
          estimatedDelivery: {
            type: 'string',
            format: 'date-time',
          },
          distance: {
            type: 'number',
            description: 'Total distance in miles',
          },
          duration: {
            type: 'number',
            description: 'Estimated duration in minutes',
          },
          liveLocation: {
            type: 'object',
            properties: {
              lat: { type: 'number', group: 'live' },
              lng: { type: 'number', group: 'live' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          route: {
            type: 'object',
            hidden: true,
            description: 'Encoded route polyline',
          },
        },
      },

      // === TIMELINE ===
      timeline: {
        type: 'array',
        title: 'Timeline',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              group: 'event',
            },
            event: {
              type: 'string',
              group: 'event',
            },
            description: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', group: 'loc' },
                lng: { type: 'number', group: 'loc' },
              },
            },
            actor: { type: 'string' },
          },
        },
      },

      // === CANCELLATION ===
      cancellation: {
        type: 'object',
        title: 'Cancellation',
        collapsible: true,
        properties: {
          cancelledAt: {
            type: 'string',
            format: 'date-time',
          },
          cancelledBy: {
            type: 'string',
            enum: ['customer', 'agent', 'admin', 'system'],
          },
          reason: {
            type: 'string',
            enum: [
              'customer_requested',
              'agent_unavailable',
              'no_agents_available',
              'pickup_closed',
              'item_unavailable',
              'wrong_address',
              'customer_unreachable',
              'safety_concern',
              'weather',
              'other',
            ],
          },
          notes: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          fee: {
            type: 'number',
            description: 'Cancellation fee charged',
          },
        },
      },

      // === FAILURE ===
      failure: {
        type: 'object',
        title: 'Failure Details',
        collapsible: true,
        properties: {
          failedAt: {
            type: 'string',
            format: 'date-time',
          },
          reason: {
            type: 'string',
            enum: [
              'recipient_unavailable',
              'wrong_address',
              'refused',
              'damaged',
              'access_denied',
              'business_closed',
              'weather',
              'vehicle_issue',
              'other',
            ],
          },
          notes: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          photo: FileInfoSchema(),
          resolution: {
            type: 'string',
            enum: ['retry', 'return_to_sender', 'hold_for_pickup', 'dispose', 'pending'],
          },
        },
      },

      // === BATCH ===
      batchId: {
        type: 'string',
        description: 'Batch ID for grouped jobs',
      },

      // === ZONE ===
      zone: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.delivery_zone,
          value: 'name',
          label: 'title',
        },
        description: 'Delivery zone',
      },

      // === DISTANCE ===
      distance: {
        type: 'number',
        description: 'Total distance in miles (calculated from stops)',
        readOnly: true,
      },

      // === SOURCE ===
      source: {
        type: 'object',
        title: 'Source',
        description: 'Where this job originated',
        properties: {
          type: {
            type: 'string',
            enum: ['api', 'admin', 'app', 'integration', 'order', 'recurring'],
            group: 'source',
          },
          reference: {
            type: 'string',
            description: 'Order ID, integration ID, etc.',
            group: 'source',
          },
        },
      },

      // === ISSUES (driver reported problems) ===
      issues: {
        type: 'array',
        title: 'Reported Issues',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            reportedAt: {
              type: 'string',
              format: 'date-time',
              group: 'time',
            },
            reportedBy: {
              type: 'string',
              enum: ['driver', 'customer', 'recipient', 'admin'],
              group: 'time',
            },
            type: {
              type: 'string',
              enum: [
                'cant_find_location',
                'cant_contact_recipient',
                'cant_contact_sender',
                'access_issue',
                'safety_concern',
                'item_damaged',
                'item_missing',
                'wrong_item',
                'vehicle_issue',
                'traffic_delay',
                'weather_issue',
                'customer_not_available',
                'business_closed',
                'other',
              ],
              group: 'issue',
            },
            description: {
              type: 'string',
              'x-control-variant': 'textarea',
            },
            photos: {
              type: 'array',
              items: FileInfoSchema(),
            },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', group: 'loc' },
                lng: { type: 'number', group: 'loc' },
              },
            },
            status: {
              type: 'string',
              enum: ['open', 'acknowledged', 'resolved', 'escalated'],
              default: 'open',
            },
            resolution: { type: 'string' },
            resolvedAt: {
              type: 'string',
              format: 'date-time',
            },
            resolvedBy: { type: 'string' },
          },
        },
      },

      // === MESSAGES (in-job communication) ===
      messages: {
        type: 'array',
        title: 'Messages',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            timestamp: {
              type: 'string',
              format: 'date-time',
              group: 'msg',
            },
            sender: {
              type: 'string',
              enum: ['driver', 'customer', 'recipient', 'support', 'system'],
              group: 'msg',
            },
            senderName: { type: 'string' },
            content: { type: 'string' },
            type: {
              type: 'string',
              enum: ['text', 'image', 'location', 'eta_update', 'status_update'],
              default: 'text',
            },
            attachment: FileInfoSchema(),
            read: { type: 'boolean', default: false },
            readAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },

      // === NOTES ===
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
      customerNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Customer Notes',
      },
    },
    required: ['jobNumber'],
  } as const;
};

const sc = DeliveryJobSchema();
export type DeliveryJobModel = FromSchema<typeof sc>;

registerCollection('Delivery Job', DataType.delivery_job, DeliveryJobSchema());
