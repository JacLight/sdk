import { FieldType } from '../../types';
import { FileInfoSchema } from '../fileinfo';
import { FromSchema } from 'json-schema-to-ts';

export const FDCreativeStudioSchema = () => {
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

const rt = FDCreativeStudioSchema();
export type FDCreativeStudioModel = FromSchema<typeof rt>;