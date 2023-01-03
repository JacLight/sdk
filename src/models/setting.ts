import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const SettingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      orderEmailTemplate: getSettingItemSchema(),
      orderSmsTemplate: getSettingItemSchema(),
      ticketEmailTemplate: getSettingItemSchema(),
      ticketSmsTemplate: getSettingItemSchema(),
      registerEmailTemplate: getSettingItemSchema(),
      registerSmsTemplate: getSettingItemSchema(),
      passwordEmailTemplate: getSettingItemSchema(),
      passwordSmsTemplate: getSettingItemSchema(),
      workflowEmailTemplate: getSettingItemSchema(),
      workflowSmsTemplate: getSettingItemSchema(),
      smsGateway: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.config,
          value: 'sk',
          label: 'name'
        }
      },
      emailGateway: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.config,
          value: 'sk',
          label: 'name'
        }
      }
    }
  } as const;
};

const getSettingItemSchema = () => (
  {
    type: 'string',
    fieldType: FieldType.selectionmultiple,
    dataSource: {
      source: 'collection',
      collection: DataType.messagetemplate,
      value: 'sk',
      label: 'name'
    }
  } as const
)

export const LogSchema = () => {
  return {
    type: 'object',
    fieldType: FieldType.selectionmultiple,
    dataSource: {
      sourceType: { type: 'string' },
      source: { type: 'string' },
      logType: { type: 'string' },
      logMessage: { type: 'string' },
      status: { type: 'string' },
    },
  } as const;
};

const ush = LogSchema();
const usgh = SettingSchema();

export type SettingModel = FromSchema<typeof usgh>;
export type LogModel = FromSchema<typeof ush>;

export const SettingUI = (): CollectionUI[] => { return null };
export const SettingRules = (): CollectionRule[] => { return [] };

export type BaseSettingKeys = keyof typeof usgh.properties

registerCollection('Setting', DataType.setting, SettingSchema(), SettingUI(), SettingRules())
registerCollection('Log', DataType.log, LogSchema(), null, null)