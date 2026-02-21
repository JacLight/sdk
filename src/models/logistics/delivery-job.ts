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
          firstName: { type: 'string', group: 'customer-name' },
          lastName: { type: 'string', group: 'customer-name' },
          email: { type: 'string', format: 'email', group: 'customer-contact' },
          phone: { type: 'string', group: 'customer-contact' },
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
              group: 'stop-header',
            },
            type: {
              type: 'string',
              enum: ['pickup', 'dropoff'],
              group: 'stop-header',
            },
            status: {
              type: 'string',
              enum: ['pending', 'en_route', 'arrived', 'completed', 'failed'],
              default: 'pending',
              group: 'stop-header',
            },
            // Location
            location: {
              type: 'object',
              properties: {
                address: AddressSchema(),
                lat: { type: 'number', group: 'location-coords' },
                lng: { type: 'number', group: 'location-coords' },
                placeId: { type: 'string', group: 'location-place' },
                placeName: { type: 'string', group: 'location-place' },
              },
            },
            // Contact at this stop
            contact: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                phone: { type: 'string', group: 'stop-contact' },
                email: { type: 'string', format: 'email', group: 'stop-contact' },
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
                  group: 'time-window-range',
                },
                windowEnd: {
                  type: 'string',
                  format: 'date-time',
                  'x-control': ControlType.date,
                  group: 'time-window-range',
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
                  description: { type: 'string' },
                  quantity: { type: 'number', default: 1, group: 'item-qty-weight' },
                  weight: { type: 'number', description: 'Weight in lbs', group: 'item-qty-weight' },
                  dimensions: {
                    type: 'object',
                    properties: {
                      length: { type: 'number', group: 'item-dimensions' },
                      width: { type: 'number', group: 'item-dimensions' },
                      height: { type: 'number', group: 'item-dimensions' },
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
                },
                signature: FileInfoSchema(),
                photos: {
                  type: 'array',
                  items: FileInfoSchema(),
                },
                pin: { type: 'string', group: 'proof-details' },
                recipientName: { type: 'string', group: 'proof-details' },
                notes: { type: 'string' },
                collectedAt: {
                  type: 'string',
                  format: 'date-time',
                },
                location: {
                  type: 'object',
                  properties: {
                    lat: { type: 'number', group: 'proof-location' },
                    lng: { type: 'number', group: 'proof-location' },
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
          agentName: { type: 'string', group: 'agent-info' },
          agentPhone: { type: 'string', group: 'agent-info' },
          agentPhoto: { type: 'string' },
          vehicleInfo: { type: 'string' },
          assignedAt: {
            type: 'string',
            format: 'date-time',
            group: 'assignment-times',
          },
          acceptedAt: {
            type: 'string',
            format: 'date-time',
            group: 'assignment-times',
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
            agent: { type: 'string', group: 'offer-agent' },
            agentName: { type: 'string', group: 'offer-agent' },
            offeredAt: {
              type: 'string',
              format: 'date-time',
              group: 'offer-times',
            },
            expiresAt: {
              type: 'string',
              format: 'date-time',
              group: 'offer-times',
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'rejected', 'expired', 'cancelled'],
              group: 'offer-status',
            },
            respondedAt: {
              type: 'string',
              format: 'date-time',
              group: 'offer-status',
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
              lat: { type: 'number', group: 'radius-coords' },
              lng: { type: 'number', group: 'radius-coords' },
              miles: { type: 'number' },
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
          },
          basePrice: {
            type: 'number',
            description: 'Base calculated price',
            group: 'pricing-base',
          },
          adjustments: {
            type: 'number',
            description: 'Sum of all adjustments',
            default: 0,
            group: 'pricing-base',
          },
          distanceFee: {
            type: 'number',
            description: 'Fee component based on distance',
            group: 'pricing-fees',
          },
          timeFee: {
            type: 'number',
            description: 'Fee component based on time',
            group: 'pricing-fees',
          },
          tip: {
            type: 'number',
            default: 0,
            group: 'pricing-total',
          },
          total: {
            type: 'number',
            description: 'Final total (basePrice + adjustments + tip)',
            group: 'pricing-total',
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
            group: 'driver-pay-base',
          },
          adjustments: {
            type: 'number',
            description: 'Sum of driver adjustments (bonus, penalty, etc)',
            default: 0,
            group: 'driver-pay-base',
          },
          distancePay: {
            type: 'number',
            description: 'Pay component based on distance',
            group: 'driver-pay-components',
          },
          timePay: {
            type: 'number',
            description: 'Pay component based on time',
            group: 'driver-pay-components',
          },
          tip: {
            type: 'number',
            default: 0,
            group: 'driver-pay-total',
          },
          total: {
            type: 'number',
            description: 'Total driver earns (basePay + adjustments)',
            group: 'driver-pay-total',
          },
        },
      },

      // === PRICE RECONCILIATION (Uber/Lyft style post-ride adjustment) ===
      priceReconciliation: {
        type: 'object',
        title: 'Price Reconciliation',
        description: 'Post-ride price adjustment based on actual vs estimated',
        collapsible: true,
        properties: {
          status: {
            type: 'string',
            enum: ['pending', 'reviewed', 'adjusted', 'finalized'],
            default: 'pending',
          },
          estimatedPrice: {
            type: 'number',
            description: 'Original quoted price',
            group: 'recon-estimated',
          },
          estimatedDistance: {
            type: 'number',
            description: 'Original estimated distance (miles)',
            group: 'recon-estimated',
          },
          estimatedDuration: {
            type: 'number',
            description: 'Original estimated duration (minutes)',
            group: 'recon-estimated',
          },
          actualPrice: {
            type: 'number',
            description: 'Price based on actual route',
            group: 'recon-actual',
          },
          actualDistance: {
            type: 'number',
            description: 'Actual distance traveled (miles)',
            group: 'recon-actual',
          },
          actualDuration: {
            type: 'number',
            description: 'Actual duration (minutes)',
            group: 'recon-actual',
          },
          adjustment: {
            type: 'number',
            description: 'Price difference (actual - estimated)',
            group: 'recon-adjustment',
          },
          adjustmentReason: {
            type: 'string',
            enum: ['route_change', 'traffic', 'detour', 'customer_request', 'error_correction', 'other'],
            group: 'recon-adjustment',
          },
          adjustmentNotes: {
            type: 'string',
          },
          finalPrice: {
            type: 'number',
            description: 'Final price after any manual adjustments',
          },
          reviewedBy: { type: 'string', group: 'recon-review' },
          reviewedAt: { type: 'string', format: 'date-time', group: 'recon-review' },
          customerNotified: { type: 'boolean', default: false, group: 'recon-notify' },
          driverNotified: { type: 'boolean', default: false, group: 'recon-notify' },
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
                'route_adjustment',
                'time_adjustment',
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
            group: 'earnings-driver',
          },
          driverTip: {
            type: 'number',
            group: 'earnings-driver',
          },
          driverBonus: {
            type: 'number',
            group: 'earnings-driver',
          },
          platformFee: {
            type: 'number',
            description: 'Platform earnings',
            group: 'earnings-platform',
          },
          status: {
            type: 'string',
            enum: ['pending', 'processing', 'available', 'paid'],
            default: 'pending',
            group: 'earnings-platform',
          },
          availableAt: {
            type: 'string',
            format: 'date-time',
            description: 'When earnings become available',
            group: 'earnings-times',
          },
          paidAt: {
            type: 'string',
            format: 'date-time',
            group: 'earnings-times',
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
            enum: ['stripe', 'paypal', 'card', 'cash', 'invoice', 'prepaid', 'merchant_account'],
            default: 'stripe',
            group: 'payment-method',
          },
          status: {
            type: 'string',
            enum: [
              'pending',           // Awaiting payment
              'processing',        // Payment being processed
              'requires_action',   // Needs customer action (3DS, etc)
              'authorized',        // Pre-authorized but not captured
              'paid',              // Payment completed (same as captured)
              'captured',          // Payment captured
              'failed',            // Payment failed
              'cancelled',         // Payment cancelled
              'expired',           // Payment intent expired
              'refunded',          // Fully refunded
              'partially_refunded', // Partial refund
              'disputed',          // Chargeback/dispute
              'invoiced',          // Billed to merchant account (pending payment)
              'account_charged',   // Charged to merchant account balance
            ],
            default: 'pending',
            group: 'payment-method',
          },
          amount: {
            type: 'number',
            description: 'Payment amount',
            group: 'payment-transaction',
          },
          currency: {
            type: 'string',
            default: 'USD',
            group: 'payment-transaction',
          },
          transactionId: { type: 'string', group: 'payment-transaction' },
          transactionNumber: { type: 'string', group: 'payment-transaction' },
          paymentRef: {
            type: 'string',
            description: 'Reference to sf_transaction record',
            group: 'payment-transaction',
          },
          paidAt: {
            type: 'string',
            format: 'date-time',
            group: 'payment-transaction',
          },
          // Refund tracking
          refund: {
            type: 'object',
            properties: {
              amount: { type: 'number' },
              reason: { type: 'string' },
              refundId: { type: 'string' },
              processedAt: { type: 'string', format: 'date-time' },
            },
          },
          // Legacy fields for backwards compatibility
          refundAmount: { type: 'number', group: 'payment-refund' },
          refundReason: { type: 'string', group: 'payment-refund' },
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
            group: 'tracking-eta',
          },
          estimatedDelivery: {
            type: 'string',
            format: 'date-time',
            group: 'tracking-eta',
          },
          // Estimated (from routing API before ride)
          distance: {
            type: 'number',
            description: 'Estimated route distance in miles (from maps API)',
            group: 'tracking-estimated',
          },
          duration: {
            type: 'number',
            description: 'Estimated duration in minutes (from maps API)',
            group: 'tracking-estimated',
          },
          // Actual (recorded during/after ride)
          actualDistance: {
            type: 'number',
            description: 'Actual distance traveled in miles (GPS tracked)',
            group: 'tracking-actual',
          },
          actualDuration: {
            type: 'number',
            description: 'Actual duration in minutes',
            group: 'tracking-actual',
          },
          startedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When ride/delivery actually started',
            group: 'tracking-times',
          },
          completedAt: {
            type: 'string',
            format: 'date-time',
            description: 'When ride/delivery completed',
            group: 'tracking-times',
          },
          // Route info
          routeSource: {
            type: 'string',
            enum: ['google', 'osrm', 'mapbox', 'manual'],
            description: 'Which routing service was used',
          },
          liveLocation: {
            type: 'object',
            properties: {
              lat: { type: 'number', group: 'live-coords' },
              lng: { type: 'number', group: 'live-coords' },
              updatedAt: { type: 'string', format: 'date-time' },
            },
          },
          route: {
            type: 'object',
            hidden: true,
            description: 'Encoded route polyline',
          },
          // GPS track points for actual route
          trackPoints: {
            type: 'array',
            hidden: true,
            description: 'GPS points recorded during delivery',
            items: {
              type: 'object',
              properties: {
                lat: { type: 'number', group: 'track-point' },
                lng: { type: 'number', group: 'track-point' },
                timestamp: { type: 'string', format: 'date-time' },
                speed: { type: 'number', description: 'Speed in mph' },
              },
            },
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
              group: 'timeline-event',
            },
            event: {
              type: 'string',
              group: 'timeline-event',
            },
            description: { type: 'string' },
            location: {
              type: 'object',
              properties: {
                lat: { type: 'number', group: 'timeline-loc' },
                lng: { type: 'number', group: 'timeline-loc' },
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
            group: 'source-info',
          },
          reference: {
            type: 'string',
            description: 'Order ID, integration ID, etc.',
            group: 'source-info',
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
              group: 'issue-reported',
            },
            reportedBy: {
              type: 'string',
              enum: ['driver', 'customer', 'recipient', 'admin'],
              group: 'issue-reported',
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
              group: 'issue-type',
            },
            status: {
              type: 'string',
              enum: ['open', 'acknowledged', 'resolved', 'escalated'],
              default: 'open',
              group: 'issue-type',
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
                lat: { type: 'number', group: 'issue-loc' },
                lng: { type: 'number', group: 'issue-loc' },
              },
            },
            resolution: { type: 'string' },
            resolvedAt: {
              type: 'string',
              format: 'date-time',
              group: 'issue-resolved',
            },
            resolvedBy: { type: 'string', group: 'issue-resolved' },
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
              group: 'msg-header',
            },
            sender: {
              type: 'string',
              enum: ['driver', 'customer', 'recipient', 'support', 'system'],
              group: 'msg-header',
            },
            senderName: { type: 'string', group: 'msg-header' },
            type: {
              type: 'string',
              enum: ['text', 'image', 'location', 'eta_update', 'status_update'],
              default: 'text',
            },
            content: { type: 'string' },
            attachment: FileInfoSchema(),
            read: { type: 'boolean', default: false, group: 'msg-read' },
            readAt: {
              type: 'string',
              format: 'date-time',
              group: 'msg-read',
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
