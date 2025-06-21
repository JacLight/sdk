import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';



export const EscalationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri',
        group: 'name',
      },
      status: {
        type: 'string',
        enum: ['new', 'active', 'inactive'],
        group: 'name',
      },
      stages: {
        type: 'array',
        collapsible: 'close',
        showIndex: true,
        rowSort: true,
        items: {
          type: 'object',
          showIndex: true,
          properties: {
            escalateAfter: {
              type: 'number',
              group: 'units',
              default: 4,
            },
            units: {
              type: 'string',
              enum: ['minutes', 'hours', 'days'],
              default: 'hours',
              group: 'units',
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
              group: 'flow',
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
              group: 'flow',
            },
            escalateTo: {
              type: 'array',
              'x-control': ControlType.selectMany,
              'x-control-variant': 'chip',
              items: {
                type: 'string',
              },
              dataSource: {
                source: 'function',
                value: 'getUserRecipients',
              },
            },
          },
        },
      },
    },
  } as const;
};

export const EscalationRules = (): CollectionRule[] => {
  return [];
};

export const EscalationUI = (): CollectionUI[] => {
  return null;
};

const ts = EscalationSchema();
export type EscalationModel = FromSchema<typeof ts>;
registerCollection(
  'Escalation',
  DataType.escalation,
  EscalationSchema(),
  EscalationUI(),
  EscalationRules()
);
