import { FromSchema } from 'json-schema-to-ts';

export const MintflowSchema = () => {
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
      nodes: {
        type: 'array',
        itemss: {
          type: 'object'
        },
        hidden: 'true',
      },
    },
  } as const;
};

const ps = MintflowSchema();
export type MintflowModel = FromSchema<typeof ps>;
