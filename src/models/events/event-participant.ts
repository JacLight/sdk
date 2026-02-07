import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const EventParticipantSchema = () => {
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

      // Link to customer record - all personal info comes from here
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Participant type - fully user-defined
      type: {
        type: 'string',
        description: 'Participant type e.g. attendee, speaker, exhibitor, sponsor, volunteer, press, vip',
      },

      // Role within their type
      role: {
        type: 'string',
        description: 'Role e.g. keynote, panelist, moderator, workshop_lead, mc, booth_staff',
      },

      // RSVP / Status
      status: {
        type: 'string',
        enum: ['invited', 'accepted', 'declined', 'waitlisted', 'confirmed', 'cancelled', 'no_show'],
        default: 'invited',
      },

      // Featured flag
      featured: {
        type: 'boolean',
        default: false,
      },

      // Sessions this participant is linked to
      sessions: {
        type: 'array',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event_session,
          value: 'sk',
          label: 'title',
        },
        items: { type: 'string' },
      },

      // Bio & Image (event-specific, may differ from customer profile)
      bio: {
        type: 'string',
        'x-control': ControlType.richtext,
        collapsible: true,
      },
      shortBio: {
        type: 'string',
        'x-control-variant': 'textarea',
        maxLength: 300,
      },
      image: FileInfoSchema(),

      // Social links (event-specific)
      social: {
        type: 'object',
        collapsible: true,
        properties: {
          linkedin: { type: 'string', format: 'uri' },
          twitter: { type: 'string' },
          website: { type: 'string', format: 'uri' },
          github: { type: 'string' },
        },
      },

      // Topics & Tags
      topics: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },
      tags: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },

      // Logistics
      logistics: {
        type: 'object',
        collapsible: true,
        properties: {
          requiresTravel: { type: 'boolean' },
          requiresAccommodation: { type: 'boolean' },
          arrivalDate: { type: 'string', format: 'date' },
          departureDate: { type: 'string', format: 'date' },
          specialRequirements: { type: 'string', 'x-control-variant': 'textarea' },
          dietaryRestrictions: { type: 'string' },
        },
      },

      // RSVP details
      rsvp: {
        type: 'object',
        collapsible: true,
        properties: {
          respondedAt: { type: 'string', format: 'date-time' },
          invitedAt: { type: 'string', format: 'date-time' },
          message: { type: 'string' },
          plusOne: { type: 'boolean', default: false },
          guestCount: { type: 'number', default: 0 },
        },
      },

      // Notes (internal)
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['event', 'customer'],
  } as const;
};

const eps = EventParticipantSchema();
export type EventParticipantModel = FromSchema<typeof eps>;

registerCollection('EventParticipant', DataType.event_participant, EventParticipantSchema());
