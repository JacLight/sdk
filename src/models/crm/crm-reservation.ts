import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { ControlType, DataType } from '../../types';

export const ReservationSchema = () => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        default: 'new',
        'x-control': 'label',
        readOnly: true,
        enum: ['new', 'confirmed', 'completed', 'rescheduled', 'cancelled'],
        group: 'name',
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        group: 'name',
        title: 'Reservation ID',
        transform: ['random-string::8', 'uri'],
      },
      definition: {
        type: 'string',
        group: 'name',
      },
      customer: {
        type: 'object',
        layout: 'horizontal',
        properties: {
          name: {
            type: 'string',
            inputRequired: true,
          },
          email: {
            type: 'string',
            inputRequired: true,
          },
          phone: {
            type: 'string',
            inputRequired: true,
          },
        },
      },
      invites: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              inputRequired: true,
            },
            email: {
              type: 'string',
              format: 'email',
              inputRequired: true,
            },
            status: {
              type: 'string',
              enum: ['pending', 'accepted', 'declined'],
              default: 'pending',
            },
          },
          required: ['name','email'],
        },
      },
      service: {
        type: 'string',
        group: 'host',
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
        group: 'host',
      },
      partySize: {
        type: 'number',
        group: 'service',
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        group: 'time',
      },
      endTime: {
        type: 'string',
        format: 'date-time',
        group: 'time',
      },
      checkedIn: {
        type: 'boolean',
        group: 'time',
      },
      hosts: {
        group: 'hosts',
        groupLayout: 'flat',
        type: 'string',
      },
      reminders: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            time: {
              type: 'number',
              description: 'Time before the event to send the reminder',
              group: 'time',
            },
            timeType: {
              type: 'number',
              enum: ['day', 'hour', 'minute'],
              group: 'time',
            },
            method: {
              type: 'string',
              enum: ['email', 'sms'],
              group: 'method',
            },
            template: {
              type: 'string',
              'x-control': ControlType.selectMany,
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                valueField: 'name',
                labelField: 'name',
              },
              group: 'method',
            },
            message: {
              type: 'string',
              'x-control': ControlType.richtext,
            },
          },
          required: ['time', 'method'],
        },
      },
    },
    required: ['name'],
  } as const;
};

const cs = ReservationSchema();
export type ReservationModel = FromSchema<typeof cs>;

registerCollection('Reservation', DataType.reservation, ReservationSchema());
