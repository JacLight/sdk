import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const LeadSchema = () => {
  return {
    type: "object",
    properties: {
      // Core Identity Fields
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      fullName: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        title: 'Full Name (Display)',
        group: 'identity',
      },
      firstName: {
        type: "string",
        maxLength: 50,
        title: 'First Name',
        group: 'identity',
      },
      lastName: {
        type: "string",
        maxLength: 50,
        title: 'Last Name',
        group: 'identity',
      },
      
      // Contact Information
      email: {
        type: "string",
        format: "email",
        title: 'Email Address',
        group: 'contact',
      },
      phone: {
        type: "string",
        title: 'Phone Number',
        group: 'contact',
      },
      company: {
        type: "string",
        maxLength: 100,
        title: 'Company',
        group: 'contact',
      },
      title: {
        type: "string",
        maxLength: 100,
        title: 'Job Title',
        group: 'contact',
      },
      jobTitle: {
        type: "string",
        maxLength: 100,
        title: 'Position',
        group: 'contact',
      },
      
      // Pipeline & Stage
      pipelineId: {
        type: "string",
        title: 'Pipeline',
        group: 'pipeline',
        default: 'default'
      },
      stageId: {
        type: "string",
        title: 'Stage',
        group: 'pipeline',
        default: 'new'
      },
      stage: {
        type: "string",
        enum: ["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"],
        group: 'pipeline',
        title: 'Stage Status'
      },
      
      // Lead Details
      source: {
        type: "string",
        enum: ["website", "referral", "social_media", "email", "phone", "event", "partner", "other"],
        group: 'details',
        title: 'Lead Source'
      },
      sourceDetails: {
        type: "string",
        maxLength: 200,
        group: 'details',
        title: 'Source Details'
      },
      status: {
        type: "string",
        enum: ["new", "contacted", "qualified", "unqualified", "disqualified", "converted", "lost", "nurturing", "follow_up"],
        group: 'details',
        title: 'Lead Status',
        default: 'new'
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high", "urgent"],
        group: 'details',
        title: 'Priority'
      },
      temperature: {
        type: "string",
        enum: ["cold", "warm", "hot"],
        group: 'details',
        title: 'Temperature',
        default: 'warm'
      },
      
      // Value & Scoring
      value: {
        type: "number",
        minimum: 0,
        group: 'scoring',
        title: 'Deal Value',
        default: 0
      },
      score: {
        type: "integer",
        minimum: 0,
        maximum: 100,
        group: 'scoring',
        title: 'Lead Score',
        default: 0
      },
      probability: {
        type: "number",
        minimum: 0,
        maximum: 100,
        group: 'scoring',
        title: 'Win Probability'
      },
      currency: {
        type: "string",
        enum: ["USD", "EUR", "GBP", "CAD", "AUD"],
        group: 'scoring',
        title: 'Currency',
        default: 'USD'
      },
      
      // Assignment & Ownership
      assignedTo: {
        type: "string",
        group: 'assignment',
        title: 'Assigned To'
      },
      assignedBy: {
        type: "string",
        group: 'assignment',
        title: 'Assigned By'
      },
      ownerId: {
        type: "string",
        group: 'assignment',
        title: 'Owner ID'
      },
      ownerName: {
        type: "string",
        group: 'assignment',
        title: 'Owner Name'
      },
      
      // Dates
      expectedCloseDate: {
        type: "string",
        format: "date",
        group: 'dates',
        title: 'Expected Close Date'
      },
      lastContactDate: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Last Contact'
      },
      nextFollowUpDate: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Next Follow Up'
      },
      convertedDate: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Converted Date'
      },
      qualifiedDate: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Qualified Date'
      },
      stageChangedAt: {
        type: "string",
        format: "date-time",
        group: 'dates',
        title: 'Stage Changed At'
      },
      
      // Additional Information
      description: {
        type: "string",
        'x-control-variant': 'textarea',
        title: 'Description',
        group: 'additional'
      },
      notes: {
        type: "string",
        'x-control-variant': 'textarea',
        title: 'Notes',
        group: 'additional'
      },
      tags: {
        type: "array",
        title: "Tags",
        group: 'additional',
        'x-control-variant': 'chip',
        items: {
          type: "string"
        },
      },
      products: {
        type: "array",
        title: "Products/Services",
        group: 'additional',
        collapsible: true,
        showIndex: true,
        items: {
          hideLabel: true,
          type: "string"
        },
      },
      
      // Enrichment & Custom Fields
      customFields: {
        type: "object",
        title: "Custom Fields",
        group: 'custom',
        additionalProperties: true
      },
      enrichment: {
        type: "object",
        title: "Enrichment Data",
        group: 'custom',
        properties: {
          enrichedAt: {
            type: "string",
            format: "date-time"
          },
          source: {
            type: "string"
          },
          data: {
            type: "object",
            additionalProperties: true
          }
        }
      },
      
      // Flags
      isHot: {
        type: "boolean",
        title: "Hot Lead",
        group: 'flags',
        default: false
      },
      isStale: {
        type: "boolean",
        title: "Stale Lead",
        group: 'flags',
        default: false
      },
      isArchived: {
        type: "boolean",
        title: "Archived",
        group: 'flags',
        default: false
      },
      isDuplicate: {
        type: "boolean",
        title: "Potential Duplicate",
        group: 'flags',
        default: false
      },
      
      // Activity Tracking
      activities: {
        type: "array",
        title: "Activities",
        group: 'activity',
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["call", "email", "meeting", "task", "note"]
            },
            description: {
              type: "string"
            },
            date: {
              type: "string",
              format: "date-time"
            },
            createdBy: {
              type: "string"
            }
          }
        }
      },
      
      // Legacy contacts field for backward compatibility
      contacts: {
        type: "array",
        title: "Related Contacts",
        group: 'legacy',
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
    },
    required: ["name", "email", "source", "status", "pipelineId", "stageId"]
  } as const
};


export const LeadPipelineSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
        group: 'identity',
      },
      description: {
        type: 'string',
        'x-control': 'textarea',
        group: 'identity',
      },
      stages: {
        type: 'array',
        title: 'Stages',
        group: 'stages',
        collapsible: true,
        showIndex: true,
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              pattern: '^[a-zA-Z_\\-0-9]*$',
              transform: ['random-string::10'],
            },
            name: {
              type: 'string',
              minLength: 1,
              maxLength: 100,
            },
            probability: {
              type: 'number',
              minimum: 0,
              maximum: 100,
              default: 0,
            },
            isWon: {
              type: 'boolean',
              default: false,
            },
            isLost: {
              type: 'boolean',
              default: false,
            },
            order: {
              type: 'number',
            },
          },
        },
      },
    },
    required: ['name', 'stages'],
  } as const;
}


const ms = LeadSchema();
export type LeadModel = FromSchema<typeof ms>;

const ps = LeadPipelineSchema();
export type LeadPipelineModel = FromSchema<typeof ps>;

registerCollection(
  'lead',
  DataType.lead,
  LeadSchema(),
);

registerCollection(
  'leadPipeline',
  DataType.lead_pipeline,
  LeadPipelineSchema(),
);