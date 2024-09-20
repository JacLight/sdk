import { ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { FromSchema } from 'json-schema-to-ts';

export const FDCreativeStudioSchema = () => {
  return {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        'x-control-variant': 'html',
        'x-control': ControlType.code,
        css: { height: '600px' },
        hideLabel: true,
      },
      usage: {
        type: 'array',
        items: {
          type: 'string',
        },
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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