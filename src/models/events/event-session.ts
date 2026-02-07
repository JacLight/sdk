import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const EventSessionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['random-string::10', 'uri'],
        group: 'name-event',
      },
      event: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'sk',
          label: 'title',
        },
        group: 'name-event',
      },
      title: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['talk', 'panel', 'workshop', 'keynote', 'networking', 'break', 'meetup', 'other'],
        default: 'talk',
        group: 'type-status',
      },
      status: {
        type: 'string',
        enum: ['draft', 'scheduled', 'live', 'completed', 'cancelled'],
        default: 'draft',
        group: 'type-status',
      },

      // Schedule
      day: {
        type: 'string',
        format: 'date',
        group: 'day-duration',
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
      duration: {
        type: 'number',
        description: 'Duration in minutes',
        group: 'day-duration',
      },

      // Location
      track: {
        type: 'string',
        group: 'track',
      },
      trackName: {
        type: 'string',
        readOnly: true,
        group: 'track',
      },
      zone: {
        type: 'string',
        group: 'zone-room',
      },
      room: {
        type: 'string',
        group: 'zone-room',
      },

      // Participants (speakers, panelists, etc.)
      participants: {
        type: 'array',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event_participant,
          value: 'sk',
          label: 'name',
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
        maxLength: 300,
      },
      coverImage: FileInfoSchema(),
      tags: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },

      // Capacity
      capacity: {
        type: 'number',
        group: 'capacity-registered',
      },
      registeredCount: {
        type: 'number',
        default: 0,
        readOnly: true,
        group: 'capacity-registered',
      },
      attendedCount: {
        type: 'number',
        default: 0,
        readOnly: true,
        group: 'attended-waitlist',
      },
      waitlistCount: {
        type: 'number',
        default: 0,
        readOnly: true,
        group: 'attended-waitlist',
      },

      // Access control
      requiredAccreditation: {
        type: 'array',
        items: { type: 'string' },
      },
      requiredTicketTypes: {
        type: 'array',
        items: { type: 'string' },
      },
      isPublic: {
        type: 'boolean',
        default: true,
      },

      // Streaming/Recording
      streaming: {
        type: 'object',
        collapsible: true,
        properties: {
          isLive: { type: 'boolean', default: false },
          streamUrl: { type: 'string', format: 'uri' },
          recordingUrl: { type: 'string', format: 'uri' },
          platform: { type: 'string', enum: ['youtube', 'vimeo', 'custom', 'none'] },
        },
      },

      // Resources
      resources: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            type: { type: 'string', enum: ['slides', 'document', 'video', 'link', 'other'] },
            url: { type: 'string', format: 'uri' },
          },
        },
      },

      // Feedback
      feedbackEnabled: {
        type: 'boolean',
        default: true,
      },
      averageRating: {
        type: 'number',
        readOnly: true,
      },
      feedbackCount: {
        type: 'number',
        default: 0,
        readOnly: true,
      },
    },
    required: ['event', 'title', 'startTime', 'endTime'],
  } as const;
};

const ess = EventSessionSchema();
export type EventSessionModel = FromSchema<typeof ess>;

registerCollection('EventSession', DataType.event_session, EventSessionSchema());
