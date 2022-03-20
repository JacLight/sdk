import { FromSchema } from 'json-schema-to-ts';

export const CollectionViewSchema = () => {
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
      datatype: { type: 'string' },
      description: {
        type: 'string',
      },
      columns: { type: 'array', hidden: true, },
      filters: {
        type: 'array',
        hidden: true,
      },
    },
  } as const;
};

const ps = CollectionViewSchema();
export type CollectionViewModel = FromSchema<typeof ps>;
