import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType } from '../../types';

export const EventSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      host: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: 'email',
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
      venue: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
    },
  } as const;
};

const cs = EventSchema();
export type EventModel = FromSchema<typeof cs>;

export const EventUI = (): CollectionUI[] => {
  return null;
};
export const EventRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Event',
  DataType.event,
  EventSchema(),
  EventUI(),
  EventRules(),
  true,
  true
);
