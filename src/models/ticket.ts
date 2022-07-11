import { FromSchema } from 'json-schema-to-ts';

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
      fromAddress: {
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