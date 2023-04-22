import { CollectionUI } from '../collection-ui';
import { FieldType, FormViewSectionType, } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { FromSchema } from 'json-schema-to-ts';

export const FDViewTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        inputStyle: 'html',
        fieldType: FieldType.code,
        css: { height: '600px' },
        hideLabel: true,
      },
      usage: {
        type: 'array',
        items: {
          type: 'string',
        },
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'json',
          json: ['web', 'email', 'mobile'],
        },
      },
      source: {
        type: 'string',
        hidden: true,
      },
      image: FileInfoSchema(),
    },
  } as const;
};

export const FDViewTemplateUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/application',
        },
        {
          '0': '/properties/name',
          '1': '/properties/type',
        },
        {
          '0': '/properties/content',
        },
      ],
    },
  ];
};

const rt = FDViewTemplateSchema();
export type FDViewTemplateModel = FromSchema<typeof rt>;