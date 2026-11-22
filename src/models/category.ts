import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

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
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      image: FileInfoSchema(),
      // How a store category is listed on each sales channel: the channel's own category, by channel id
      // ({ tiktok: { id: '601226', label: 'Jewelry Accessories › Necklaces', tree: 'US' } }). id is what the channel's
      // API takes; label is for people; tree is the channel's category list it belongs to (TikTok: the shop's region,
      // eBay: its site), so a category picked for another country's list is caught. Edited in its own panel.
      channels: {
        type: 'object',
        hidden: true,
        additionalProperties: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            label: { type: 'string' },
            tree: { type: 'string' },
          },
        },
      },
      children: {
        type: 'array',
        hidden: true,
        items: { type: 'object' },
      },
    },
  } as const;
};

const rt = CategorySchema();
export type CategoryModel = FromSchema<typeof rt>;

registerCollection(
  'Category',
  DataType.category,
  CategorySchema()
);