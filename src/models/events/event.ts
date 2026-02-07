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
        enum: ['conference', 'meetup', 'workshop', 'webinar', 'tradeshow', 'festival', 'other'],
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
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            description: {
              type: 'string',
            },
            capacity: {
              type: 'number',
            },
            requiresAccreditation: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },

      // Ticket Types Configuration
      ticketTypes: {
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
            price: {
              type: 'number',
            },
            currency: {
              type: 'string',
              default: 'USD',
            },
            capacity: {
              type: 'number',
            },
            soldCount: {
              type: 'number',
              default: 0,
            },
            color: {
              type: 'string',
              'x-control': ControlType.color,
            },
            permissions: {
              type: 'array',
              items: { type: 'string' },
            },
            saleStartDate: {
              type: 'string',
              format: 'date-time',
            },
            saleEndDate: {
              type: 'string',
              format: 'date-time',
            },
            isActive: {
              type: 'boolean',
              default: true,
            },
          },
        },
      },

      // Accreditation Types
      accreditationTypes: {
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
            color: {
              type: 'string',
              'x-control': ControlType.color,
            },
            zones: {
              type: 'array',
              items: { type: 'string' },
            },
            permissions: {
              type: 'array',
              items: { type: 'string' },
            },
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
        type: 'string',
        'x-control': ControlType.selectMany,
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
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
        collapsible: true,
      },
      shortDescription: {
        type: 'string',
        'x-control-variant': 'textarea',
        maxLength: 500,
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

      // Metadata
      tags: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },
      category: {
        type: 'string',
      },
    },
    required: ['name', 'title', 'startDate'],
  } as const;
};

const es = EventSchema();
export type EventModel = FromSchema<typeof es>;

registerCollection('Event', DataType.event, EventSchema());
