import { FromSchema } from 'json-schema-to-ts';
import { ControlType, DataType } from '../types';
import { registerCollection } from '../default-schema';

export const WorkspaceSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        group: 'title',
      },
      icon: {
        type: 'string',
        group: 'title',
        'x-control': ControlType.icon,
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      // A workspace is a project with tracking; a conversation is the same record
      // without it (members, items, expiry, private flag; no tasks or views).
      type: {
        type: 'string',
        enum: ['workspace', 'conversation'],
        default: 'workspace',
        group: 'title',
      },
      // Empty = forever. Set = unreadable from that instant; nothing is deleted.
      // Where this workspace is opened: the workspace app's address on the client that
      // last wrote to it (Studio or Business Made, on whatever host). Emails deep-link here.
      appUrl: {
        type: 'string',
        hidden: true,
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
      },
      // Direct conversations: the sorted member emails joined with ',' — one per set of people.
      directKey: {
        type: 'string',
        hidden: true,
      },
      members: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            slogan: {
              type: 'string',
            },
            status: {
              type: 'string',
              enum: ['new', 'invited', 'active', 'inactive', 'expired'],
            },
            accessType: {
              type: 'string',
              enum: ['guest', 'member', 'admin'],
            },
            // A temporary or outside person: only what they are named in, no browsing.
            external: {
              type: 'boolean',
            },
            // Membership ends here; empty = forever.
            expiresAt: {
              type: 'string',
              format: 'date-time',
            },
            invitedBy: {
              type: 'string',
            },
            joinedAt: {
              type: 'string',
              format: 'date-time',
            },
            notify: {
              type: 'string',
              enum: ['all', 'mentions', 'none'],
            },
            lastReadAt: {
              type: 'string',
              format: 'date-time',
            },
            // When the "while you were away" email last went out, so it is not repeated.
            lastDigestAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
      pinnedItems: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            location: {
              type: 'string',
            },
          },
        },
      },
      // Private: invited or added only, invisible otherwise. Public: anyone in the
      // org can read; joining makes you a member and lets you post.
      isPrivate: {
        type: 'boolean',
      },
      status: {
        type: 'string',
        enum: ['active', 'archived'],
        default: 'active',
      },
      intakeForm: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
      },
    },
  } as const;
};

const rt = WorkspaceSchema();
export type WorkspaceModel = FromSchema<typeof rt>;

registerCollection('Workspace', DataType.workspace, WorkspaceSchema());
