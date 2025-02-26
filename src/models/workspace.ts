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
        'x-control': ControlType.icon
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
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
              enum: ['new', 'invited', 'active', 'inactive'],
            },
            accessType: {
              type: 'string',
              enum: ['guest', 'member', 'admin'],
            }
          },
        }
      },
      goals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              hidden: true,
              transform: ['random-string::6'],
            },
            title: {
              type: 'string',
              'inputRequired': true,
            },
            description: {
              type: 'string',
              'x-control-variant': 'textarea',
            },
            color: {
              type: 'string',
              'x-control': ControlType.color,
              'inputRequired': true,
            },
            progress: {
              type: 'string',
              hidden: true,
            },
            status: {
              type: 'string',
              hidden: true,
              group: 'status',
              enum: ['draft', 'not-started', 'in-progress', 'completed', 'blocked', 'cancelled'],
              default: 'new',
            },
            dueDate: {
              type: 'string',
              'x-control': ControlType.date,
              group: 'status',
            },
            deliverables: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                  },
                  description: {
                    type: 'string',
                  },
                  status: {
                    type: 'string',
                    group: 'status',
                    enum: ['draft', 'not-started', 'in-progress', 'completed', 'blocked', 'cancelled'],
                    default: 'new',
                  },
                  dueDate: {
                    type: 'string',
                    'x-control': ControlType.date,
                    group: 'status',
                  },
                },
              },
            },
          },
        }
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
        }
      },
      isPrivate: {
        type: 'boolean',
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
    }
  } as const;
};

const rt = WorkspaceSchema();
export type WorkspaceModel = FromSchema<typeof rt>;

registerCollection(
  'Workspace',
  DataType.workspace,
  WorkspaceSchema(),
  [],
  [],
  false,
  false
);
