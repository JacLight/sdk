import { FromSchema } from 'json-schema-to-ts';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { DataType } from '../types';
import { registerCollection } from '../defaultschema';
import { FileInfoSchema } from './fileinfo';

export const CategorySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        inputStyle: 'textarea',
      },
      tags: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      image: FileInfoSchema(),
      categories: {
        type: 'array',
        hidden: true,
        items: { type: 'object' },
      },
    },
  } as const;
};

const rt = CategorySchema();
export type CategoryModel = FromSchema<typeof rt>;

export const CategoryUI = (): CollectionUI[] => { return null };
export const CategoryRules = (): CollectionRule[] => { return [] };
registerCollection('Category', DataType.category, CategorySchema(), CategoryUI(), CategoryRules())
