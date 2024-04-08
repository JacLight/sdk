import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../defaultschema';
import { DataType, ControlType, WorkflowStatus } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { TaskSchema } from './task';
import { ModelState } from './base.model';

export const WorkflowDefinitionSchema = () => {
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
      title: {
        group: 'title',
        type: 'string',
      },
      description: {
        type: 'string',
      },
      startModelState: {
        type: 'string',
        enum: Object.values(ModelState),
        group: 'modelState',
        default: 'new'
      },
      endModelState: {
        type: 'string',
        enum: Object.values(ModelState),
        group: 'modelState',
        default: 'completed'
      },
      sla: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.escalation,
          value: 'sk',
          label: 'name',
        },
      },
      notificationTemplate: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'sk',
          label: 'name',
        },
      },
      startFlow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.mintflow,
          value: 'sk',
          label: 'name',
        },
        group: 'flow'
      },
      endFlow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.mintflow,
          value: 'sk',
          label: 'name',
        },
        group: 'flow'
      },
      tasks: {
        type: 'array',
        collapsible: true,
        minItems: 1,
        items: TaskSchema()
      },
      stages: {
        type: 'array',
        collapsible: true,
        minItems: 2,
        items: WorkflowStageSchema(),
      },
    },
    required: ['name', 'stages']
  } as const;
};

export const WorkflowDefinitionRules = (): CollectionRule[] => {
  return [
    {
      name: 'Actor Type',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/stages/items/properties/assignTo/dataSource/collection',
          sourceField: '/properties/stages/items/properties/assignType',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/stages/items/properties/assignType',
            operation: 'notEmpty',
          },
        ],
      },
    },
    {
      name: 'Task Action',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/tasks/items/properties/assignTo/dataSource/collection',
          sourceField: '/properties/tasks/items/properties/assignType',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/tasks/items/properties/assignType',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ]
};


export const WorkflowStageSchema = () => {
  return {
    type: 'object',
    properties: {
      id: {
        type: ['string', 'number'],
        'x-control': ControlType.uuid,
        readOnly: true
      },
      type: {
        type: 'string',
        enum: ['start', 'intermediate', 'end'],
        group: 'type',
      },
      modelState: {
        type: 'string',
        enum: Object.values(ModelState),
        default: ModelState.inprogress,
        group: 'type',
      },
      name: {
        type: 'string',
        group: 'name',
      },
      event: {
        type: 'string',
        group: 'name',
      },
      sla: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.escalation,
          value: 'sk',
          label: 'name',
        },
        group: 'sla'
      },
      flow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.mintflow,
          value: 'sk',
          label: 'name',
        },
        group: 'sla'
      },
      notificationTemplate: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'sk',
          label: 'name',
        },
        group: 'sla'
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
      items: {
        type: 'array',
        collapsible: true,
        hidden: true,
      },
    },
  } as const;
};

export const WorkflowSubSchema = () => {
  return {
    type: 'object',
    properties: {
      workflowId: {
        type: 'string',
        title: 'Workflow',
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
        disabled: true,
        enum: Object.values(WorkflowStatus),
        default: 'new'
      },
      note: {
        type: 'string'
      },
      tasks: {
        type: 'array',
        items: TaskSchema(),
        displayStyle: 'table',
        readOnly: true,
      },
    },
  } as const;
};

export const WorkflowStageRules = (): CollectionRule[] => {
  return [
    {
      name: 'Actor Type',
      action: [
        {
          operation: 'setProperty',
          targetField: '/properties/assignTo/dataSource/collection',
          sourceField: '/properties/assignType',
        },
      ],
      condition: {
        type: 'and',
        param: [
          {
            value: true,
            field1: '/properties/assignType',
            operation: 'notEmpty',
          },
        ],
      },
    },
  ]
};

const genDefaultData = () => {
  return {
    tasks: [
      { status: 'new', name: 'Check Stock', description: 'Check if item is in stock', stageId: 0 },
    ],
    stages: [
      { id: 0, type: 'start', name: 'To Do', modelState: ModelState.new },
      { id: 0, type: 'intermediate', name: 'In Progress', modelState: ModelState.inprogress },
      { id: 1, type: 'end', name: 'Done', modelState: ModelState.completed }
    ]
  }
};

export const WorkflowDefinitionUI = (): CollectionUI[] => { return null };

const wfd = WorkflowDefinitionSchema();
const wfe = WorkflowSubSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
export type WorkflowSubModel = FromSchema<typeof wfe>;
registerCollection('WorkflowDefinition', DataType.workflowdefinition, WorkflowDefinitionSchema(), WorkflowDefinitionUI(), WorkflowDefinitionRules())
registerDefaultData(DataType.workflowdefinition, genDefaultData)