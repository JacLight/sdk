import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
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
      definition: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.reservationdefinition,
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
      servicePoint: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.service_point,
          value: 'sk',
          label: 'name',
        },
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