import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const ServicePointSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri'
      },
      image: FileInfoSchema(),
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      capacity: {
        type: 'number',
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
      },
      startTime: {
        type: 'string',
        format: 'date-time',
      },
      endTime: {
        type: 'string',
        format: 'date-time',
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
      status: {
        type: 'string',
        enum: ['closed', 'reserved', 'open', 'busy'],
      },
    },
  } as const;
};

export const ServicePointItemSchema = () => {
  return {
    type: 'object',
    properties: {
      servicePoint: {
        type: 'string',
        readOnly: true,
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri'
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
      source: {
        type: 'string',
        enum: ['event', 'reservation', 'walk-in'],
      },
      reservationDefinitionId: {
        type: 'string',
      },
      reservationName: {
        type: 'string',
      },
      service: {
        type: 'string',
      },
      location: {
        type: 'string',
      },
      startTime: {
        type: 'string',
        format: 'date-time',
      },
      endTime: {
        type: 'string',
        format: 'date-time',
      },
      host: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-group': 'group1',
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'email',
          label: ['email', 'name'],
        },
      },
      status: {
        type: 'string',
        enum: ['upcoming', 'active', 'done', 'cancelled'],
      },
    },
  } as const;
};

export const ServicePointRules = (): CollectionRule[] => null
export const ServicePointUI = (): CollectionUI[] => null
const cs = ServicePointSchema();
export type ServicePointModel = FromSchema<typeof cs>;

registerCollection(
  'ServicePoint',
  DataType.service_point,
  ServicePointSchema(),
  ServicePointUI(),
  ServicePointRules(),
  true,
  true
);


export const ServicePointItemRules = (): CollectionRule[] => null
export const ServicePointItemUI = (): CollectionUI[] => null
const csi = ServicePointItemSchema();
export type ServicePointItemModel = FromSchema<typeof csi>;

registerCollection(
  'ServicePointItem',
  DataType.service_point_item,
  ServicePointItemSchema(),
  ServicePointItemUI(),
  ServicePointItemRules(),
  true,
  true
);
