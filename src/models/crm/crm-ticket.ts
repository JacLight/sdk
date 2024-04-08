import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, ControlType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const TicketSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        transform: 'uri',
        readOnly: true
      },
      reportedBy: {
        title: 'Name',
        type: 'string',
      },
      reportedByEmail: {
        title: 'Email',
        type: 'string',
        format: 'email',
      },
      reportedByPhone: {
        title: 'Phone',
        type: 'string',
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
        items: FileInfoSchema(),
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
      },
      severity: {
        type: 'string',
        enum: ['minor', 'major', 'critical', 'catastrophic'],
      },
      channel: {
        type: 'string',
        enum: ['web', 'phone', 'chat', 'mobile', 'api', 'other'],
      },
      status: {
        type: 'string',
        enum: ['new', 'open', 'pending', 'inprogress', 'blocked', 'done', 'canceled'],
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
      },
      assignBy: {
        type: 'string',
      },
      assignments: {
        type: 'array',
        title: 'Assignments',
        readOnly: true,
        collapsible: true,
        items: {
          type: 'object',
          layout: 'horizontal',
          properties: {
            assignedBy: { type: 'string' },
            assignedTo: { type: 'string' },
            assignedTime: { type: 'string' },
          },
        },
      },
    },
  } as const;
};

export const TicketUI = (): CollectionUI[] => {
  return [
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/reportedBy',
          '1': '/properties/reportedByEmail',
          '2': '/properties/reportedByPhone',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/name',
          '1': '/properties/status',
        },
        {
          '0': '/properties/title',
        },
        {
          '0': '/properties/description',
        },
        {
          '0': '/properties/priority',
          '1': '/properties/severity',
          '2': '/properties/channel',
        },
        {
          '0': '/properties/assignTo',
          '1': '/properties/assignBy',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      items: [
        {
          '0': '/properties/files',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      items: [
        {
          '0': '/properties/assignments',
        },
      ],
    },
  ];
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
  TicketUI(),
  TicketRules(),
  true,
  true
);

const genDefaultData = () => {
  return { status: 'new', priority: 'low', severity: 'minor', stage: 0 };
};
registerDefaultData(DataType.ticket, genDefaultData);
