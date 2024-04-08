import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, ControlType, TaskStatus } from '../types';
import { CollectionUI } from './collection-ui';

export const TaskSchema = () => {
  return {
    type: 'object',
    properties: {
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
      },
      status: {
        type: 'string',
        enum: Object.values(TaskStatus),
        group: 'status'
      },
      name: {
        group: 'status',
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      stageId: {
        title: 'Stage',
        type: 'number',
        disabled: true,
      },
      note: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      assignTo: {
        type: 'array',
        'x-control': ControlType.selectMany,
        hideLabel: true,
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getAssignToOptions',
        },
      },
    },
  } as const;
};


export const TaskUI = (): CollectionUI[] => {
  return null;
};

const ts = TaskSchema();
export type TaskModel = FromSchema<typeof ts>;
registerCollection('Task', DataType.task, TaskSchema(), TaskUI(), null);
