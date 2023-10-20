import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui';
import { DataType, FieldType, FormViewSectionType } from '../../types';
import { FileInfoSchema } from '..';

export const TicketSchema = () => {
  return {
    type: 'object',
    properties: {
      reportedBy: {
        title: 'Name',
        type: 'string',
        hidden: true,
      },
      reportedByEmail: {
        title: 'Email',
        type: 'string',
        format: 'email',
        hidden: true,
      },
      reportedByPhone: {
        title: 'Phone',
        type: 'string',
        hidden: true,
      },
      title: {
        type: 'string',
      },
      story: {
        type: 'string',
        inputStyle: 'textarea',
        rows: 4,
      },
      files: {
        type: 'array',
        fieldType: FieldType.file,
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
      stage: {
        type: 'string',
        hidden: true,
      },
      status: {
        type: 'string',
        enum: ['new', 'pending', 'inprogress', 'blocked', 'done', 'canceled'],
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
        hidden: true,
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
      type: FormViewSectionType.section1column,
      default: true,
      collapsible: true,
    },
    {
      type: FormViewSectionType.section2column,
      items: [
        {
          '0': '/properties/title',
        },
        {
          '0': '/properties/story',
        },
        {
          '0': '/properties/files',
        },
        {
          '0': '/properties/stage',
          '1': '/properties/status',
        },
      ],
    },
    {
      type: FormViewSectionType.section2column,
      collapsible: true,
      items: [
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
