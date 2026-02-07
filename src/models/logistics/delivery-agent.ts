import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const DeliveryAgentSchema = () => {
  return {
    type: 'object',
    properties: {
      // Type of agent
      type: {
        type: 'string',
        enum: ['human', 'drone', 'robot', 'autonomous_vehicle', 'third_party'],
        default: 'human',
        group: 'type',
      },
      status: {
        type: 'string',
        enum: ['pending', 'under_review', 'approved', 'active', 'suspended', 'inactive', 'rejected'],
        default: 'pending',
        group: 'type',
      },
      availability: {
        type: 'string',
        enum: ['offline', 'online', 'busy'],
        default: 'offline',
        group: 'type',
      },

      // Customer link (agent.sk === customer.sk, customer has name/email/phone/address)
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
        description: 'Link to customer record',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'human', action: 'hide' },
        ],
      },

      // KYC Link (for humans)
      kyc: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer_kyc,
          value: 'sk',
          label: 'customer',
        },
        description: 'Link to KYC record',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'human', action: 'hide' },
        ],
      },

      // === MACHINE FIELDS (drone, robot, autonomous) ===
      machineName: {
        type: 'string',
        description: 'Machine identifier/name',
        group: 'machine',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      serialNumber: {
        type: 'string',
        group: 'machine',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      manufacturer: {
        type: 'string',
        group: 'machine-detail',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      model: {
        type: 'string',
        group: 'machine-detail',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      firmwareVersion: {
        type: 'string',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      batteryLevel: {
        type: 'number',
        description: 'Current battery percentage',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      maxRange: {
        type: 'number',
        description: 'Maximum range in miles',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      maxPayload: {
        type: 'number',
        description: 'Maximum payload weight (lbs)',
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },
      homeBase: {
        type: 'object',
        description: 'Home location for charging/storage',
        properties: {
          lat: { type: 'number', group: 'home' },
          lng: { type: 'number', group: 'home' },
          address: { type: 'string' },
        },
        rules: [
          { operation: 'equal', valueA: '{{type}}', valueB: 'human', action: 'hide' },
          { operation: 'equal', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
      },

      // === THIRD PARTY FIELDS ===
      thirdParty: {
        type: 'object',
        title: 'Third Party Provider',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'third_party', action: 'hide' },
        ],
        properties: {
          provider: {
            type: 'string',
            group: 'provider',
          },
          accountId: {
            type: 'string',
            group: 'provider',
          },
          apiKey: {
            type: 'string',
            hidden: true,
          },
          webhookUrl: {
            type: 'string',
          },
        },
      },

      // === VEHICLES (for humans) ===
      vehicles: {
        type: 'array',
        title: 'Vehicles',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'human', action: 'hide' },
        ],
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['car', 'motorcycle', 'bicycle', 'scooter', 'van', 'truck', 'walk'],
              group: 'vehicle',
            },
            isPrimary: {
              type: 'boolean',
              default: false,
              group: 'vehicle',
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'expired'],
              default: 'pending',
              group: 'vehicle',
            },
            make: {
              type: 'string',
              group: 'detail',
            },
            model: {
              type: 'string',
              group: 'detail',
            },
            year: {
              type: 'number',
              group: 'detail',
            },
            color: {
              type: 'string',
              group: 'color',
            },
            licensePlate: {
              type: 'string',
              group: 'plate',
            },
            licensePlateState: {
              type: 'string',
              group: 'plate',
            },
            // Vehicle documents
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string',
                    enum: ['registration', 'insurance', 'inspection'],
                    group: 'doc',
                  },
                  status: {
                    type: 'string',
                    enum: ['pending', 'verified', 'rejected', 'expired'],
                    default: 'pending',
                    group: 'doc',
                  },
                  file: FileInfoSchema(),
                  expiresAt: {
                    type: 'string',
                    format: 'date',
                    'x-control': ControlType.date,
                  },
                  verifiedAt: {
                    type: 'string',
                    format: 'date-time',
                  },
                  verifiedBy: {
                    type: 'string',
                  },
                  notes: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },

      // === DOCUMENTS (for humans and machines) ===
      documents: {
        type: 'array',
        title: 'Documents',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: [
                // Human
                'drivers_license', 'insurance', 'background_check', 'profile_photo',
                // Machine
                'faa_registration', 'airworthiness_certificate', 'remote_pilot_certificate',
                'operating_permit', 'safety_certification',
                // Other
                'other',
              ],
              group: 'doc',
            },
            status: {
              type: 'string',
              enum: ['pending', 'verified', 'rejected', 'expired'],
              default: 'pending',
              group: 'doc',
            },
            file: FileInfoSchema(),
            documentNumber: {
              type: 'string',
            },
            issuingAuthority: {
              type: 'string',
            },
            issueDate: {
              type: 'string',
              format: 'date',
              'x-control': ControlType.date,
              group: 'dates',
            },
            expiresAt: {
              type: 'string',
              format: 'date',
              'x-control': ControlType.date,
              group: 'dates',
            },
            verifiedAt: {
              type: 'string',
              format: 'date-time',
            },
            verifiedBy: {
              type: 'string',
            },
            rejectionReason: {
              type: 'string',
            },
            notes: {
              type: 'string',
            },
          },
        },
      },

      // === CURRENT LOCATION ===
      currentLocation: {
        type: 'object',
        title: 'Current Location',
        properties: {
          lat: {
            type: 'number',
            group: 'coords',
          },
          lng: {
            type: 'number',
            group: 'coords',
          },
          heading: {
            type: 'number',
            description: 'Direction in degrees',
          },
          speed: {
            type: 'number',
            description: 'Speed in mph',
          },
          accuracy: {
            type: 'number',
            description: 'GPS accuracy in meters',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // === WALLET REFERENCE ===
      wallet: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.wallet,
          value: 'sk',
          label: 'ownerName',
        },
        description: 'Link to wallet record',
      },

      // === PAYOUT SETTINGS ===
      payoutSettings: {
        type: 'object',
        title: 'Payout Settings',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'human', action: 'hide' },
        ],
        properties: {
          method: {
            type: 'string',
            enum: ['bank_transfer', 'paypal', 'venmo', 'cashapp', 'check'],
            group: 'method',
          },
          frequency: {
            type: 'string',
            enum: ['instant', 'daily', 'weekly', 'biweekly'],
            default: 'weekly',
            group: 'method',
          },
          bankAccount: {
            type: 'object',
            properties: {
              bankName: { type: 'string', group: 'bank' },
              accountType: { type: 'string', enum: ['checking', 'savings'], group: 'bank' },
              routingNumber: { type: 'string', group: 'account' },
              accountNumber: { type: 'string', group: 'account' },
              accountHolderName: { type: 'string' },
            },
          },
          paypalEmail: {
            type: 'string',
            format: 'email',
          },
          venmoHandle: {
            type: 'string',
          },
          cashappHandle: {
            type: 'string',
          },
        },
      },

      // === PERFORMANCE ===
      performance: {
        type: 'object',
        title: 'Performance Metrics',
        collapsible: true,
        readOnly: true,
        properties: {
          totalJobs: {
            type: 'number',
            default: 0,
            group: 'jobs',
          },
          completedJobs: {
            type: 'number',
            default: 0,
            group: 'jobs',
          },
          cancelledJobs: {
            type: 'number',
            default: 0,
            group: 'jobs',
          },
          acceptanceRate: {
            type: 'number',
            description: 'Percentage of accepted offers',
            group: 'rates',
          },
          completionRate: {
            type: 'number',
            description: 'Percentage of completed jobs',
            group: 'rates',
          },
          averageRating: {
            type: 'number',
            group: 'rating',
          },
          totalRatings: {
            type: 'number',
            group: 'rating',
          },
          averagePickupTime: {
            type: 'number',
            description: 'Average minutes to pickup',
            group: 'time',
          },
          averageDeliveryTime: {
            type: 'number',
            description: 'Average minutes to deliver',
            group: 'time',
          },
          onTimeRate: {
            type: 'number',
            description: 'Percentage of on-time deliveries',
          },
        },
      },

      // === CAPACITY & PREFERENCES ===
      capacity: {
        type: 'object',
        title: 'Capacity & Preferences',
        collapsible: true,
        properties: {
          maxActiveJobs: {
            type: 'number',
            default: 1,
            description: 'Max simultaneous jobs',
            group: 'capacity',
          },
          maxDistance: {
            type: 'number',
            description: 'Max job distance (miles)',
            group: 'capacity',
          },
          canCarryLarge: {
            type: 'boolean',
            default: false,
            group: 'can',
          },
          canCarryFragile: {
            type: 'boolean',
            default: true,
            group: 'can',
          },
          canCarryFood: {
            type: 'boolean',
            default: true,
            group: 'can',
          },
          canCarryAlcohol: {
            type: 'boolean',
            default: false,
            group: 'can',
          },
          canCarryMedical: {
            type: 'boolean',
            default: false,
            group: 'can',
          },
          preferredZones: {
            type: 'array',
            items: { type: 'string' },
            description: 'Preferred delivery zones',
          },
        },
      },

      // === SCHEDULE ===
      schedule: {
        type: 'array',
        title: 'Weekly Schedule',
        collapsible: true,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'human', action: 'hide' },
        ],
        items: {
          type: 'object',
          properties: {
            day: {
              type: 'string',
              enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
              group: 'day',
            },
            enabled: {
              type: 'boolean',
              default: true,
              group: 'day',
            },
            startTime: {
              type: 'string',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
              group: 'time',
            },
            endTime: {
              type: 'string',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
              group: 'time',
            },
          },
        },
      },

      // === ACTIVE JOBS ===
      activeJobs: {
        type: 'array',
        title: 'Active Jobs',
        readOnly: true,
        items: {
          type: 'string',
        },
        description: 'Currently assigned job IDs',
      },

      // === DEVICE INFO ===
      device: {
        type: 'object',
        title: 'Device Info',
        collapsible: true,
        readOnly: true,
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'human', action: 'hide' },
        ],
        properties: {
          platform: {
            type: 'string',
            enum: ['ios', 'android'],
            group: 'device',
          },
          appVersion: {
            type: 'string',
            group: 'device',
          },
          deviceModel: {
            type: 'string',
          },
          pushToken: {
            type: 'string',
            hidden: true,
          },
          lastActiveAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // === APPROVAL HISTORY ===
      approvalHistory: {
        type: 'array',
        title: 'Approval History',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              group: 'approval',
            },
            action: {
              type: 'string',
              enum: ['submitted', 'approved', 'rejected', 'suspended', 'reactivated'],
              group: 'approval',
            },
            by: {
              type: 'string',
            },
            notes: {
              type: 'string',
            },
          },
        },
      },

      // === FLAGS & NOTES ===
      flags: {
        type: 'array',
        title: 'Flags & Notes',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['warning', 'incident', 'compliment', 'note'],
              group: 'flag',
            },
            date: {
              type: 'string',
              format: 'date-time',
              group: 'flag',
            },
            description: {
              type: 'string',
              'x-control-variant': 'textarea',
            },
            addedBy: {
              type: 'string',
            },
          },
        },
      },

      // === TIMESTAMPS ===
      appliedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      approvedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      approvedBy: {
        type: 'string',
        readOnly: true,
      },

      // === INTERNAL NOTES ===
      internalNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: ['type'],
  } as const;
};

const sc = DeliveryAgentSchema();
export type DeliveryAgentModel = FromSchema<typeof sc>;

registerCollection('Delivery Agent', DataType.delivery_agent, DeliveryAgentSchema());
