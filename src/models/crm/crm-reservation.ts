import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { ControlType, DataType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

export const ReservationSchema = () => {
  return {
    type: 'object',
    properties: {
      // Reservation = a forward-looking booking note. The live queue / check-in
      // state is a Task on `reservation-checkin-pipeline` (DataType.task), not a
      // status on this model. Reservation status is just "is this booking still
      // valid" — `pending` until used or marked, `used` once a check-in Task linked
      // back to it, `cancelled`/`no_show` for the bad outcomes.
      status: {
        type: 'string',
        default: 'pending',
        'x-control': 'label',
        readOnly: true,
        enum: [
          'new',
          'pending',
          'confirmed',
          'used',
          'rescheduled',
          'cancelled',
          'no_show',
        ],
        group: 'name',
      },
      usedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        description:
          'Stamped when a check-in Task linked back to this reservation',
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
      reservationDefinitionId: {
        type: 'string',
        group: 'name',
      },
      ...BusinessLocationField(),
      // What this reservation is waiting on / occupies. Mirrors ReservationDefinition.type.
      targetType: {
        type: 'string',
        enum: ['service_point', 'pipeline', 'event', 'interval'],
        group: 'target',
      },
      // For targetType='service_point' — id of the ServicePoint (section/table/seat/...).
      servicePointId: { type: 'string', group: 'target' },
      // For targetType='pipeline' — workflow + current stage.
      workflowName: { type: 'string', group: 'target' },
      currentStageId: { type: 'string', group: 'target' },
      // How the reservation got into the system. Drives queue-UI filters and
      // can be branched on by workflow stages (e.g., walk-in jumps the
      // confirmation stage). Default 'online' for self-service flows.
      source: {
        type: 'string',
        enum: [
          'walk-in',
          'phone',
          'online',
          'partner',
          'kiosk',
          'agent',
          'email',
        ],
        default: 'online',
        group: 'target',
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
          required: ['name', 'email'],
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
      locationName: {
        type: 'string',
        group: 'time',
      },
      locationType: {
        type: 'string',
        enum: ['physical', 'virtual', 'phone'],
      },
      address: {
        type: 'object',
      },
      meetingLink: {
        type: 'string',
        format: 'uri',
        group: 'time',
      },
      meetingInfo: {
        type: 'string',
        'x-control-variant': 'textarea',
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

registerCollection('Reservation', DataType.reservation, ReservationSchema());
