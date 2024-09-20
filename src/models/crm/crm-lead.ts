import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const LeadSchema = () => {
  return {
    type: "object",
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::10', 'uri'],
        group: 'stage',
        title: 'Lead ID',
      },
      stage: {
        type: "string",
        enum: ["Qualification", "Initial Contact", "Proposal Sent", "Negotiation", "Pending", "Closed Won", "Closed Lost"],
        group: 'stage',
      },
      contacts: {
        type: "array",
        'x-control-variant': 'chip',
        'x-control': 'selectMany',
        items: {
          type: 'string',
        },
        dataSource: {
          source: 'function',
          value: 'getMessageRecipients',
        },
      },
      expectedCloseDate: {
        type: "string",
        format: "date",
        group: 'source',
      },
      source: {
        type: "string",
        enum: ["Website", "Referral", "Social Media", "Email Campaign", "Event", "Other"],
        group: 'source'
      },
      status: {
        type: "string",
        enum: ["New", "Contacted", "Qualified", "Proposal Sent", "Negotiation", "Pending", "Closed Won", "Closed Lost"],
        group: 'source'
      },
      value: {
        type: "number",
        minimum: 0,
        group: 'score'
      },
      score: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        group: 'score'
      },
      description: {
        type: "string",
        'x-control-variant': 'textarea',
      },
      products: {
        type: "array",
        title: "Products/Services",
        collapsible: true,
        showIndex: true,
        items: {
          hideLabel: true,
          type: "string"
        },
      },
    },
    required: ["contacts", "source", "status", "value"]
  } as const
};
const ms = LeadSchema();
export type LeadModel = FromSchema<typeof ms>;

registerCollection(
  'lead',
  DataType.lead,
  LeadSchema(),
  null,
  null,
  true
);
