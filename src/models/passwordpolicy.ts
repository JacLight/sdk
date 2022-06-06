import { FromSchema } from 'json-schema-to-ts';

export const PasswordPolicySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      description: {
        type: 'string',
      },
      historyAge: {
        type: 'number',
      },
      passwordAge: {
        type: 'number',
        description: 'In days'
      },
      maxFailure: {
        type: 'number',
      },
      resetDelayIn: {
        type: 'number',
        description: 'In Minutes'
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
        description: 'characters not allowed in password'
      },
    },
  } as const;
};

const pps = PasswordPolicySchema();
export type PasswordPolicyModel = FromSchema<typeof pps>;
