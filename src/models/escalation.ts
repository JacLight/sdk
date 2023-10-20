import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const EscalationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: 'uri'
      },
      flow: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.mintflow,
          value: 'sk',
          label: 'name',
        },
      },
      notificationTemplate: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.messagetemplate,
          value: 'sk',
          label: 'name',
        },
      },
      stages: {
        type: 'array',
        showIndex: true,
        rowSort: true,
        items: {
          type: 'object',
          properties: {
            escalateAfter: {
              type: 'number',
            },
            units: {
              type: 'string',
              enum: ['minutes', 'hours', 'days'],
            },
            flow: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.mintflow,
                value: 'sk',
                label: 'name',
              },
            },
            notificationTemplate: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              dataSource: {
                source: 'collection',
                collection: DataType.messagetemplate,
                value: 'sk',
                label: 'name',
              },
            },
            escalateTo: {
              type: 'string',
              fieldType: FieldType.selectionmultiple,
              inputStyle: 'chip',
              dataSource: {
                source: 'collection',
                collection: DataType.user,
                value: 'sk',
                label: 'username',
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
