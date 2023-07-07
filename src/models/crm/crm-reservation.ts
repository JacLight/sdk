import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType } from '../../types';

export const ReservationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
      },
      workDays: {
        type: 'array',
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'json',
          json: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
      },
      services: {
        type: 'array',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            name: {
              type: 'string',
              css: { width: '100%' },
            },
            duration: {
              type: 'number',
              css: { width: '60px' },
            },
            price: {
              type: 'number',
              css: { width: '60px' },
            },
            breakAfter: {
              type: 'number',
              css: { width: '60px' },
            },
          },
        },
      },
      checkInBy: {
        layout: 'horizontal',
        type: 'object',
        properties: {
          value: {
            type: 'string',
          },
          unit: {
            type: 'string',
            enum: ['days', 'hours', 'minutes', 'months'],
          },
        },
      },
      officeHours: {
        type: 'object',
        layout: 'horizontal',
        properties: {
          startTime: {
            type: 'string',
            // format: 'date-time',
            inputStyle: 'time',
            fieldType: FieldType.date,
          },
          endTime: {
            type: 'string',
            // format: 'date-time',
            inputStyle: 'time',
            fieldType: FieldType.date,
          },
        },
      },
      blockedTime: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            startTime: {
              type: 'string',
              // format: 'time',
              inputStyle: 'time',
              fieldType: FieldType.date,
            },
            endTime: {
              type: 'string',
              // format: 'time',
              inputStyle: 'time',
              fieldType: FieldType.date,
            },
          },
        },
      },
      description: {
        type: 'string',
      },
      host: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: 'email',
        },
      },
      spots: {
        type: 'number',
        'x-group': 'group1',
        default: 1,
      },
      event: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'sk',
          label: 'name',
        },
      },
      form: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
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
      workflow: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        'x-group': 'group2',
        dataSource: {
          source: 'collection',
          collection: DataType.workflowdefinition,
          value: 'sk',
          label: 'name',
        },
      },
    },
    required: ['name'],
  } as const;
};


export const ReservationEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      reservation: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.reservation,
          value: 'sk',
          label: 'name',
        },
      },
      event: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'sk',
          label: 'name',
        },
      },
      service: {
        type: 'string',
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        inputStyle: 'time'

      },
      endTime: {
        type: 'string',
        format: 'date-time',
        inputStyle: 'time'
      },
      customer: {
        type: 'object',
        layout: 'horizontal',
        properties: {
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
          },
          phone: {
            type: 'string',
          },
        },
      },
      checkedIn: {
        type: 'boolean',
      },
      hosts: {
        type: 'string',
      },
      venue: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
    },
    required: ['name'],
  } as const;
};

const cs = ReservationSchema();
export type ReservationModel = FromSchema<typeof cs>;

const cse = ReservationEntrySchema();
export type ReservationEntryModel = FromSchema<typeof cse>;

export const ReservationUI = (): CollectionUI[] => {
  return null;
};
export const ReservationRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Reservation',
  DataType.reservation,
  ReservationSchema(),
  ReservationUI(),
  ReservationRules(),
  true
);

registerCollection(
  'ReservationEntry',
  DataType.reservationentry,
  ReservationEntrySchema(),
  ReservationUI(),
  ReservationRules(),
  true
);


//create a reservation workflow definition with 8 stages - intake, confirmed, check-in, waiting, completed, canceled, reschedule, error

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

registerDefaultData(DataType.reservation, genDefaultData);
