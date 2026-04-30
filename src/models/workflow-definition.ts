import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import {
  DataType,
  ControlType,
  WorkflowStageTypes,
  TaskStatus,
} from '../types';

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
        },
      },
    },
    required: ['name', 'stages'],
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
        readOnly: true,
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
        group: 'assignTo',
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
        group: 'assignTo',
      },
      escalations: {
        type: 'array',
        title: 'SLA Escalation Tiers',
        description:
          'Multi-tier SLA. Each tier fires after its escalateAfter+units elapse on the stage. ' +
          'Tier 0 sets the initial dueDate; tier N is reached after tiers 0..N-1 have all fired.',
        collapsible: 'close',
        showIndex: true,
        rowSort: true,
        items: {
          type: 'object',
          properties: {
            escalateAfter: {
              type: 'number',
              default: 4,
              group: 'units',
            },
            units: {
              type: 'string',
              enum: ['minutes', 'hours', 'days'],
              default: 'hours',
              group: 'units',
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
              items: { type: 'string' },
            },
            escalateTo: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              items: { type: 'string' },
              dataSource: {
                source: 'function',
                value: 'getUserRecipients',
              },
            },
          },
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
              enum: [
                'string',
                'number',
                'boolean',
                'date',
                'date-time',
                'time',
              ],
            },
            required: {
              type: 'boolean',
            },
          },
        },
      },
    },
  } as const;
};

const wfd = WorkflowDefinitionSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
registerCollection(
  'WorkflowDefinition',
  DataType.workflow_definition,
  WorkflowDefinitionSchema()
);
