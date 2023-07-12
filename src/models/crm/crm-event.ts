import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';

export const EventSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
      },
      number: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      host: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: 'email',
        },
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        'x-group': 'time',
      },
      endTime: {
        type: 'string',
        'x-group': 'time',
        format: 'date-time',
      },
      venue: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        'x-group': 'group1',
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
      },
      notificationTemplate: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        'x-group': 'group2',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'sk',
          label: 'name',
        },
      },
      type: {
        type: 'string',
        enum: ['event', 'meeting', 'appointment'],
      },
      generateMeetingLink: {
        type: 'boolean',
      },
      meetingLink: {
        type: 'string',
      },
      participants: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'new', 'confirmed', 'completed', 'rescheduled', 'cancelled'],
      },
    },
  } as const;
};

export const EventRules = (): CollectionRule[] => {
  return [
    {
      name: 'Read Only Meeting Link when Generate Meeting Link is true',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/meetingLink/readOnly',
          valueFromField: true,
          sourceField: '/properties/generateMeetingLink',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: '',
            field1: '/properties/generateMeetingLink',
            operation: 'notEqual',
          },
        ],
      },
    },
  ];
};


export const EventUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
        },
        {
          '0': '/properties/description',
        },
        {
          '0': '/properties/startTime',
          '1': '/properties/endTime',
        },
        {
          '0': '/properties/host',
          '1': '/properties/venue',
        },
        {
          '0': '/properties/type',
          '1': '/properties/notificationTemplate',
        },
        {
          '0': '/properties/generateMeetingLink',
          '1': '/properties/meetingLink',
        },
        {
          '0': '/properties/participants',
        },
        {
          '0': '/properties/status',
        },
      ],
    },
  ];
}


const cs = EventSchema();
export type EventModel = FromSchema<typeof cs>;

registerCollection(
  'Event',
  DataType.event,
  EventSchema(),
  EventUI(),
  EventRules(),
  true,
  true
);
