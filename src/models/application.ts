import { FromSchema } from 'json-schema-to-ts';

export const ApplicationSchema = () => {
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
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      navigation: {
        type: 'array',
        hidden: true,
      },
      views: {
        type: 'string',
        hidden: true,
      },
    },
  } as const;
};

const as = ApplicationSchema();
export type ApplicationModel = FromSchema<typeof as>;
