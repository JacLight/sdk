import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

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
      emailTemplate: getSettingItemSchema(),
      smsTemplate: getSettingItemSchema(),
      orderEmailTemplate: getSettingItemSchema(),
      orderSmsTemplate: getSettingItemSchema(),
      ticketEmailTemplate: getSettingItemSchema(),
      ticketSmsTemplate: getSettingItemSchema(),
      registerEmailTemplate: getSettingItemSchema(),
      registerSmsTemplate: getSettingItemSchema(),
      profileUpdateEmailTemplate: getSettingItemSchema(),
      profileUpdateSmsTemplate: getSettingItemSchema(),
      passwordChangeEmailTemplate: getSettingItemSchema(),
      passwordChangeSmsTemplate: getSettingItemSchema(),
      passwordResetEmailTemplate: getSettingItemSchema(),
      passwordResetSmsTemplate: getSettingItemSchema(),
      workflowEmailTemplate: getSettingItemSchema(),
      workflowSmsTemplate: getSettingItemSchema(),
      smsGateway: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.config,
          value: 'sk',
          label: 'name',
        },
      },
      emailGateway: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.config,
          value: 'sk',
          label: 'name',
        },
      },
    },
  } as const;
};

const getSettingItemSchema = () =>
({
  type: 'string',
  fieldType: FieldType.selectionmultiple,
  dataSource: {
    source: 'collection',
    collection: DataType.messagetemplate,
    value: 'sk',
    label: 'name',
  },
} as const);

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

type SettingModel = FromSchema<typeof usgh>;
type LogModel = FromSchema<typeof ush>;

const SettingUI = (): CollectionUI[] => {
  return null;
};
const SettingRules = (): CollectionRule[] => {
  return [];
};

type BaseSettingType = keyof typeof usgh.properties;
const BaseSettingKeys: { [key in BaseSettingType]?: BaseSettingType } = {};
Object.keys(usgh.properties).forEach(
  (key: string) =>
    (BaseSettingKeys[key as BaseSettingType] = key as BaseSettingType)
);
export {
  SettingModel,
  LogModel,
  SettingUI,
  SettingRules,
  BaseSettingType,
  BaseSettingKeys,
};

registerCollection(
  'Setting',
  DataType.setting,
  SettingSchema(),
  SettingUI(),
  SettingRules()
);
registerCollection('Log', DataType.log, LogSchema(), null, null);
