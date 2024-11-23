import { FromSchema } from 'json-schema-to-ts';
import { ControlType, DataType } from '../types';
import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

const workspaceItems = ['goal', 'file', 'block', 'deliverable', 'member', 'task']

export const WorkspaceItemSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      summary: {
        type: 'string',
      },
      color: {
        type: 'string',
        'x-control': ControlType.color
      },
      type: {
        type: 'string',
        enum: workspaceItems,
      },
      data: {
        type: 'array',
        items: {
          datatype: {
            type: 'string',
          },
          id: {
            type: 'string',
          },
          title: {
            type: 'string',
          },
        }
      },
      files: {
        type: 'array',
        items: FileInfoSchema(),
      },
      message: {
        type: 'string',
      },
      goal: {
        type: 'string',
      },
      status: {
        type: 'string',
      }
    }
  } as const;
};

const rt = WorkspaceItemSchema();
export type WorkspaceItemModel = FromSchema<typeof rt>;

registerCollection(
  'WorkspaceItem',
  DataType.workspace_item,
  WorkspaceItemSchema(),
  [],
  [],
  false,
  false
);
