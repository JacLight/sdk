import { FromSchema } from 'json-schema-to-ts';
import { ControlType, DataType } from '../types';
import { registerCollection } from '../default-schema';
import { FileInfoSchema } from './file-info';

// The journal of a workspace. `member` is the record written when someone is
// added, removed, leaves or expires; the current list lives on the workspace.
const workspaceItems = ['message', 'task', 'file', 'event', 'agenda', 'analytics', 'member', 'data', 'team', 'block']

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
      datatype: {
        type: 'string',
        hidden: true,
      },
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            datatype: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
            title: {
              type: 'string',
            },
            summary: {
              type: 'string',
            },
            assignTo: {
              type: 'string',
            }
          },
          required: ['datatype', 'id', 'title']
        }
      },
      files: {
        type: 'array',
        items: FileInfoSchema(),
      },
      message: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      // Denormalised workspace sk (the owner chain's root) for views and scope filters.
      workspace: {
        type: 'string',
        hidden: true,
      },
      // A room is a label on message items — a filter of Activity, listed like
      // folders under a mail inbox. Nothing is stored for a room itself.
      room: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string' },
        },
      },
      // Empty = forever. Set = unreadable from that instant; nothing is deleted.
      expiresAt: {
        type: 'string',
        format: 'date-time',
      },
      // One-level replies: the item this one answers.
      // Task items: the agenda (project) this task belongs to, an agenda item id.
      agenda: {
        type: 'string',
        hidden: true,
      },
      // Agenda (project) items: who leads it and when it should land.
      lead: {
        type: 'string',
      },
      dueDate: {
        type: 'string',
        format: 'date',
      },
      parentItem: {
        type: 'string',
        hidden: true,
      },
      replyCount: {
        type: 'number',
        hidden: true,
      },
      mentions: {
        type: 'array',
        items: { type: 'string' },
        hidden: true,
      },
      edited: { type: 'boolean', hidden: true },
      editedAt: { type: 'string', format: 'date-time', hidden: true },
      deleted: { type: 'boolean', hidden: true },
      // type = member: what changed for whom.
      action: {
        type: 'string',
        enum: ['added', 'removed', 'left', 'expired', 'role-changed', 'access-changed', 'invited', 'joined'],
      },
      email: { type: 'string' },
      role: { type: 'string' },
      external: { type: 'boolean' },
      by: { type: 'string' },
    }
  } as const;
};

const rt = WorkspaceItemSchema();
export type WorkspaceItemModel = FromSchema<typeof rt>;

registerCollection(
  'WorkspaceItem',
  DataType.workspace_item,
  WorkspaceItemSchema(),
);
