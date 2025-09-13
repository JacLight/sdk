import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const PipelineSchema = () => {
  return {
    type: "object",
    properties: {
      // Core Pipeline Information
      name: {
        type: "string",
        minLength: 1,
        maxLength: 100,
        title: 'Pipeline Name',
        group: 'core',
        description: 'Unique name for the pipeline'
      },
      description: {
        type: "string",
        maxLength: 500,
        title: 'Description',
        group: 'core',
        'x-control-variant': 'textarea'
      },
      color: {
        type: "string",
        pattern: '^#[0-9A-Fa-f]{6}$',
        title: 'Pipeline Color',
        group: 'core',
        default: '#3B82F6',
        'x-control': 'color-picker'
      },
      icon: {
        type: "string",
        title: 'Pipeline Icon',
        group: 'core',
        default: 'GitBranch'
      },
      isActive: {
        type: "boolean",
        title: 'Active',
        group: 'core',
        default: true,
        description: 'Whether this pipeline is currently active'
      },
      isDefault: {
        type: "boolean",
        title: 'Default Pipeline',
        group: 'core',
        default: false,
        description: 'Set as the default pipeline for new leads'
      },
      
      // Pipeline Stages
      stages: {
        type: "array",
        title: "Pipeline Stages",
        group: 'stages',
        minItems: 1,
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Stage ID'
            },
            name: {
              type: "string",
              title: 'Stage Name',
              minLength: 1,
              maxLength: 50
            },
            description: {
              type: "string",
              title: 'Stage Description',
              maxLength: 200
            },
            color: {
              type: "string",
              pattern: '^#[0-9A-Fa-f]{6}$',
              title: 'Stage Color',
              default: '#6B7280'
            },
            order: {
              type: "integer",
              title: 'Display Order',
              minimum: 0
            },
            probability: {
              type: "number",
              title: 'Win Probability %',
              minimum: 0,
              maximum: 100,
              description: 'Default win probability for leads in this stage'
            },
            isWon: {
              type: "boolean",
              title: 'Won Stage',
              default: false,
              description: 'Marks leads as won when they reach this stage'
            },
            isLost: {
              type: "boolean",
              title: 'Lost Stage',
              default: false,
              description: 'Marks leads as lost when they reach this stage'
            },
            allowSkip: {
              type: "boolean",
              title: 'Allow Skip',
              default: true,
              description: 'Allow skipping this stage'
            },
            requireComment: {
              type: "boolean",
              title: 'Require Comment',
              default: false,
              description: 'Require a comment when moving to this stage'
            },
            automationTriggers: {
              type: "array",
              title: 'Stage Automation Triggers',
              items: {
                type: "string",
                enum: ["on_enter", "on_exit", "on_stay_duration", "on_activity"]
              }
            },
            sla: {
              type: "object",
              title: 'Stage SLA',
              properties: {
                duration: {
                  type: "integer",
                  title: 'Max Duration (hours)',
                  minimum: 1
                },
                action: {
                  type: "string",
                  enum: ["notify", "escalate", "auto_move", "create_task"],
                  title: 'SLA Action'
                }
              }
            },
            requirements: {
              type: "array",
              title: 'Stage Requirements',
              items: {
                type: "object",
                properties: {
                  field: {
                    type: "string",
                    title: 'Required Field'
                  },
                  validation: {
                    type: "string",
                    enum: ["required", "email", "phone", "url", "number", "custom"],
                    title: 'Validation Type'
                  }
                }
              }
            }
          },
          required: ["id", "name", "order"]
        }
      },
      
      // Pipeline Settings
      settings: {
        type: "object",
        title: "Pipeline Settings",
        group: 'settings',
        properties: {
          autoAssignment: {
            type: "boolean",
            title: 'Auto Assignment',
            default: false,
            description: 'Automatically assign leads to team members'
          },
          assignmentMethod: {
            type: "string",
            enum: ["round_robin", "load_balanced", "territory", "skill_based", "manual"],
            title: 'Assignment Method',
            default: 'round_robin'
          },
          duplicateCheck: {
            type: "boolean",
            title: 'Duplicate Detection',
            default: true,
            description: 'Check for duplicate leads on entry'
          },
          duplicateCriteria: {
            type: "array",
            title: 'Duplicate Check Fields',
            items: {
              type: "string",
              enum: ["email", "phone", "company", "name"]
            },
            default: ["email"]
          },
          leadScoring: {
            type: "boolean",
            title: 'Lead Scoring',
            default: true,
            description: 'Enable automatic lead scoring'
          },
          scoringModel: {
            type: "string",
            enum: ["basic", "behavioral", "predictive", "custom"],
            title: 'Scoring Model',
            default: 'basic'
          },
          rottenLeadDays: {
            type: "integer",
            title: 'Rotten Lead Days',
            minimum: 1,
            default: 30,
            description: 'Days before a lead is considered rotten'
          },
          rottenLeadHandling: {
            type: "string",
            enum: ["notify", "auto_move", "archive", "ignore"],
            title: 'Rotten Lead Action',
            default: 'notify'
          },
          allowSkipStages: {
            type: "boolean",
            title: 'Allow Stage Skipping',
            default: true
          },
          requireStageComments: {
            type: "boolean",
            title: 'Require Stage Comments',
            default: false
          },
          workingHours: {
            type: "object",
            title: 'Working Hours',
            properties: {
              enabled: {
                type: "boolean",
                default: false
              },
              timezone: {
                type: "string",
                default: 'UTC'
              },
              schedule: {
                type: "object",
                additionalProperties: {
                  type: "object",
                  properties: {
                    start: { type: "string", pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' },
                    end: { type: "string", pattern: '^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$' }
                  }
                }
              }
            }
          }
        }
      },
      
      // Assignment Rules
      assignmentRules: {
        type: "array",
        title: "Assignment Rules",
        group: 'assignment',
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Rule ID'
            },
            name: {
              type: "string",
              title: 'Rule Name'
            },
            priority: {
              type: "integer",
              title: 'Priority',
              minimum: 1
            },
            criteria: {
              type: "object",
              title: 'Assignment Criteria',
              properties: {
                source: {
                  type: "array",
                  items: { type: "string" }
                },
                score: {
                  type: "object",
                  properties: {
                    min: { type: "number" },
                    max: { type: "number" }
                  }
                },
                tags: {
                  type: "array",
                  items: { type: "string" }
                },
                customFields: {
                  type: "object",
                  additionalProperties: true
                }
              }
            },
            assignTo: {
              type: "object",
              properties: {
                type: {
                  type: "string",
                  enum: ["user", "team", "round_robin", "load_balanced"]
                },
                value: {
                  type: "string"
                },
                userPool: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          },
          required: ["id", "name", "priority"]
        }
      },
      
      // Automations
      automations: {
        type: "array",
        title: "Pipeline Automations",
        group: 'automations',
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Automation ID'
            },
            name: {
              type: "string",
              title: 'Automation Name'
            },
            isActive: {
              type: "boolean",
              title: 'Active',
              default: true
            },
            trigger: {
              type: "object",
              title: 'Trigger',
              properties: {
                type: {
                  type: "string",
                  enum: [
                    "lead_created",
                    "lead_updated", 
                    "stage_changed",
                    "stage_entered",
                    "stage_exited",
                    "time_in_stage",
                    "score_changed",
                    "tag_added",
                    "activity_created",
                    "form_submitted",
                    "email_opened",
                    "link_clicked",
                    "schedule"
                  ]
                },
                conditions: {
                  type: "object",
                  additionalProperties: true
                },
                schedule: {
                  type: "object",
                  properties: {
                    frequency: {
                      type: "string",
                      enum: ["once", "daily", "weekly", "monthly"]
                    },
                    time: {
                      type: "string"
                    },
                    daysOfWeek: {
                      type: "array",
                      items: { type: "integer", minimum: 0, maximum: 6 }
                    }
                  }
                }
              }
            },
            actions: {
              type: "array",
              title: 'Actions',
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: [
                      "send_email",
                      "send_sms",
                      "create_task",
                      "update_field",
                      "add_tag",
                      "remove_tag",
                      "change_stage",
                      "assign_to",
                      "add_note",
                      "webhook",
                      "wait",
                      "branch"
                    ]
                  },
                  config: {
                    type: "object",
                    additionalProperties: true
                  },
                  delay: {
                    type: "object",
                    properties: {
                      value: { type: "integer" },
                      unit: {
                        type: "string",
                        enum: ["minutes", "hours", "days", "weeks"]
                      }
                    }
                  }
                }
              }
            }
          },
          required: ["id", "name", "trigger", "actions"]
        }
      },
      
      // Forms
      forms: {
        type: "array",
        title: "Lead Capture Forms",
        group: 'forms',
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Form ID'
            },
            name: {
              type: "string",
              title: 'Form Name'
            },
            type: {
              type: "string",
              enum: ["embedded", "popup", "slide_in", "full_page"],
              title: 'Form Type'
            },
            fields: {
              type: "array",
              title: 'Form Fields',
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  label: { type: "string" },
                  type: {
                    type: "string",
                    enum: ["text", "email", "phone", "select", "radio", "checkbox", "textarea", "date", "file"]
                  },
                  required: { type: "boolean" },
                  validation: { type: "string" },
                  options: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            },
            settings: {
              type: "object",
              properties: {
                submitButtonText: { type: "string", default: "Submit" },
                successMessage: { type: "string" },
                redirectUrl: { type: "string" },
                notificationEmail: { type: "string" },
                autoResponse: { type: "boolean" },
                captcha: { type: "boolean" },
                gdprConsent: { type: "boolean" },
                defaultStageId: { type: "string" },
                tags: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            },
            styling: {
              type: "object",
              properties: {
                theme: {
                  type: "string",
                  enum: ["light", "dark", "custom"]
                },
                primaryColor: { type: "string" },
                fontFamily: { type: "string" },
                customCss: { type: "string" }
              }
            }
          },
          required: ["id", "name", "type", "fields"]
        }
      },
      
      // Email Templates
      emailTemplates: {
        type: "array",
        title: "Email Templates",
        group: 'templates',
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Template ID'
            },
            name: {
              type: "string",
              title: 'Template Name'
            },
            subject: {
              type: "string",
              title: 'Email Subject'
            },
            body: {
              type: "string",
              title: 'Email Body',
              'x-control-variant': 'rich-text'
            },
            type: {
              type: "string",
              enum: ["welcome", "follow_up", "nurture", "proposal", "reminder", "thank_you", "custom"],
              title: 'Template Type'
            },
            variables: {
              type: "array",
              title: 'Template Variables',
              items: {
                type: "object",
                properties: {
                  key: { type: "string" },
                  label: { type: "string" },
                  defaultValue: { type: "string" }
                }
              }
            },
            attachments: {
              type: "array",
              title: 'Attachments',
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  url: { type: "string" },
                  size: { type: "number" }
                }
              }
            }
          },
          required: ["id", "name", "subject", "body"]
        }
      },
      
      // Task Templates
      taskTemplates: {
        type: "array",
        title: "Task Templates",
        group: 'templates',
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Template ID'
            },
            name: {
              type: "string",
              title: 'Template Name'
            },
            description: {
              type: "string",
              title: 'Task Description'
            },
            type: {
              type: "string",
              enum: ["call", "email", "meeting", "follow_up", "research", "custom"],
              title: 'Task Type'
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high", "urgent"],
              title: 'Priority'
            },
            dueInDays: {
              type: "integer",
              title: 'Due In (days)',
              minimum: 0
            },
            assignToRole: {
              type: "string",
              title: 'Assign to Role'
            },
            checklist: {
              type: "array",
              title: 'Task Checklist',
              items: {
                type: "object",
                properties: {
                  item: { type: "string" },
                  required: { type: "boolean" }
                }
              }
            }
          },
          required: ["id", "name", "type"]
        }
      },
      
      // Scoring Rules
      scoringRules: {
        type: "array",
        title: "Lead Scoring Rules",
        group: 'scoring',
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              title: 'Rule ID'
            },
            name: {
              type: "string",
              title: 'Rule Name'
            },
            category: {
              type: "string",
              enum: ["demographic", "behavioral", "engagement", "firmographic"],
              title: 'Category'
            },
            condition: {
              type: "object",
              properties: {
                field: { type: "string" },
                operator: {
                  type: "string",
                  enum: ["equals", "not_equals", "contains", "greater_than", "less_than", "in", "not_in"]
                },
                value: {
                  oneOf: [
                    { type: "string" },
                    { type: "number" },
                    { type: "array" }
                  ]
                }
              }
            },
            points: {
              type: "integer",
              title: 'Score Points',
              minimum: -100,
              maximum: 100
            },
            isActive: {
              type: "boolean",
              default: true
            }
          },
          required: ["id", "name", "category", "condition", "points"]
        }
      },
      
      // Metrics & Analytics
      metrics: {
        type: "object",
        title: "Pipeline Metrics",
        group: 'analytics',
        properties: {
          totalLeads: {
            type: "integer",
            title: 'Total Leads',
            default: 0
          },
          activeLeads: {
            type: "integer",
            title: 'Active Leads',
            default: 0
          },
          wonLeads: {
            type: "integer",
            title: 'Won Leads',
            default: 0
          },
          lostLeads: {
            type: "integer",
            title: 'Lost Leads',
            default: 0
          },
          totalValue: {
            type: "number",
            title: 'Total Pipeline Value',
            default: 0
          },
          averageDealSize: {
            type: "number",
            title: 'Average Deal Size',
            default: 0
          },
          conversionRate: {
            type: "number",
            title: 'Conversion Rate %',
            minimum: 0,
            maximum: 100,
            default: 0
          },
          averageTimeToClose: {
            type: "number",
            title: 'Avg. Days to Close',
            default: 0
          },
          velocity: {
            type: "number",
            title: 'Pipeline Velocity',
            default: 0,
            description: 'Leads moving through pipeline per day'
          },
          stageMetrics: {
            type: "object",
            title: 'Stage Metrics',
            additionalProperties: {
              type: "object",
              properties: {
                count: { type: "integer" },
                value: { type: "number" },
                averageTime: { type: "number" },
                conversionRate: { type: "number" }
              }
            }
          }
        }
      },
      
      // Team Members
      teamMembers: {
        type: "array",
        title: "Team Members",
        group: 'team',
        items: {
          type: "object",
          properties: {
            userId: {
              type: "string",
              title: 'User ID'
            },
            name: {
              type: "string",
              title: 'Member Name'
            },
            role: {
              type: "string",
              enum: ["admin", "manager", "sales_rep", "viewer"],
              title: 'Role'
            },
            permissions: {
              type: "array",
              items: {
                type: "string",
                enum: ["view", "create", "edit", "delete", "assign", "export", "configure"]
              }
            },
            quotas: {
              type: "object",
              properties: {
                monthly: { type: "integer" },
                quarterly: { type: "integer" },
                yearly: { type: "integer" }
              }
            },
            maxLeads: {
              type: "integer",
              title: 'Max Lead Capacity'
            }
          },
          required: ["userId", "name", "role"]
        }
      },
      
      // Integrations
      integrations: {
        type: "array",
        title: "Pipeline Integrations",
        group: 'integrations',
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["crm", "email", "calendar", "slack", "webhook", "zapier", "custom"],
              title: 'Integration Type'
            },
            name: {
              type: "string",
              title: 'Integration Name'
            },
            config: {
              type: "object",
              additionalProperties: true
            },
            isActive: {
              type: "boolean",
              default: true
            },
            syncSettings: {
              type: "object",
              properties: {
                frequency: {
                  type: "string",
                  enum: ["realtime", "hourly", "daily", "manual"]
                },
                direction: {
                  type: "string",
                  enum: ["inbound", "outbound", "bidirectional"]
                },
                fieldMapping: {
                  type: "object",
                  additionalProperties: { type: "string" }
                }
              }
            }
          },
          required: ["type", "name"]
        }
      },
      
      // System Fields
      createdBy: {
        type: "string",
        title: 'Created By',
        group: 'system'
      },
      createdAt: {
        type: "string",
        format: "date-time",
        title: 'Created At',
        group: 'system'
      },
      updatedBy: {
        type: "string",
        title: 'Updated By',
        group: 'system'
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        title: 'Updated At',
        group: 'system'
      },
      version: {
        type: "integer",
        title: 'Version',
        group: 'system',
        default: 1
      }
    },
    required: ["name", "stages", "color"]
  } as const
};

const ps = PipelineSchema();
export type PipelineModel = FromSchema<typeof ps>;

registerCollection(
  'pipeline',
  DataType.pipeline,
  PipelineSchema(),
);