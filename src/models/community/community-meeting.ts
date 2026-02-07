import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityMeetingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::10', 'uri'],
      },
      title: {
        type: 'string',
      },

      // Organizer (who created the meeting)
      organizer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      organizerInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          company: { type: 'string' },
          image: { type: 'string' },
        },
      },

      // Participants
      participants: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            customer: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'declined', 'tentative'],
              default: 'pending',
            },
            respondedAt: { type: 'string', format: 'date-time' },
          },
        },
      },

      // Schedule
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
        group: 'duration',
      },
      timezone: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'function',
          value: 'timezones',
        },
      },

      // Location
      locationType: {
        type: 'string',
        enum: ['in_person', 'virtual', 'phone'],
        default: 'in_person',
        group: 'location-type',
      },
      location: {
        type: 'string',
        group: 'location-type',
      },
      meetingLink: {
        type: 'string',
        format: 'uri',
      },
      meetingInfo: {
        type: 'string',
      },

      // Event context (if meeting is within an event)
      event: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'sk',
          label: 'title',
        },
      },
      eventName: {
        type: 'string',
        readOnly: true,
      },

      // Status
      status: {
        type: 'string',
        enum: ['proposed', 'confirmed', 'cancelled', 'completed', 'no_show'],
        default: 'proposed',
      },

      // Description
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        maxLength: 500,
      },

      // Reminders
      reminders: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['email', 'push', 'sms'] },
            minutesBefore: { type: 'number' },
            sent: { type: 'boolean', default: false },
            sentAt: { type: 'string', format: 'date-time' },
          },
        },
      },

      // Notes (visible to all participants)
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },

      // Private notes (visible only to organizer)
      privateNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },

      // Cancellation
      cancelledAt: {
        type: 'string',
        format: 'date-time',
      },
      cancelledBy: {
        type: 'string',
      },
      cancellationReason: {
        type: 'string',
      },
    },
    required: ['organizer', 'startTime'],
  } as const;
};

const cmts = CommunityMeetingSchema();
export type CommunityMeetingModel = FromSchema<typeof cmts>;

registerCollection('CommunityMeeting', DataType.community_meeting, CommunityMeetingSchema());
