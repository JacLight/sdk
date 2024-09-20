import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const ReservationDefinitionSchema = () => {
  return {
    type: 'object',
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
      paymentRequired: {
        type: 'boolean',
        group: 'name',
      },
      title: {
        type: 'string',
      },
      image: FileInfoSchema(),
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
      },
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
          { operation: 'notEqual', valueA: 'event', valueB: '{{type}}', action: 'hide' },
        ]
      },
      servicePoints: {
        type: 'array',
        collapsible: true,
        'x-group': 'group1',
        'x-control-variant': 'picker',
        displayStyle: 'table',
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            id: {
              type: 'string',
              hideInTable: true
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
              hideInTable: true
            },
            title: {
              styleClass: 'w-16',
              type: 'string',
              hideInTable: true
            }
          },
        },
        dataSource: {
          source: 'collection',
          collection: DataType.service_point,
          value: 'name',
          label: 'name',
        },
        rules: [
          { operation: 'notEqual', valueA: 'service-point', valueB: '{{type}}', action: 'hide' },
        ]
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
      },
      services: {
        collapsible: true,
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            name: {
              type: 'string',
              styleClass: 'w-full',
            },
            duration: {
              type: 'number',
              styleClass: 'w-16',
              css: { width: '60px' },
            },
            price: {
              type: 'number',
              styleClass: 'w-16',
              css: { width: '60px' },
            },
            breakAfter: {
              type: 'number',
              styleClass: 'w-16',
              css: { width: '60px' },
            },
          },
        },
        rules: [
          { operation: 'in', valueA: ['service-point', 'event'], valueB: '{{type}}', action: 'hide' },
        ]
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
          json: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
      },
      officeHours: {
        type: 'object',
        collapsible: true,
        'x-control-variant': 'time',
        'x-control': ControlType.dateRange,
        properties: {
          startTime: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            group: 'time'
          },
          endTime: {
            type: 'string',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
            group: 'time'
          },
        },
      },
      blockedTime: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          'x-control-variant': 'time',
          'x-control': ControlType.dateRange,
          properties: {
            startTime: {
              type: 'string',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
              group: 'btime'

            },
            endTime: {
              type: 'string',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
              group: 'btime'
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
        items: {
          type: 'string',
        },
        group: 'workflow',
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
  ReservationDefinitionSchema(),
  null,
  null,
  true
);


const genDefaultData = () => {
  return {
    tasks: [
      {
        status: 'new',
        name: 'Reservation',
        description: 'Workflow for reservation',
        stageId: 0,
      },
    ],
    stages: [
      { id: 0, type: 'start', name: 'intake', assignTo: 'reservation-host' },
      { id: 1, type: 'intermediate', name: 'confirmed' },
      { id: 2, type: 'intermediate', name: 'checkedIn' },
      { id: 3, type: 'intermediate', name: 'waiting' },
      { id: 4, type: 'intermediate', name: 'completed' },
      { id: 5, type: 'end', name: 'canceled' },
      { id: 6, type: 'end', name: 'reschedule' },
      { id: 7, type: 'end', name: 'error' },
    ],
  };
};

registerDefaultData(DataType.reservationdefinition, genDefaultData);
