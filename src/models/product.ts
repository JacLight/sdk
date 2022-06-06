import { FromSchema } from 'json-schema-to-ts';

export const ProductSchema = () => {
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
      extension: {
        type: 'string',
      },
      typeid: {
        type: 'string',
      },
      primary: {
        type: 'string',
        default: 'false',
      },
    },
  } as const;
};

const dd = ProductSchema();
export type ProductModel = FromSchema<typeof dd>;
