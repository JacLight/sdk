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
        unique: true
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      workflow: {
        type: 'string',
      },
      enableVersioning: {
        type: 'boolean',
      },
      permission: {
        type: 'object',
        properties: {},
      },
      nodes: {
        type: 'array',
      },
      required: {
        type: 'array',
      },
    },
  } as const
};

export const MintflowNodeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true
      },
      title: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      settings: {
        type: 'object',
        properties: { //property - width, pos, color, etc
          property: {
            type: 'string',
          },
          value: {
            type: 'object',
          }
        }
      }
    },
  } as const
};

const psn = MintflowNodeSchema();
export type MintflowNodeModel = FromSchema<typeof psn>;

const ps = MintflowSchema();
export type MintflowModel = FromSchema<typeof ps>;
