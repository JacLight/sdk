import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, NotificationChannels } from '../../types';
import { toTitleCase } from '../../utils';

export const NotificationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      template: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'sk',
          label: 'name',
        },
      },
      message: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.message,
          value: 'sk',
          label: 'name',
        },
      },
      channel: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        inputStyle: 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(NotificationChannels).map(key => ({
            value: key,
            label: toTitleCase(key),
          })),
        },
      },
      to: {
        type: 'string',
      },
      schedule: {
        type: 'array',
        title: 'Schedule',
        items: {
          type: 'string',
          format: 'date-time',
        },
      },
      cron: {
        type: 'string',
        fieldType: FieldType.cron,
      },
      status: {
        type: 'string',
        enum: ['active', 'stop', 'error', 'done'],
      },
      lastRun: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
      nextRun: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
      },
    },
  } as const;
};

const dd = NotificationSchema();
export type NotificationModel = FromSchema<typeof dd>;

export const NotificationUI = (): CollectionUI[] => {
  return null;
};
export const NotificationRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Notification',
  DataType.notification,
  NotificationSchema(),
  NotificationUI(),
  NotificationRules(),
  true
);
