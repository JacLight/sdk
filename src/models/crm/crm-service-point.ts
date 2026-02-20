import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const ServicePointSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'location',
      },
      capacity: {
        type: 'number',
        group: 'location',
      },
      location: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-group': 'group1',
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
        group: 'location',
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      features: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'string',
        },
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
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
      status: {
        type: 'string',
        enum: ['closed', 'reserved', 'open', 'busy'],
        group: 'form',
      },
    },
  } as const;
};

export const ServicePointItemSchema = () => {
  return {
    type: 'object',
    showOwner: true,
    ownerTypes: [DataType.reservation, DataType.event, 'walk-in'],
    properties: {
      location: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-group': 'group1',
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
        group: 'location',
      },
      servicePoint: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.service_point,
          value: 'name',
          label: 'name',
          filter: { property: 'location', value: '{{location}}' },
        },
        group: 'service',
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'service',
      },
      status: {
        type: 'string',
        enum: ['waiting', 'checked-in', 'in-progress', 'completed', 'cancelled', 'no-show'],
        group: 'service',
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
      description: {
        type: 'string',
        group: 'reservation',
        'x-control-variant': 'textarea',
      },
      startTime: {
        type: 'string',
        format: 'date-time',
        group: 'time',
      },
      endTime: {
        type: 'string',
        group: 'time',
        format: 'date-time',
      },
      host: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'name'],
        },
        group: 'host',
      },
      source: {
        type: 'string',
        enum: ['event', 'reservation', 'walk-in'],
        group: 'host',
      },
    },
  } as const;
};

const cs = ServicePointSchema();
export type ServicePointModel = FromSchema<typeof cs>;

registerCollection(
  'ServicePoint',
  DataType.service_point,
  ServicePointSchema(),
);


const csi = ServicePointItemSchema();
export type ServicePointItemModel = FromSchema<typeof csi>;

registerCollection(
  'ServicePointItem',
  DataType.service_point_item,
  ServicePointItemSchema(),
);
