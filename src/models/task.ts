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
        group: 'status',
      },
      status: {
        type: 'string',
        enum: Object.keys(TaskStatus),
        group: 'status',
      },
      description:{
        type: 'string',
      },
      dueDate: {
        type: 'string',
        format: 'date-time',
        group: 'status',
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
        group: 'stage',
      },
      escalationTier: {
        title: 'Escalation Tier',
        type: 'number',
        default: 0,
        readOnly: true,
        group: 'stage',
      },
      completedAt: {
        title: 'Completed',
        type: 'string',
        format: 'date-time',
        readOnly: true,
        description:
          'Stamped when the task transitions to status="done". Used by live ' +
          'queries to show recently-completed tasks within a rolling window.',
        group: 'stage',
      },
      archived: {
        title: 'Archived',
        type: 'boolean',
        default: false,
        description:
          'UI-set flag to hide finished/old tasks from the default active view. ' +
          'Independent of status — preserves the actual outcome (done/canceled/' +
          'rejected). Default queries exclude archived tasks.',
      },
      archivedAt: {
        title: 'Archived At',
        type: 'string',
        format: 'date-time',
        readOnly: true,
        description: 'Stamped when archived flag was set to true.',
      },
      workflowId: {
        type: 'string',
        readOnly: true,
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.workflow_definition,
          value: 'sk',
          label: 'name',
        },
        group: 'stage',
      },
      workflowName: {
        type: 'string',
        readOnly: true,
        group: 'stage',
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
              group: 'status',
            },
            status: {
              type: 'string',
              group: 'status',
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              group: 'status',
            },
            modified: {
              type: 'string',
              format: 'date-time',
              group: 'assign',
            },
            modifiedBy: {
              type: 'string',
              group: 'assign',
            },
            report: {
              type: 'string',
            },
            assignTo: {
              type: 'string',
              group: 'assign',
            },
            note: {
              type: 'string',
            },
          },
        },
      },
      payload: {
        type: 'object',
        readOnly: true,
        collapsible: 'close',
        additionalProperties: true,
      },
    },
  } as const;
};

const ts = TaskSchema();
export type TaskModel = FromSchema<typeof ts>;
registerCollection('Task', DataType.task, TaskSchema());
