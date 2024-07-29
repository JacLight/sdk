import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const EventSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        group: 'status',
        transform: 'uri'
      },
      type: {
        type: 'string',
        enum: ['event', 'meeting', 'appointment'],
        group: 'status',
      },
      status: {
        type: 'string',
        enum: ['draft', 'new', 'confirmed', 'completed', 'rescheduled', 'cancelled'],
        group: 'status',
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
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
      venue: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        'x-group': 'group1',
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
        group: 'host'
      },
      generateMeetingLink: {
        type: 'boolean',
        group: 'host',
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },
      participants: {
        type: 'string',
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      notificationTemplate: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-group': 'group2',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'sk',
          label: 'name',
          group: 'form',
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
