import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { ControlType, DataType } from '../../types';

export const ReservationSchema = () => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'string',
        enum: ['new', 'confirmed', 'completed', 'rescheduled', 'cancelled'],
        group: 'name',
        readOnly: true,
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        readOnly: true,
        group: 'name',
        title: 'Reservation ID',
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
      service: {
        type: 'string',
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
      partySize: {
        type: 'number',
        hidden: true,
        group: 'service',
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        group: 'time',
        hidden: true,
      },
      endTime: {
        type: 'string',
        format: 'date-time',
        group: 'time',
        hidden: true,
      },
      checkedIn: {
        type: 'boolean',
        hidden: true,
        group: 'time',
      },
      hosts: {
        group: 'hosts',
        groupLayout: 'flat',
        type: 'string',
        hidden: true,
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