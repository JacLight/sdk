import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, ControlType } from '../types';
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
        transform: 'uri'
      },
      systemEmail: {
        type: 'string',
        format: 'email',
      },
      systemPhone: {
        type: 'string',
      },
      emailTemplate: getSettingItemSchema(DataType.messagetemplate),
      smsTemplate: getSettingItemSchema(DataType.messagetemplate),
      orderEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      orderSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      subscriptionEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      subscriptionSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      ticketEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      ticketSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      registerEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      registerSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      profileUpdateEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      profileUpdateSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      passwordChangeEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      passwordChangeSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      passwordResetEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      passwordResetSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      workflowEmailTemplate: getSettingItemSchema(DataType.messagetemplate),
      workflowSmsTemplate: getSettingItemSchema(DataType.messagetemplate),
      inSmsGateway: getSettingItemSchema(DataType.config),
      outSmsGateway: getSettingItemSchema(DataType.config),
      inEmailGateway: getSettingItemSchema(DataType.config),
      outEmailGateway: getSettingItemSchema(DataType.config),
      siteDashboard: getSettingItemSchema(DataType.dataviz),
      storeDashboard: getSettingItemSchema(DataType.dataviz),
      crmDashboard: getSettingItemSchema(DataType.dataviz),
      mintflowDashboard: getSettingItemSchema(DataType.dataviz),
      workflowDashboard: getSettingItemSchema(DataType.dataviz),
    },
  } as const;
};

const getSettingItemSchema = (datatype: DataType) =>
({
  type: 'string',
  'x-control': ControlType.selectMany,
  dataSource: {
    source: 'collection',
    collection: datatype,
    value: 'sk',
    label: 'name',
  },
} as const);

export const LogSchema = () => {
  return {
    type: 'object',
    'x-control': ControlType.selectMany,
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
