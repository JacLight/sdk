import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType, TaskStatus } from '../types';


export const TaskSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: ['random-string::10', 'uri'],
        group: 'status'
      },
      status: {
        type: 'string',
        enum: Object.keys(TaskStatus),
        group: 'status'
      },
      dueDate: {
        type: 'string',
        format: 'date-time',
        group: 'status'
      },
      title: {
        type: 'string',
      },
      note: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      stageId: {
        title: 'Stage',
        type: 'number',
        disabled: true,
        group: 'stage'
      },
      workflowId: {
        type: 'string',
        readOnly: true,
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.workflowdefinition,
          value: 'sk',
          label: 'name',
        },
        group: 'stage'
      },
      workflowName: {
        type: 'string',
        readOnly: true,
        group: 'stage'
      },
      assignTo: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getAssignToOptions',
        },
      },
      assignedBy: {
        type: 'string',
        group: 'assign',
        readOnly: true,
      },
      history: {
        type: 'array',
        collapsible: 'close',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            stageId: {
              type: 'number',
              group: 'status'
            },
            status: {
              type: 'string',
              group: 'status'
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              group: 'status'
            },
            modified: {
              type: 'string',
              format: 'date-time',
              group: 'assign'
            },
            modifiedBy: {
              type: 'string',
              group: 'assign'
            },
            assignTo: {
              type: 'string',
              group: 'assign'
            },
            note: {
              type: 'string',
            },
          }
        }
      },
    },
  } as const;
};



const ts = TaskSchema();
export type TaskModel = FromSchema<typeof ts>;
registerCollection(
  'Task',
  DataType.task,
  TaskSchema()
)
