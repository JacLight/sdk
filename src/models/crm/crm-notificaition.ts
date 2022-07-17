import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';

export const NotificationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
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
          field: 'name',
        },
      },
      channel: {
        type: 'string',
        inputStyle: 'chip',
        enum: ['popup', 'alert', 'dialog', 'infobar', 'email', 'sms', 'call', 'whatsapp', 'slack'],
      },
      to: {
        type: 'string'
      },
      schdule: {
        type: 'array',
        items: {
          type: 'string',
          format: 'date-time'
        }
      },
      repeat: {
        type: 'boolean'
      },
      status: {
        type: 'string'
      }
    },
  } as const;
};

const dd = NotificationSchema();
export type NotificationModel = FromSchema<typeof dd>;

export const NotificationUI = (): CollectionUI[] => { return null };
export const NotificationRules = (): CollectionRule[] => { return null };
registerCollection('Notification', DataType.notification, NotificationSchema(), NotificationUI(), NotificationRules(), true)
