import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType, FormViewSectionType } from '../../types';

export const ReservationDefinitionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri'
      },
      type: {
        type: 'string',
        enum: ['queue', 'interval', 'service'],
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
            type: 'number',
          },
          unit: {
            type: 'string',
            enum: ['hours', 'minutes'],
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
            'x-control-variant': 'time',
            'x-control': ControlType.date,
          },
          endTime: {
            type: 'string',
            // format: 'date-time',
            'x-control-variant': 'time',
            'x-control': ControlType.date,
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
              'x-control-variant': 'time',
              'x-control': ControlType.date,
            },
            endTime: {
              type: 'string',
              // format: 'time',
              'x-control-variant': 'time',
              'x-control': ControlType.date,
            },
          },
        },
      },
      description: {
        type: 'string',
      },
      host: {
        type: 'string',
        'x-control': ControlType.selectMany,
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
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.event,
          value: 'sk',
          label: 'name',
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
      },
      venue: {
        type: 'string',
        'x-control': ControlType.selectMany,
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
        'x-control': ControlType.selectMany,
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
        'x-control': ControlType.selectMany,
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


export const ReservationDefinitionUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
          '1': '/properties/type',
        },
        {
          '0': '/properties/description',
        },
        {
          '0': '/properties/services',
        },
        {
          '0': '/properties/workDays',
        },
        {
          '0': '/properties/officeHours',
        },
        {
          '0': '/properties/blockedTime',
        },
        {
          '0': '/properties/checkInBy',
        },
        {
          '0': '/properties/host',
          '1': '/properties/venue',
          '2': '/properties/spots',
        },
        {
          '0': '/properties/form',
          '1': '/properties/event',
        },
        {
          '0': '/properties/notificationTemplate',
          '1': '/properties/workflow',
        },
      ],
    },
  ];
}



const cs = ReservationDefinitionSchema();
export type ReservationDefinitionModel = FromSchema<typeof cs>;

export const ReservationDefinitionRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Reservation Definition',
  DataType.reservationdefinition,
  ReservationDefinitionSchema(),
  ReservationDefinitionUI(),
  ReservationDefinitionRules(),
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

registerDefaultData(DataType.reservationdefinition, genDefaultData);
