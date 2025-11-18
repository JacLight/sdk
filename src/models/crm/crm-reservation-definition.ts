import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const ReservationDefinitionSchema = () => {
  return {
    type: 'object',
    ai: true,
    personalize: true,
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'name',
      },
      type: {
        type: 'string',
        group: 'name',
        enum: ['service', 'interval', 'event', 'service-point'],
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive'],
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'title',
      },
      paymentRequired: {
        type: 'boolean',
        group: 'title',
      },
      image: FileInfoSchema(),
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      event: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'name',
          label: 'name',
        },
        rules: [
          {
            operation: 'notEqual',
            valueA: 'event',
            valueB: '{{type}}',
            action: 'hide',
          },
        ],
      },
      servicePoints: {
        type: 'array',
        collapsible: true,
        'x-control': ControlType.table,
        operations: ['pick', 'add', 'remove'],
        displayStyle: 'table',
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            id: {
              type: 'string',
              hideIn: ['table'],
            },
            name: {
              type: 'string',
              styleClass: 'w-full',
            },
            capacity: {
              type: 'string',
              styleClass: 'w-10',
            },
            location: {
              styleClass: 'w-16',
              type: 'string',
            },
            images: {
              styleClass: 'w-16',
              type: 'string',
              hideIn: ['table'],
            },
            title: {
              styleClass: 'w-16',
              type: 'string',
              hideIn: ['table'],
            },
          },
        },
        dataSource: {
          source: 'collection',
          collection: DataType.service_point,
          value: 'name',
          label: 'name',
        },
        rules: [
          {
            operation: 'notEqual',
            valueA: 'service-point',
            valueB: '{{type}}',
            action: 'hide',
          },
        ],
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
        group: 'location',
      },
      hosts: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: 'email',
        },
        group: 'location',
      },
      services: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              group: 'category',
            },
            categories: {
              type: 'string',
              group: 'category',
            },

            duration: {
              type: 'number',
              group: 'time',
            },
            price: {
              type: 'number',
              group: 'time',
            },
            breakAfter: {
              type: 'number',
              group: 'time',
            },
            images: {
              type: 'array',
              'x-control': ControlType.file,
            },
            description: {
              type: 'string',
              'x-control-variant': 'textarea',
            },
          },
        },
        rules: [
          {
            operation: 'in',
            valueA: ['service-point', 'event'],
            valueB: '{{type}}',
            action: 'hide',
          },
        ],
      },
      workDays: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'json',
          json: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
        },
      },
      officeHours: {
        type: 'object',
        properties: {
          timezone: {
            type: 'string',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: {
              source: 'function',
              value: 'timezones',
            },
            default: '{{fn:Intl.DateTimeFormat().resolvedOptions().timeZone}}',
            group: 'time',
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
      blockedTime: {
        type: 'array',
        items: {
          type: 'object',
          'x-control-variant': 'time',
          'x-control': ControlType.dateRange,
          properties: {
            startTime: {
              type: 'string',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
              group: 'btime',
            },
            endTime: {
              type: 'string',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
              group: 'btime',
            },
          },
        },
      },
      checkInBy: {
        type: 'number',
        title: 'Check-in by (minutes)',
        group: 'spots',
      },
      spots: {
        type: 'number',
        'x-group': 'group1',
        default: 1,
        group: 'spots',
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
      bookingType: {
        type: 'string',
        enum: ['unassigned', 'round-robin'],
        group: 'form',
      },
      meetingInfo: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      meetingLink: {
        type: 'string',
      },
      emails: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      phones: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      notifications: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          ai: true,
          properties: {
            timeBefore: {
              type: 'number',
              group: 'timeBefore',
              description: 'Time before reservation, 0 for immediate',
            },
            unit: {
              type: 'string',
              enum: ['minutes', 'hours', 'days'],
              group: 'timeBefore',
            },
            type: {
              type: 'string',
              enum: ['email', 'sms', 'whatsapp'],
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              group: 'type',
            },
            template: {
              type: 'string',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'name',
                label: 'name',
              },
            },
            subject: {
              type: 'string',
              description: 'Email subject line (for email notifications)',
            },
            html: {
              type: 'string',
              hideIn: ['form', 'table'],
              'x-control': ControlType.richtext,
              personalize: true,
            },
            text: {
              type: 'string',
              hideIn: ['form', 'table'],
              'x-control-variant': 'textarea',
              personalize: true,
            },
          },
        },
      },
      workflow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-group': 'group2',
        dataSource: {
          source: 'collection',
          collection: DataType.workflowdefinition,
          value: 'sk',
          label: 'name',
        },
        group: 'workflow',
      },
    },
    required: ['name'],
  } as const;
};

const cs = ReservationDefinitionSchema();
export type ReservationDefinitionModel = FromSchema<typeof cs>;

registerCollection(
  'Reservation Definition',
  DataType.reservationdefinition,
  ReservationDefinitionSchema()
);
