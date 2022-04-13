import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule, CollectionUI } from './collection';

export const CategorySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      image: {
        type: 'string',
      },
      // categories: {
      //   type: 'array',
      //   hidden: true,
      //   items: { type: 'object' },
      // },
    },
  } as const;
};

const rt = CategorySchema();
export type CategoryModel = FromSchema<typeof rt>;

export const CategoryUI = (): CollectionUI[] => {
  return null;
};

export const CategoryRules = (): CollectionRule[] => {
  return [];
};
