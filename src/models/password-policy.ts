import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const PasswordPolicySchema = () => {
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
      description: {
        type: 'string',
      },
      historyAge: {
        type: 'number',
      },
      passwordAge: {
        type: 'number',
        description: 'In days',
      },
      maxFailure: {
        type: 'number',
      },
      resetDelayIn: {
        type: 'number',
        description: 'In Minutes',
      },
      allowDictionary: {
        type: 'boolean',
      },
      minLenght: {
        type: 'number',
      },
      minLowercase: {
        type: 'number',
      },
      minUppercase: {
        type: 'number',
      },
      minNumbers: {
        type: 'number',
      },
      minSymbols: {
        type: 'number',
      },
      pattern: {
        type: 'string',
      },
      exclude: {
        type: 'string',
        description: 'characters not allowed in password',
      },
    },
  } as const;
};

const pps = PasswordPolicySchema();
export type PasswordPolicyModel = FromSchema<typeof pps>;

export const PasswordPolicyUI = (): CollectionUI[] => {
  return null;
};
export const PasswordPolicyRules = (): CollectionRule[] => {
  return [];
};
registerCollection(
  'PasswordPolicy',
  DataType.passwordpolicy,
  PasswordPolicySchema(),
  PasswordPolicyUI(),
  PasswordPolicyRules()
);
