import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';



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
      allowSelfServiceChange: {
        type: 'boolean',
        default: true,
        title: 'People can change their own password',
        description: 'Off: people this policy applies to cannot change their own password (an administrator does it). Finishing a temporary-password sign-in is always allowed.',
      },
      allowSelfServiceReset: {
        type: 'boolean',
        default: true,
        title: 'People can reset a forgotten password',
        description: 'Off: "Forgot password" sends nothing to people this policy applies to.',
      },
      isDefault: {
        type: 'boolean',
        exclusive: true,
        default: false,
        title: 'Organisation default',
        description: 'Applies to everyone with no policy set on them, their groups or their roles.',
      },
    },
  } as const;
};

const pps = PasswordPolicySchema();
export type PasswordPolicyModel = FromSchema<typeof pps>;

registerCollection(
  'PasswordPolicy',
  DataType.passwordpolicy,
  PasswordPolicySchema()
);