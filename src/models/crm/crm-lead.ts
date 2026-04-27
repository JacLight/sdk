import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const LeadSchema = () => {
  return {
    type: 'object',
    properties: {
      // Core Identity Fields
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      fullName: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        title: 'Full Name (Display)',
        group: 'identity',
      },
      firstName: {
        type: 'string',
        maxLength: 50,
        title: 'First Name',
        group: 'identity',
      },
      lastName: {
        type: 'string',
        maxLength: 50,
        title: 'Last Name',
        group: 'identity',
      },

      // Contact Information
      email: {
        type: 'string',
        format: 'email',
        title: 'Email Address',
        group: 'contact',
      },
      phone: {
        type: 'string',
        title: 'Phone Number',
        group: 'contact',
      },
      company: {
        type: 'string',
        maxLength: 100,
        title: 'Company',
        group: 'contact',
      },
      title: {
        type: 'string',
        maxLength: 100,
        title: 'Job Title',
        group: 'contact',
      },
      jobTitle: {
        type: 'string',
        maxLength: 100,
        title: 'Position',
        group: 'contact',
      },

      // Pipeline & Stage
      pipelineId: {
        type: 'string',
        title: 'Pipeline',
        group: 'pipeline',
        default: 'default',
      },
      stageId: {
        type: 'string',
        title: 'Stage',
        group: 'pipeline',
        default: 'new',
      },
      stage: {
        type: 'string',
        enum: [
          'new',
          'contacted',
          'qualified',
          'proposal',
          'negotiation',
          'won',
          'lost',
        ],
        group: 'pipeline',
        title: 'Stage Status',
      },

      // Lead Details
      source: {
        type: 'string',
        enum: [
          'website',
          'referral',
          'facebook',
          'linkedin',
          'instagram',
          'tiktok',
          'social_media',
          'email',
          'phone',
          'event',
          'partner',
          'other',
        ],
        group: 'source',
      },
      sourceId: {
        type: 'string',
        group: 'source',
      },
      sourceDetails: {
        type: 'string',
        maxLength: 200,
        group: 'details',
      },
      status: {
        type: 'string',
        enum: [
          'new',
          'contacted',
          'qualified',
          'unqualified',
          'disqualified',
          'converted',
          'lost',
          'nurturing',
          'follow_up',
        ],
        group: 'details',
        title: 'Lead Status',
        default: 'new',
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
        group: 'details',
        title: 'Priority',
      },
      temperature: {
        type: 'string',
        enum: ['cold', 'warm', 'hot'],
        group: 'details',
        title: 'Temperature',
        default: 'warm',
      },

      // Value & Scoring
      value: {
        type: 'number',
        minimum: 0,
        group: 'scoring',
        title: 'Deal Value',
        default: 0,
      },
      score: {
        type: 'integer',
        minimum: 0,
        maximum: 100,
        group: 'scoring',
        title: 'Lead Score',
        default: 0,
      },
      probability: {
        type: 'number',
        minimum: 0,
        maximum: 100,
        group: 'scoring',
        title: 'Win Probability',
      },
      currency: {
        type: 'string',
        enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
        group: 'scoring',
        title: 'Currency',
        default: 'USD',
      },

      // Assignment & Ownership — can be a user OR a user group (team)
      assignedTo: {
        type: 'string',
        group: 'assignment',
        title: 'Assigned To',
        description: 'User name/sk OR user group name/sk (see assignedToType)',
      },
      assignedToType: {
        type: 'string',
        enum: ['user', 'group'],
        default: 'user',
        group: 'assignment',
        title: 'Assignment Type',
        description: 'Whether assignedTo refers to an individual user or a user group (team collective)',
      },
      assignedBy: {
        type: 'string',
        group: 'assignment',
        title: 'Assigned By',
      },

      // Dates
      expectedCloseDate: {
        type: 'string',
        format: 'date',
        group: 'dates',
        title: 'Expected Close Date',
      },
      lastContactDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
        title: 'Last Contact',
      },
      nextFollowUpDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
        title: 'Next Follow Up',
      },
      convertedDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
        title: 'Converted Date',
      },
      qualifiedDate: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
        title: 'Qualified Date',
      },
      stageChangedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
        title: 'Stage Changed At',
      },

      // Additional Information
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Description',
        group: 'additional',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Notes',
        group: 'additional',
      },
      tags: {
        type: 'array',
        title: 'Tags',
        group: 'additional',
        'x-control-variant': 'chip',
        items: {
          type: 'string',
        },
      },
      products: {
        type: 'array',
        title: 'Products/Services',
        group: 'additional',
        collapsible: true,
        showIndex: true,
        items: {
          hideLabel: true,
          type: 'string',
        },
      },

      // Enrichment & Custom Fields
      customFields: {
        type: 'object',
        title: 'Custom Fields',
        group: 'custom',
        additionalProperties: true,
      },
      enrichment: {
        type: 'object',
        title: 'Enrichment Data',
        group: 'custom',
        properties: {
          enrichedAt: {
            type: 'string',
            format: 'date-time',
          },
          source: {
            type: 'string',
          },
          data: {
            type: 'object',
            additionalProperties: true,
          },
        },
      },

      // Flags
      isHot: {
        type: 'boolean',
        title: 'Hot Lead',
        group: 'flags',
        default: false,
      },
      isStale: {
        type: 'boolean',
        title: 'Stale Lead',
        group: 'flags',
        default: false,
      },
      isArchived: {
        type: 'boolean',
        title: 'Archived',
        group: 'flags',
        default: false,
      },
      isDuplicate: {
        type: 'boolean',
        title: 'Potential Duplicate',
        group: 'flags',
        default: false,
      },

      // Activity Tracking
      activities: {
        type: 'array',
        title: 'Activities',
        group: 'activity',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['call', 'email', 'meeting', 'task', 'note'],
            },
            description: {
              type: 'string',
            },
            date: {
              type: 'string',
              format: 'date-time',
            },
            createdBy: {
              type: 'string',
            },
          },
        },
      },

      // Legacy contacts field for backward compatibility
      contacts: {
        type: 'array',
        title: 'Related Contacts',
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
    required: ['name', 'email', 'source', 'status', 'pipelineId', 'stageId'],
  } as const;
};

export const LeadPipelineSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        title: 'Pipeline Name',
        group: 'core',
      },
      description: {
        type: 'string',
        maxLength: 500,
        title: 'Description',
        group: 'core',
        'x-control-variant': 'textarea',
      },
      color: {
        type: 'string',
        title: 'Pipeline Color',
        group: 'core',
      },
      icon: {
        type: 'string',
        title: 'Pipeline Icon',
        group: 'core',
        default: 'GitBranch',
      },
      isActive: {
        type: 'boolean',
        title: 'Active',
        group: 'core',
        default: true,
      },
      isDefault: {
        type: 'boolean',
        title: 'Default Pipeline',
        group: 'core',
        default: false,
      },
      stages: {
        type: 'array',
        title: 'Pipeline Stages',
        group: 'stages',
        minItems: 1,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', pattern: '^[a-zA-Z_\\-0-9]*$', transform: ['random-string::10'] },
            name: { type: 'string', minLength: 1, maxLength: 100 },
            description: { type: 'string', maxLength: 200 },
            color: { type: 'string' },
            order: { type: 'integer', minimum: 0 },
            probability: { type: 'number', minimum: 0, maximum: 100 },
            isWon: { type: 'boolean', default: false },
            isLost: { type: 'boolean', default: false },
            allowSkip: { type: 'boolean', default: true },
            requireComment: { type: 'boolean', default: false },
            automationTriggers: {
              type: 'array',
              items: { type: 'string', enum: ['on_enter', 'on_exit', 'on_stay_duration', 'on_activity'] },
            },
            sla: {
              type: 'object',
              properties: {
                duration: { type: 'integer', minimum: 1 },
                action: { type: 'string', enum: ['notify', 'escalate', 'auto_move', 'create_task'] },
              },
            },
            requirements: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  validation: { type: 'string', enum: ['required', 'email', 'phone', 'url', 'number', 'custom'] },
                },
              },
            },
          },
          required: ['id', 'name', 'order'],
        },
      },
      settings: {
        type: 'object',
        title: 'Pipeline Settings',
        group: 'settings',
        properties: {
          autoAssignment: { type: 'boolean', default: false },
          assignmentMethod: { type: 'string', enum: ['round_robin', 'load_balanced', 'territory', 'skill_based', 'manual'], default: 'round_robin' },
          duplicateCheck: { type: 'boolean', default: true },
          duplicateCriteria: { type: 'array', items: { type: 'string', enum: ['email', 'phone', 'company', 'name'] }, default: ['email'] },
          leadScoring: { type: 'boolean', default: true },
          scoringModel: { type: 'string', enum: ['basic', 'behavioral', 'predictive', 'custom'], default: 'basic' },
          rottenLeadDays: { type: 'integer', minimum: 1, default: 30 },
          rottenLeadHandling: { type: 'string', enum: ['notify', 'auto_move', 'archive', 'ignore'], default: 'notify' },
          allowSkipStages: { type: 'boolean', default: true },
          requireStageComments: { type: 'boolean', default: false },
          workingHours: {
            type: 'object',
            properties: {
              enabled: { type: 'boolean', default: false },
              timezone: { type: 'string', default: 'UTC' },
              schedule: {
                type: 'object',
                additionalProperties: {
                  type: 'object',
                  properties: {
                    start: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
                    end: { type: 'string', pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
                  },
                },
              },
            },
          },
        },
      },
      scoringRules: {
        type: 'array',
        title: 'Lead Scoring Rules',
        group: 'scoring',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string', enum: ['demographic', 'behavioral', 'engagement', 'firmographic'] },
            condition: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                operator: { type: 'string', enum: ['equals', 'not_equals', 'contains', 'greater_than', 'less_than', 'exists', 'not_exists', 'in', 'not_in'] },
                value: {},
              },
            },
            points: { type: 'integer', minimum: -100, maximum: 100 },
            isActive: { type: 'boolean', default: true },
          },
          required: ['id', 'name', 'category', 'condition', 'points'],
        },
      },
      assignmentRules: {
        type: 'array',
        title: 'Assignment Rules',
        group: 'assignment',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            priority: { type: 'integer', minimum: 1 },
            active: { type: 'boolean', default: true },
            criteria: {
              type: 'object',
              properties: {
                source: { type: 'array', items: { type: 'string' } },
                score: { type: 'object', properties: { min: { type: 'number' }, max: { type: 'number' } } },
                tags: { type: 'array', items: { type: 'string' } },
                customFields: { type: 'object', additionalProperties: true },
              },
            },
            assignTo: {
              type: 'object',
              properties: {
                type: { type: 'string', enum: ['user', 'team', 'round_robin', 'load_balanced'] },
                value: { type: 'string' },
                userPool: { type: 'array', items: { type: 'string' } },
              },
            },
          },
          required: ['id', 'name', 'priority'],
        },
      },
      automations: {
        type: 'array',
        title: 'Pipeline Automations',
        group: 'automations',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            isActive: { type: 'boolean', default: true },
            trigger: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  enum: ['lead_created', 'lead_updated', 'stage_changed', 'stage_entered', 'stage_exited', 'time_in_stage', 'score_changed', 'tag_added', 'activity_created', 'form_submitted', 'email_opened', 'link_clicked', 'schedule'],
                },
                conditions: { type: 'object', additionalProperties: true },
                schedule: {
                  type: 'object',
                  properties: {
                    frequency: { type: 'string', enum: ['once', 'daily', 'weekly', 'monthly'] },
                    time: { type: 'string' },
                    daysOfWeek: { type: 'array', items: { type: 'integer', minimum: 0, maximum: 6 } },
                  },
                },
              },
            },
            actions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['send_email', 'send_sms', 'create_task', 'update_field', 'add_tag', 'remove_tag', 'change_stage', 'assign_to', 'add_note', 'webhook', 'wait', 'branch'] },
                  config: { type: 'object', additionalProperties: true },
                  delay: {
                    type: 'object',
                    properties: {
                      value: { type: 'integer' },
                      unit: { type: 'string', enum: ['minutes', 'hours', 'days', 'weeks'] },
                    },
                  },
                },
              },
            },
          },
          required: ['id', 'name', 'trigger', 'actions'],
        },
      },
      teamMembers: {
        type: 'array',
        title: 'Team Members',
        group: 'team',
        items: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'manager', 'sales_rep', 'viewer'] },
            permissions: {
              type: 'array',
              items: { type: 'string', enum: ['view', 'create', 'edit', 'delete', 'assign', 'export', 'configure'] },
            },
            quotas: {
              type: 'object',
              properties: {
                monthly: { type: 'integer' },
                quarterly: { type: 'integer' },
                yearly: { type: 'integer' },
              },
            },
            maxLeads: { type: 'integer' },
          },
          required: ['userId', 'name', 'role'],
        },
      },
    },
    required: ['name', 'stages'],
  } as const;
};

const ms = LeadSchema();
export type LeadModel = FromSchema<typeof ms>;

const ps = LeadPipelineSchema();
export type LeadPipelineModel = FromSchema<typeof ps>;

registerCollection('lead', DataType.lead, LeadSchema());

registerCollection(
  'leadPipeline',
  DataType.lead_pipeline,
  LeadPipelineSchema()
);
