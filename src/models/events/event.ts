import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const EventSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        group: 'name-slug',
        transform: 'uri',
      },
      title: {
        type: 'string',
      },
      slug: {
        type: 'string',
        pattern: '^[a-z0-9-]+$',
        unique: true,
        group: 'name-slug',
      },
      type: {
        type: 'string',
        enum: [
          'conference',
          'summit',
          'meetup',
          'workshop',
          'webinar',
          'tradeshow',
          'festival',
          'concert',
          'sports',
          'club',
          'gala',
          'exhibition',
          'other',
        ],
        default: 'conference',
        group: 'type-status',
      },
      status: {
        type: 'string',
        enum: ['draft', 'published', 'live', 'completed', 'cancelled'],
        default: 'draft',
        group: 'type-status',
      },

      // Date configuration
      startDate: {
        type: 'string',
        format: 'date',
        group: 'dates',
      },
      endDate: {
        type: 'string',
        format: 'date',
        group: 'dates',
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        group: 'times',
      },
      endTime: {
        type: 'string',
        format: 'date-time',
        group: 'times',
      },
      timezone: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'function',
          value: 'timezones',
        },
        default: 'America/New_York',
      },

      // Days (auto-generated or manual)
      days: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date',
            },
            label: {
              type: 'string',
            },
            startTime: {
              type: 'string',
              format: 'time',
            },
            endTime: {
              type: 'string',
              format: 'time',
            },
          },
        },
      },

      // Tracks/Stages
      tracks: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            color: {
              type: 'string',
              'x-control': ControlType.color,
            },
            location: {
              type: 'string',
            },
          },
        },
      },

      // Venue & Zones
      venue: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
      address: {
        type: 'object',
        properties: {
          street1: { type: 'string' },
          street2: { type: 'string' },
          city: { type: 'string' },
          region: { type: 'string' },
          postalCode: { type: 'string' },
          country: { type: 'string' },
        },
      },
      zones: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            capacity: { type: 'number' },
          },
        },
      },

      // Scan Points (gates, doors, food stations, lounges)
      scanPoints: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', title: 'Scan Point Name' },
            description: { type: 'string' },
            zone: { type: 'string', title: 'Zone' },
            acceptedTicketTypes: {
              type: 'array',
              title: 'Accepted Ticket Types',
              description: 'event_ticket_type SKs. Empty = accept all.',
              items: { type: 'string' },
            },
            acceptedPerkIds: {
              type: 'array',
              title: 'Accepted Perk IDs',
              description:
                'Perk IDs from ticket type definitions. Empty = main ticket only.',
              items: { type: 'string' },
            },
            autoClaimPerk: {
              type: 'boolean',
              default: false,
              title: 'Auto-claim perk on scan',
            },
            scanType: {
              type: 'string',
              enum: ['entrance', 'eligibility'],
              default: 'entrance',
              title: 'Scan Type',
              description: 'entrance = gate in/out (one-time), eligibility = perk/zone check (unlimited)',
            },
            matchField: {
              type: 'string',
              enum: ['ticket_code', 'ticket_type', 'credential_code'],
              default: 'ticket_code',
              title: 'Match Scanned Code Against',
              description: 'ticket_code = match against ticket name (static, printed on wristbands/badges), ticket_type = match against ticket type, credential_code = match against linked credential record',
            },
            assignedStaff: {
              type: 'array',
              title: 'Assigned Staff',
              items: { type: 'string' },
            },
            isActive: { type: 'boolean', default: true },
          },
        },
      },

      // Accreditation Points (registration desks / badge pickup counters)
      accreditationPoints: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', title: 'Name' },
            description: { type: 'string' },
            zone: { type: 'string', title: 'Zone' },
            acceptedTicketTypes: {
              type: 'array',
              title: 'Ticket Types Handled',
              description: 'event_ticket_type SKs. Empty = all.',
              items: { type: 'string' },
            },
            allowWalkIn: {
              type: 'boolean',
              default: false,
              title: 'Allow Walk-in Purchase',
            },
            allowOnlinePickup: {
              type: 'boolean',
              default: true,
              title: 'Allow Online Pickup',
            },
            assignedStaff: {
              type: 'array',
              title: 'Assigned Staff',
              items: { type: 'string' },
            },
            isActive: { type: 'boolean', default: true },
          },
        },
      },

      // Settings
      settings: {
        type: 'object',
        collapsible: true,
        properties: {
          networkingEnabled: {
            type: 'boolean',
            default: true,
          },
          leadsEnabled: {
            type: 'boolean',
            default: true,
          },
          checkInRequired: {
            type: 'boolean',
            default: true,
          },
          qrRotationEnabled: {
            type: 'boolean',
            default: true,
          },
          qrRotationInterval: {
            type: 'number',
            default: 30,
            description: 'QR code rotation interval in seconds',
          },
          allowWalkIns: {
            type: 'boolean',
            default: false,
          },
          requireApproval: {
            type: 'boolean',
            default: false,
          },
          maxAttendeesPerSession: {
            type: 'number',
          },
        },
      },

      // Host & Organizers
      host: {
        type: 'array',
        'x-control': ControlType.selectMany,
        items: { type: 'string' },
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      organizers: {
        type: 'array',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'firstName', 'lastName'],
        },
        items: { type: 'string' },
      },

      // Content
      shortDescription: {
        type: 'string',
        'x-control': ControlType.richtext,
        collapsible: true,
      },
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
        collapsible: true,
      },
      coverImage: FileInfoSchema(),
      logo: FileInfoSchema(),
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        collapsible: true,
      },

      // External links
      website: {
        type: 'string',
        format: 'uri',
      },
      registrationUrl: {
        type: 'string',
        format: 'uri',
      },

      // Stats (computed)
      stats: {
        type: 'object',
        readOnly: true,
        properties: {
          totalTicketsSold: { type: 'number', default: 0 },
          totalRevenue: { type: 'number', default: 0 },
          totalAttendees: { type: 'number', default: 0 },
          totalSessions: { type: 'number', default: 0 },
          totalParticipants: { type: 'number', default: 0 },
        },
      },
    },
    required: ['name', 'title', 'startDate'],
  } as const;
};

const es = EventSchema();
export type EventModel = FromSchema<typeof es>;

registerCollection('Event', DataType.event, EventSchema());
