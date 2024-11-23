import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
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