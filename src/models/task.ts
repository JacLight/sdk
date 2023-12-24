import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType, TaskStatus } from '../types';
import { CollectionUI } from './collection-ui';

export const TaskSchema = () => {
  return {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        readOnly: true,
        fieldType: FieldType.selectionmultiple,
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
        inputStyle: 'textarea',
      },
      stageId: {
        title: 'Stage',
        type: 'number',
        disabled: true,
      },
      note: {
        type: 'string',
        inputStyle: 'textarea',
      },
      resourceType: {
        type: 'string',
        hidden: true,
      },
      resourceId: {
        type: 'string',
        hidden: true,
      },
      assignTo: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
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
