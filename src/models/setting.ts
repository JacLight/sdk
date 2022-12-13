import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
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
      ownerType: {
        type: 'string', // System, Role, Group, User
      },
      ownerId: {
        type: 'string',
      },
      '^setting_': {
        type: 'object',
        displayStyle: 'card',
        properties: {
          '^property_': {
            type: 'string',
          },
        },
      },
    },
  } as const;
};

export const LogSchema = () => {
  return {
    type: 'object',
    properties: {
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

registerCollection('Setting', DataType.setting, SettingSchema(), SettingUI(), SettingRules())
registerCollection('Log', DataType.log, LogSchema(), null, null)
