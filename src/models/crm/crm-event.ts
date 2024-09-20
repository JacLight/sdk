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
        group: 'name',
        transform: 'uri'
      },
      type: {
        type: 'string',
        enum: ['event', 'meeting', 'appointment'],
        group: 'name',
      },
      host: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'firstName', 'lastName'],
        },
        group: 'host'
      },
      status: {
        type: 'string',
        enum: ['draft', 'new', 'confirmed', 'completed', 'rescheduled', 'cancelled'],
        group: 'host',
      },
      title: {
        type: 'string',
      },
      participants: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            phone: {
              type: 'string',
            },
            confirmed: {
              type: 'boolean',
            },
          }
        },
        dataSource: {
          source: 'function',
          value: 'getMessageRecipients',
        },
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        'group': 'time',
      },
      endTime: {
        type: 'string',
        'group': 'time',
        format: 'date-time',
      },
      description: {
        type: 'string',
        collapsible: true,
        'x-control': ControlType.richtext,
      },
      venue: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        'group': 'venue',
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
      address: {
        type: 'string',
        rules: [
          { operation: 'isNotEmpty', valueA: '{{venue}}', action: 'hide' },
          { operation: 'isTruthy', valueA: '{{generateMeetingLink}}', action: 'hide' }
        ]
      },
      notificationTemplate: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        'x-group': 'group2',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'name',
          label: 'name',
        },
        group: 'form',
        items: {
          type: 'string',
        },
      },
      form: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
        group: 'form',
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        collapsible: true,
      },
      files: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
        collapsible: true,
      },

    },
    required: ['name', 'startTime', 'endTime'],
  } as const;
};


const cs = EventSchema();
export type EventModel = FromSchema<typeof cs>;

registerCollection(
  'Event',
  DataType.event,
  EventSchema(),
  null,
  null,
  true,
  true
);
