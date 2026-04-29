import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { BusinessLocationField } from '../_location-fields';

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
        enum: ['service', 'interval', 'event', 'service_point', 'pipeline'],
      },
      // For type='pipeline' — the workflow this reservation kicks off when started.
      // The reservation's status mirrors the workflow stage from there.
      workflowName: {
        type: 'string',
        group: 'name',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'pipeline', action: 'hide' },
        ],
      },
      // For type='service_point' — restrict reservations to a sub-tree of the
      // service-point hierarchy at this location (e.g. "any spot under section
      // patio"). The actual leaf is picked at booking time.
      servicePointParent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.service_point,
          value: 'name',
          label: 'displayName',
          filter: { 'data.businessLocationId': '{{businessLocationId}}' },
        },
        group: 'name',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'service_point', action: 'hide' },
        ],
      },
      // For type='service_point' — optional kind filter (e.g. "table", "seat") to
      // narrow the spot picker by service-point kind.
      servicePointKind: {
        type: 'string',
        group: 'name',
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'service_point', action: 'hide' },
        ],
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
      // Null = offered at all venues. Set for single-venue reservation types.
      ...BusinessLocationField(),
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
      hosts: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: 'email',
        },
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
            valueA: ['service_point', 'event'],
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
      meetingLink: {
        type: 'string',
        group: 'venue',
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
        group: 'venue',
      },
      meetingInfo: {
        type: 'string',
        'x-control-variant': 'textarea',
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
