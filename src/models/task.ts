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
      // What started the task, as `datatype:sk` (a device_event, a form submission, …).
      triggerId: { type: 'string' },
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
            action: {
              type: 'string',
              notes: 'What happened at this stage exit, e.g. approve, reject, reassign. Overrides are marked by override on the entry (or on the approvals / rejections entry).',
            },
            by: {
              type: 'string',
            },
            at: {
              type: 'string',
              format: 'date-time',
            },
            reason: {
              type: 'string',
            },
            override: {
              type: 'boolean',
              notes: 'This stage exit was made by an owner or admin acting for the stage (the reason is in reason).',
            },
          },
        },
      },
      approvals: {
        type: 'object',
        readOnly: true,
        collapsible: 'close',
        notes: 'Approvals given on each stage, keyed by stage id, until the stage\'s required number is reached.',
        additionalProperties: { type: 'array', items: { type: 'object', properties: { by: { type: 'string' }, at: { type: 'string', format: 'date-time' }, note: { type: 'string' }, override: { type: 'boolean', notes: 'Acted on behalf of the stage by an owner or admin who is not one of its people.' }, reason: { type: 'string', notes: 'Why an override was used.' }, force: { type: 'boolean', notes: 'The owner or admin moved the stage on at once instead of counting as one action.' } } } },
      },
      rejections: {
        type: 'object',
        readOnly: true,
        collapsible: 'close',
        notes: 'Rejections given on each stage, keyed by stage id.',
        additionalProperties: { type: 'array', items: { type: 'object', properties: { by: { type: 'string' }, at: { type: 'string', format: 'date-time' }, note: { type: 'string' }, override: { type: 'boolean', notes: 'Acted on behalf of the stage by an owner or admin who is not one of its people.' }, reason: { type: 'string', notes: 'Why an override was used.' }, force: { type: 'boolean', notes: 'The owner or admin moved the stage on at once instead of counting as one action.' } } } },
      },
      payload: {
        type: 'object',
        readOnly: true,
        collapsible: 'close',
        additionalProperties: true,
        properties: {
          openUrl: { type: 'string', notes: 'Where the person the task waits on (payload.subject) acts on it: an absolute address, e.g. their staff portal page. Task emails to them open it; without it they open the task in the admin app.' },
          escalationUrl: { type: 'string', notes: 'Where people an escalation brings in (a manager, HR) act on it. Their task emails open it; without it they open the task in the admin app.' },
        },
      },
    },
  } as const;
};

const ts = TaskSchema();
export type TaskModel = FromSchema<typeof ts>;
registerCollection('Task', DataType.task, TaskSchema());

/**
 * One person's action on a task's stage, as kept in `approvals[stageId]` and
 * `rejections[stageId]`: who, when, their comment, and whether an Owner /
 * ConfigAdmin acted for the stage's people (with the reason). The engine
 * writes it; the Approvals tray and the board read it for "2 of 3 approved".
 */
export interface TaskStageAction {
  by: string;
  at: string;
  note?: string;
  override?: boolean;
  reason?: string;
  force?: boolean;
}

/** Where a stage that needs several of its people stands: shared by the engine's answers and the UI. */
export interface TaskStageProgress {
  stageId: number | string;
  required: number;
  approvedBy: string[];
  waitingOn: string[];
  moved: boolean;
}
