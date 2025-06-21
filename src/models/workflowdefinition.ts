import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../default-schema';
import { DataType, ControlType, WorkflowStageTypes, TaskStatus } from '../types';

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
      sla: {
        type: 'string',
        title: 'SLA',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.escalation,
          value: 'sk',
          label: 'name',
        },
        group: 'flow',
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
      collections: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          label: 'name',
          value: 'name',
        },
        items: {
          type: 'string',
        }
      }
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
      name: {
        type: 'string',
        group: 'name',
      },
      type: {
        type: 'string',
        enum: Object.keys(WorkflowStageTypes).filter(k => isNaN(Number(k))),
        group: 'name',
      },
      modelState: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: Object.values(ModelState),
        },
        default: ModelState.inprogress,
        group: 'type',
      },
      modelStatus: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: Object.keys(TaskStatus).filter(k => isNaN(Number(k))),
        },
        default: ModelState.inprogress,
        group: 'type',
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
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getAssignToOptions',
        },
      },
      inputs: {
        type: 'array',
        collapsible: 'close',
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            name: {
              type: 'string',
            },
            type: {
              type: 'string',
              enum: ['string', 'number', 'boolean', 'date', 'date-time', 'time'],
            },
            required: {
              type: 'boolean',
            },
          }
        }
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

const wfd = WorkflowDefinitionSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
registerCollection(
  'WorkflowDefinition',
  DataType.workflowdefinition,
  WorkflowDefinitionSchema()
);
registerDefaultData(DataType.workflowdefinition, genDefaultData)