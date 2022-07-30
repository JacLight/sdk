import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const TicketSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      priority: {
        type: 'string',
      },
      severity: {
        type: 'string',
      },
      fromName: {
        type: 'string',
      },
      fromTicket: {
        type: 'string',
      },
      ticketType: {
        type: 'string',
      },
      channel: {
        type: 'string',
      },
      stage: {
        type: 'string',
      },
      remarks: { type: 'string' },
      status: { type: 'string' },
      tasks: {
        type: 'array',
        hidden: true,
        items: {
          properties: {
            taskType: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string' },
            comments: {
              type: 'object',
              hidden: true
            },
          }
        }
      },
      comments: {
        type: 'object',
        hidden: true
      },
      assignTo: {
        type: 'string'
      },
      assignBy: {
        type: 'string'
      },
      reportedBy: {
        type: 'string'
      },
      assignments: {
        type: 'array',
        items: {
          type: 'object',
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
registerCollection('Ticket', DataType.ticket, TicketSchema(), TicketUI(), TicketRules(), true)
