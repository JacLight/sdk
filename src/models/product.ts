import { FromSchema } from 'json-schema-to-ts';

export const ProductSchema = () => {
  return {
    type: 'object',
    properties: {
      phone: {
        type: 'string',
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
