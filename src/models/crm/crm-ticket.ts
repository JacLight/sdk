import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const TicketSchema = () => {
  return {
    type: 'object',
    properties: {
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
        group: 'assign',
      },
      assignments: {
        type: 'array',
        items: FileInfoSchema(),
      },
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
        enum: ['new', 'open', 'pending', 'inprogress', 'blocked', 'done', 'canceled'],
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
        group: 'customer'
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
    },
    required: ['reportedBy', 'reportedByEmail', 'title', 'description'],
  } as const;
};


const tt = TicketSchema();
export type TicketModel = FromSchema<typeof tt>;

export const TicketRules = (): CollectionRule[] => {
  return null;
};
registerCollection(
  'Ticket',
  DataType.ticket,
  TicketSchema(),
  null,
  null,
  true,
  true
);

const genDefaultData = () => {
  return { status: 'new', priority: 'low', severity: 'minor', stage: 0 };
};
registerDefaultData(DataType.ticket, genDefaultData);
