import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const TicketSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::10', 'uri'],
        group: 'status',
        title: 'Ticket ID',
      },
      status: {
        type: 'string',
        enum: [
          'new',
          'open',
          'pending',
          'inprogress',
          'blocked',
          'done',
          'canceled',
        ],
        group: 'status',
      },
      reportedBy: {
        title: 'Name',
        type: 'string',
        group: 'customer',
      },
      reportedByEmail: {
        title: 'Email',
        type: 'string',
        format: 'email',
        group: 'customer',
        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
      },
      reportedByPhone: {
        title: 'Phone',
        type: 'string',
        group: 'customer',
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        rows: 4,
      },
      files: {
        type: 'array',
        'x-control': ControlType.file,
        collapsible: true,
        items: FileInfoSchema(),
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
        group: 'priority',
      },
      severity: {
        type: 'string',
        enum: ['minor', 'major', 'critical', 'catastrophic'],
        group: 'priority',
      },
      channel: {
        type: 'string',
        enum: ['web', 'phone', 'chat', 'mobile', 'api', 'other'],
        group: 'priority',
      },
      assignTo: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'username',
          label: ['email', 'username'],
        },
        group: 'assign',
      },
      assignBy: {
        type: 'string',
        readOnly: true,
        group: 'assign',
      },
      assignments: {
        type: 'array',
        items: FileInfoSchema(),
      },
      // Ticket resolution details
      resolution: {
        type: 'object',
        collapsible: 'close',
        properties: {
          summary: {
            type: 'string',
            'x-control-variant': 'textarea',
            rows: 3,
          },
          rootCause: {
            type: 'string',
            'x-control-variant': 'textarea',
            rows: 2,
          },
          resolvedBy: {
            type: 'string',
            readOnly: true,
          },
        },
      },
    },
    required: ['reportedBy', 'reportedByEmail', 'title', 'description'],
  } as const;
};

const tt = TicketSchema();
export type TicketModel = FromSchema<typeof tt>;

registerCollection('Ticket', DataType.ticket, TicketSchema());

