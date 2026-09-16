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
      enabled: {
        type: 'boolean',
        default: false,
        title: 'Enabled',
        notes: 'Off by default: nothing starts on this workflow (not on create, not on request) until an admin turns it on. Tasks already open keep going. The platform turns on the ones it needs (access requests) when it seeds them.',
        group: 'sla',
      },
      autoFire: {
        type: 'boolean',
        default: true,
        title: 'Start on create',
        description: 'When on, every new record of a listed collection gets a task on this workflow automatically. Turn off for workflows a service starts on purpose (a leave request is fired at submit, not at draft) — the collections list then only says whose status this workflow mirrors.',
        group: 'sla',
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
      assignRule: {
        type: 'object',
        collapsible: 'close',
        notes: 'Who decides at this stage, worked out per record when the stage is entered. Wins over assignTo when set. Roles is the usual choice: anyone holding the role sees it, first to decide decides.',
        properties: {
          type: { type: 'string', enum: ['roles', 'group', 'users', 'relative', 'field'], default: 'roles', group: 'rule' },
          roles: { type: 'array', items: { type: 'string' }, 'x-control': ControlType.selectMany, 'x-control-variant': 'chip', group: 'rule' },
          group: { type: 'string', group: 'rule' },
          users: { type: 'array', items: { type: 'string' }, notes: 'Emails.' },
          relative: { type: 'string', enum: ['supervisor', 'manager', 'department-head', 'location-manager'], notes: 'Relative to the requester, from the employee record.' },
          field: { type: 'string', notes: 'A path on the record holding an email, e.g. data.owner.email.' },
          mode: { type: 'string', enum: ['any', 'all'], default: 'any', notes: 'any = first decision wins; all = everyone must approve.' },
          fallbackRoles: { type: 'array', items: { type: 'string' }, notes: 'Used when the rule finds nobody (a relative rule in an org without employees).' },
        },
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
