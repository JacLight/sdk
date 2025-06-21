import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';



export const FileInfoSchema = () => {
  return {
    type: 'object',
    readOnly: true,
    'x-control': ControlType.file,
    properties: {
      path: {
        type: 'string',
      },
      content: {
        type: 'string',
        hidden: true,
      },
      url: {
        type: 'string',
        'x-render': 'file',
      },
      isPublic: {
        type: 'boolean',
        hidden: true,
      },
      meta: {
        type: 'object',
        hidden: true,
        properties: {
          width: {
            type: 'number',
          },
          height: {
            type: 'number',
          },
          size: {
            type: 'number',
          },
          xs: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
              },
              url: {
                type: 'string',
              },
            },
          },
          sm: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
              },
              url: {
                type: 'string',
              },
            },
          },
          md: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
              },
              url: {
                type: 'string',
              },
            },
          },
        },
      }
    },
  } as const;
};

const cos = FileInfoSchema();
export type FileInfoModel = FromSchema<typeof cos>;

export const FileInfoUI = (): CollectionUI[] => {
  return null;
};
export const FileInfoRules = (): CollectionRule[] => {
  return [];
};

registerCollection(
  'File',
  DataType.fileinfo,
  FileInfoSchema(),
  FileInfoUI(),
  FileInfoRules(),
  true
);
