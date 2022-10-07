import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType, FieldType } from '../../types';

export const TicketSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      story: { type: 'string', inputStyle: 'textarea' },
      priority: {
        type: 'string',
      },
      severity: {
        type: 'string',
      },
      channel: {
        type: 'string',
        enum: ['web', 'phone', 'chat', 'mobile', 'api', 'other']
      },
      stage: {
        type: 'string',
        hidden: true
      },
      status: {
        type: 'string',
        enum: ['new', 'pending', 'inprogress', 'blocked', 'done', 'canceled']
      },
      assignTo: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'sk',
          label: 'email',
        },
      },
      assignBy: {
        type: 'string',
        hidden: true
      },
      reportedBy: {
        type: 'string',
        disabled: true
      },
      assignments: {
        type: 'array',
        title: 'Assignments',
        readonly: true,
        collapsible: true,
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            assignedBy: { type: 'string' },
            assignedTo: { type: 'string' },
            assignedTime: { type: 'string' },
          },
        }
      },

    },
  } as const;
};

const tt = TicketSchema();
export type TicketModel = FromSchema<typeof tt>;

export const TicketUI = (): CollectionUI[] => { return null };
export const TicketRules = (): CollectionRule[] => { return null };
registerCollection('Ticket', DataType.ticket, TicketSchema(), TicketUI(), TicketRules(), true, true)
