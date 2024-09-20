import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../default-schema';
import { DataType, ControlType, WorkflowStageTypes } from '../types';
import { CollectionUI } from './collection-ui';
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
        group: 'sla',
      },
      notificationTemplate: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
        group: 'sla',
      },
      startFlow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.mintflow,
          value: 'name',
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
          value: 'name',
          label: 'name',
        },
        group: 'flow'
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

export const WorkflowStageSchema = () => {
  return {
    type: 'object',
    collapsible: true,
    showIndex: true,
    properties: {
      id: {
        type: ['string', 'number'],
        'x-control': ControlType.uuid,
        readOnly: true
      },
      type: {
        type: 'string',
        enum: WorkflowStageTypes,
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
      escalation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.escalation,
          value: 'name',
          label: 'name',
        },
        group: 'escalation'
      },
      flow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.mintflow,
          value: 'name',
          label: 'name',
        },
        group: 'escalation'
      },
      notificationTemplate: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'name',
          label: 'name',
        },
        items: {
          type: 'string',
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
const genDefaultData = () => {
  return {
    stages: [
      { id: 0, type: 'start', name: 'To Do', modelState: ModelState.new },
      { id: 0, type: 'intermediate', name: 'In Progress', modelState: ModelState.inprogress },
      { id: 1, type: 'end', name: 'Done', modelState: ModelState.completed }
    ]
  }
};

export const WorkflowDefinitionUI = (): CollectionUI[] => { return null };
const wfd = WorkflowDefinitionSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
registerCollection('WorkflowDefinition', DataType.workflowdefinition, WorkflowDefinitionSchema(), null, null)
registerDefaultData(DataType.workflowdefinition, genDefaultData)