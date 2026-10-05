import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';
import { EMPLOYMENT_TYPES, ReadinessScopeProperties, JurisdictionSchema } from './requirement';
import { EMPLOYEE_DOCUMENT_TYPES } from './documents';

/**
 * Workforce Readiness — journeys.
 *
 * A journey template holds the stages and task definitions for one event (onboarding,
 * role change, offboarding…) and is matched to a person by rule; several templates can
 * stack. A journey is one per person and event. Its tasks are platform `task` records
 * whose wrapper `owner` is `{ datatype: 'bm_journey', id: <journey sk> }`; the task's
 * `payload` carries the template task key, so the task definition is never copied.
 */

export const JOURNEY_EVENTS = ['onboarding', 'preboarding', 'role_change', 'transfer', 'return_from_leave', 'rehire', 'contractor', 'offboarding'] as const;

export const JOURNEY_STAGE_ANCHORS = ['before_day_1', 'day_1', 'week_1', 'day_30', 'day_60_90', 'custom'] as const;

export const JOURNEY_TASK_TYPES = [
  'form',
  'esign',
  'document_upload',
  'policy_ack',
  'course',
  'quiz',
  'meeting',
  'shadow_shift',
  'provisioning',
  'approval',
  'signoff',
  'checklist',
  // an account in an app with no SCIM: IT creates/removes it by hand and marks it with a note
  'manual_account',
  // laptop, phone, uniform, keys, access card: issued from stock (sf_inventory) and collected at the end
  'equipment',
  // buddy / manager check-in at day 1, 7, 30, 60, 90
  'checkin',
  // a short pulse survey (crm_form) to the hire or the manager
  'pulse_survey',
  // time-to-productive milestone
  'milestone',
  'custom',
] as const;

/** Apps without SCIM: what the IT checklist does. */
export const JOURNEY_MANUAL_ACCOUNT_ACTIONS = ['create', 'revoke', 'revoke_all'] as const;

/** Equipment kinds; `access_card` is issued/revoked through the platform's access_credential records (type card). */
export const JOURNEY_EQUIPMENT_KINDS = ['laptop', 'phone', 'tablet', 'uniform', 'keys', 'access_card', 'badge', 'tools', 'vehicle', 'other'] as const;
export const JOURNEY_EQUIPMENT_ACTIONS = ['issue', 'collect'] as const;
export const JOURNEY_EQUIPMENT_STATUSES = ['issued', 'returned', 'lost', 'damaged', 'written_off'] as const;

/** What a time-to-productive milestone measures. `manager_confirmed` is the manager's call. */
export const JOURNEY_MILESTONE_METRICS = ['first_shift_worked', 'hours_worked', 'shifts_worked', 'training_complete', 'signoffs_passed', 'stage_complete', 'manager_confirmed'] as const;

export const JOURNEY_SURVEY_RESPONDENTS = ['hire', 'manager', 'buddy'] as const;

/** Where the external provisioning goes. `scim` = any SCIM 2.0 app configured as a ScimProvider integration. */
export const JOURNEY_EXTERNAL_INTEGRATIONS = ['google', 'microsoft', 'slack', 'scim'] as const;
export const JOURNEY_EXTERNAL_ACTIONS = ['create_user', 'suspend_user', 'resume_user', 'delete_user', 'add_to_group', 'remove_from_group'] as const;

/** Tasks go to a relationship, never a named person; resolved when the task is created and re-resolved on transfer. */
export const JOURNEY_ASSIGNEE_RELATIONS = ['hire', 'manager', 'hr', 'it', 'buddy', 'location_manager', 'payroll', 'role'] as const;

export const JOURNEY_EVIDENCE_TRIGGERS = [
  'form_saved',
  'signature',
  'upload_valid',
  'policy_acknowledged',
  'course_passed',
  'signoff_passed',
  'provisioning_done',
  'requirement_satisfied',
  'meeting_held',
  'shift_worked',
  'approved',
  // manual_account: the account is recorded on the employee (create) / every manual account is marked removed (revoke_all)
  'account_recorded',
  // equipment: every listed item issued (issue) / everything issued is back or written off (collect)
  'equipment_issued',
  'equipment_returned',
  // pulse_survey: the respondent sent the survey in for this checkpoint
  'survey_submitted',
  // milestone: the metric reached its target
  'milestone_met',
  'manual',
] as const;

export const JOURNEY_PROVISIONING_ACTIONS = [
  'create_login',
  'add_groups',
  'add_roles',
  'issue_pin',
  'add_payroll',
  'open_benefits',
  'schedule_trainee_shift',
  // offboarding cascade
  'disable_login',
  'remove_groups',
  'remove_roles',
  'deactivate_pin',
  'release_future_shifts',
  'end_benefits',
  // rehire: re-open a login that offboarding disabled
  'enable_login',
  // transfer: write the new location / department / title / supervisor at the effective time
  'apply_transfer',
  // third-party, via appengine upstream integrations (Google, Microsoft, Slack, any SCIM 2.0 app)
  'external',
] as const;

/** First-day information the hire sees on the welcome page. Template holds the default; the journey can override. */
export const WelcomeSchema = () =>
  ({
    type: 'object',
    collapsible: true,
    description: 'What the hire sees on their welcome page before day 1',
    properties: {
      message: { type: 'string', 'x-control-variant': 'textarea', description: 'A welcome note from the team' },
      arriveTime: { type: 'string', description: 'e.g. 08:45' },
      arriveAt: { type: 'string', description: 'Where to go on day 1 (entrance, desk, who to ask for)' },
      dressCode: { type: 'string' },
      whatToBring: { type: 'string', 'x-control-variant': 'textarea' },
      parking: { type: 'string' },
      contactName: { type: 'string' },
      contactPhone: { type: 'string' },
    },
  }) as const;

const ChangeSnapshotSchema = () =>
  ({
    type: 'object',
    properties: {
      jobTitle: { type: 'string' },
      department: { type: 'string' },
      location: { type: 'string' },
      supervisor: { type: 'string' },
      employmentType: { type: 'string', enum: EMPLOYMENT_TYPES },
    },
  }) as const;

// ========== Journey Template ==========

export const JourneyTemplateSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::jt-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'name',
      },
      code: {
        type: 'string',
        pattern: '^[A-Z0-9_-]+$',
        unique: true,
        group: 'name',
      },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      event: { type: 'string', enum: JOURNEY_EVENTS, default: 'onboarding', group: 'type' },
      status: { type: 'string', enum: ['draft', 'active', 'retired'], default: 'draft', group: 'type' },
      version: { type: 'number', default: 1 },

      match: {
        type: 'object',
        collapsible: true,
        description: 'Who this template is chosen for. Company-wide, role and location templates can stack.',
        properties: {
          ...ReadinessScopeProperties(),
          priority: { type: 'number', default: 0, description: 'Higher wins when templates are not stackable' },
          stackable: { type: 'boolean', default: true, description: 'Combine with other matching templates' },
        },
      },

      preboarding: {
        type: 'object',
        collapsible: true,
        properties: {
          enabled: { type: 'boolean', default: true },
          unlockOn: { type: 'string', enum: ['offer_signed', 'employee_added', 'manual'], default: 'offer_signed' },
          daysBeforeStart: { type: 'number', description: 'Earliest the pre-boarding link opens' },
        },
      },

      stages: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            title: { type: 'string' },
            anchor: { type: 'string', enum: JOURNEY_STAGE_ANCHORS, default: 'custom' },
            offsetDays: { type: 'number', description: 'anchor=custom: days from the start/effective date (negative = before)' },
            order: { type: 'number' },
          },
        },
      },

      tasks: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            key: { type: 'string', description: 'Stable within the template; tasks and dependsOn refer to it' },
            title: { type: 'string' },
            description: { type: 'string', 'x-control-variant': 'textarea' },
            type: { type: 'string', enum: JOURNEY_TASK_TYPES, default: 'custom' },
            stage: { type: 'string', description: 'Stage key' },
            assignee: {
              type: 'object',
              properties: {
                relation: { type: 'string', enum: JOURNEY_ASSIGNEE_RELATIONS, default: 'hire' },
                role: {
                  type: 'string',
                  'x-control': ControlType.selectSingle,
                  dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
                  description: 'relation = role',
                },
              },
            },
            dueOffsetDays: { type: 'number', description: 'Days from the start/effective date; negative = before' },
            atEffectiveTime: { type: 'boolean', default: false, description: 'Run at the exact start/end time (e.g. offboarding revoke)' },
            dependsOn: { type: 'array', items: { type: 'string' }, description: 'Task keys that must be done first' },
            required: { type: 'boolean', default: true, description: 'Optional tasks do not hold the journey open' },
            visibleBeforeDay1: { type: 'boolean', default: false, description: 'Shown to the hire during pre-boarding' },
            requirementId: {
              type: 'string',
              'x-control': ControlType.selectSingle,
              dataSource: { source: 'collection', collection: DataType.bm_requirement_rule, value: 'sk', label: 'title' },
              description: 'Link to a requirement rule; its due window and evidence apply',
            },
            evidence: {
              type: 'object',
              description: 'What closes the task on its own',
              properties: {
                completesOn: { type: 'string', enum: JOURNEY_EVIDENCE_TRIGGERS, default: 'manual' },
                formKey: {
                  type: 'string',
                  'x-control': ControlType.selectSingle,
                  dataSource: { source: 'collection', collection: DataType.crm_form, value: 'name', label: 'name' },
                },
                documentType: { type: 'string', enum: EMPLOYEE_DOCUMENT_TYPES },
                courseId: {
                  type: 'string',
                  'x-control': ControlType.selectSingle,
                  dataSource: { source: 'collection', collection: DataType.bm_course, value: 'sk', label: 'title' },
                },
                policyId: {
                  type: 'string',
                  'x-control': ControlType.selectSingle,
                  dataSource: { source: 'collection', collection: DataType.bm_policy, value: 'sk', label: 'title' },
                },
                requiredFields: { type: 'array', items: { type: 'string' }, description: 'form_saved: employee fields that must be filled' },
              },
            },
            account: {
              type: 'object',
              collapsible: true,
              description: 'type = manual_account: an app with no SCIM — IT does it by hand and marks it done with a note',
              properties: {
                app: { type: 'string', description: 'App name, e.g. "Figma" (revoke_all: every manual account on record)' },
                action: { type: 'string', enum: JOURNEY_MANUAL_ACCOUNT_ACTIONS, default: 'create' },
                instructions: { type: 'string', 'x-control-variant': 'textarea', description: 'The IT checklist for this app' },
                adminUrl: { type: 'string', format: 'uri', description: 'Where IT goes to do it' },
              },
            },
            equipment: {
              type: 'object',
              collapsible: true,
              description: 'type = equipment: items issued from stock (sf_inventory by SKU at the location) or collected back',
              properties: {
                action: { type: 'string', enum: JOURNEY_EQUIPMENT_ACTIONS, default: 'issue' },
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      item: { type: 'string', description: 'e.g. "Laptop", "Chef jacket (M)", "Back-door key"' },
                      kind: { type: 'string', enum: JOURNEY_EQUIPMENT_KINDS, default: 'other' },
                      sku: {
                        type: 'string',
                        'x-control': ControlType.selectSingle,
                        dataSource: { source: 'collection', collection: DataType.sf_product, value: 'sku', label: ['sku', 'name'] },
                        description: 'Stock item; issuing takes it out of the location’s inventory, a return puts it back',
                      },
                      quantity: { type: 'number', default: 1 },
                      requiresReturn: { type: 'boolean', default: true },
                      trackSerial: { type: 'boolean', default: false, description: 'Ask for the asset tag / serial number when issued' },
                    },
                  },
                },
              },
            },
            checkin: {
              type: 'object',
              collapsible: true,
              description: 'type = checkin: a buddy or manager check-in; the assignee relation says who holds it',
              properties: {
                checkpoint: { type: 'string', description: 'e.g. day_1, day_7, day_30, day_60, day_90' },
                agenda: { type: 'string', 'x-control-variant': 'textarea' },
                durationMinutes: { type: 'number', default: 15 },
              },
            },
            survey: {
              type: 'object',
              collapsible: true,
              description: 'type = pulse_survey: a short survey (a crm_form) sent to the respondent at a checkpoint',
              properties: {
                formKey: {
                  type: 'string',
                  'x-control': ControlType.selectSingle,
                  dataSource: { source: 'collection', collection: DataType.crm_form, value: 'name', label: 'name' },
                },
                checkpoint: { type: 'string', description: 'e.g. day_1, day_7, day_30, day_60, day_90' },
                respondent: { type: 'string', enum: JOURNEY_SURVEY_RESPONDENTS, default: 'hire' },
                scoreField: { type: 'string', description: 'The 1–5 rating field the reports average', default: 'score' },
                lowScore: { type: 'number', default: 2, description: 'At or below this, the journey is flagged and the manager and HR are told' },
              },
            },
            milestone: {
              type: 'object',
              collapsible: true,
              description: 'type = milestone: a time-to-productive milestone, measured by the platform',
              properties: {
                label: { type: 'string' },
                metric: { type: 'string', enum: JOURNEY_MILESTONE_METRICS, default: 'manager_confirmed' },
                target: { type: 'number', description: 'hours_worked / shifts_worked: how many; stage_complete: ignored' },
                stage: { type: 'string', description: 'stage_complete: which stage key' },
                productive: { type: 'boolean', default: false, description: 'This milestone is "fully productive" — the time-to-productive the reports use' },
              },
            },
            provisioning: {
              type: 'object',
              collapsible: true,
              description: 'type = provisioning: what the platform does itself',
              properties: {
                action: { type: 'string', enum: JOURNEY_PROVISIONING_ACTIONS },
                groups: {
                  type: 'array',
                  'x-control': ControlType.selectMany,
                  'x-control-variant': 'chip',
                  dataSource: { source: 'collection', collection: DataType.usergroup, value: 'name', label: 'name' },
                  items: { type: 'string' },
                },
                roles: {
                  type: 'array',
                  'x-control': ControlType.selectMany,
                  'x-control-variant': 'chip',
                  dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
                  items: { type: 'string' },
                },
                station: { type: 'string', description: 'schedule_trainee_shift: station/area — matches bm_schedule.station' },
                external: {
                  type: 'object',
                  description: 'action = external',
                  properties: {
                    integration: { type: 'string', enum: JOURNEY_EXTERNAL_INTEGRATIONS, description: 'Empty on a revoke: every connected account on record' },
                    app: {
                      type: 'string',
                      'x-control': ControlType.selectSingle,
                      dataSource: { source: 'collection', collection: DataType.config, value: 'name', label: 'name', filter: { 'data.provider': 'ScimProvider' } },
                      description: 'integration = scim: the ScimProvider integration (by its name) — one per app (Zoom, Atlassian, GitHub, Dropbox, 1Password, Okta…)',
                    },
                    action: { type: 'string', enum: JOURNEY_EXTERNAL_ACTIONS },
                    groups: { type: 'array', items: { type: 'string' }, description: 'Group ids / names in that app to add the account to' },
                    params: { type: 'object', additionalProperties: true },
                  },
                },
              },
            },
          },
        },
      },
      welcome: WelcomeSchema(),
      tags: { type: 'array', items: { type: 'string' } },
    },
    required: ['title', 'event'],
  } as const;
};

// ========== Journey ==========

export const JourneySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::jr-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: { type: 'string', group: 'name' },
      employeeId: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_employee, value: 'employeeId', label: ['employeeId', 'name'] },
        description: 'Employees and contractors are both bm_employee (contractor = employmentType contract)',
        group: 'employee',
      },
      employeeName: { type: 'string', group: 'employee' },
      ...BusinessLocationField(),
      event: { type: 'string', enum: JOURNEY_EVENTS, group: 'type' },
      status: {
        type: 'string',
        enum: ['planned', 'in_progress', 'complete', 'cancelled'],
        default: 'planned',
        group: 'type',
      },
      templateIds: {
        type: 'array',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: { source: 'collection', collection: DataType.bm_journey_template, value: 'sk', label: 'title' },
        items: { type: 'string' },
      },
      startDate: { type: 'string', format: 'date', group: 'dates', description: 'Day 1 — stages and due dates count from here' },
      effectiveDate: { type: 'string', format: 'date-time', group: 'dates', description: 'When the change takes effect (role change, transfer, exact offboarding end time)' },
      completedAt: { type: 'string', format: 'date-time', readOnly: true },
      cancelledReason: { type: 'string' },
      source: {
        type: 'object',
        description: 'What started the journey (bm_offer, bm_offboarding, bm_leave_request…)',
        properties: {
          datatype: { type: 'string' },
          id: { type: 'string' },
        },
      },

      plannedFor: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        description: 'Snapshot the plan was built from; a change here triggers a re-plan',
        properties: {
          jobTitle: { type: 'string' },
          department: { type: 'string' },
          jobLevel: { type: 'string' },
          location: { type: 'string' },
          employmentType: { type: 'string', enum: EMPLOYMENT_TYPES },
          roles: { type: 'array', items: { type: 'string' } },
          jurisdiction: JurisdictionSchema(),
        },
      },
      buddyId: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_employee, value: 'employeeId', label: ['employeeId', 'name'] },
      },

      preboarding: {
        type: 'object',
        collapsible: true,
        properties: {
          enabled: { type: 'boolean', default: false },
          unlocked: { type: 'boolean', default: false, readOnly: true },
          unlockedAt: { type: 'string', format: 'date-time', readOnly: true },
          invitedAt: { type: 'string', format: 'date-time', readOnly: true },
          username: { type: 'string', readOnly: true, description: 'Login the hire uses before day 1' },
        },
      },

      tasks: {
        type: 'array',
        readOnly: true,
        collapsible: true,
        description: 'Index of the task records this journey owns (task.owner = this journey). Status lives on the task.',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            templateId: { type: 'string' },
            taskId: { type: 'string', description: 'sk of the platform task' },
            stage: { type: 'string' },
            required: { type: 'boolean' },
            requirementId: { type: 'string' },
          },
        },
      },
      stageProgress: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            stage: { type: 'string' },
            dueDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['not_started', 'in_progress', 'complete', 'overdue'] },
            done: { type: 'number' },
            total: { type: 'number' },
            overdue: { type: 'number' },
          },
        },
      },
      counts: {
        type: 'object',
        readOnly: true,
        properties: {
          done: { type: 'number' },
          total: { type: 'number' },
          overdue: { type: 'number' },
          requiredDone: { type: 'number' },
          requiredTotal: { type: 'number' },
        },
      },
      replans: {
        type: 'array',
        readOnly: true,
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            reason: { type: 'string', enum: ['role_change', 'location_change', 'date_change', 'employment_type_change', 'template_change', 'manual'] },
            from: { type: 'string' },
            to: { type: 'string' },
            at: { type: 'string', format: 'date-time' },
            by: { type: 'string' },
            tasksAdded: { type: 'array', items: { type: 'string' } },
            tasksRemoved: { type: 'array', items: { type: 'string' } },
            datesShiftedDays: { type: 'number' },
          },
        },
      },
      welcome: WelcomeSchema(),
      cohortId: { type: 'string', group: 'cohort', description: 'Journeys started together (bulk start) share a cohort' },
      cohortName: { type: 'string', group: 'cohort' },
      change: {
        type: 'object',
        collapsible: true,
        description: 'transfer / role_change / rehire: what changes, and what it was',
        properties: {
          from: ChangeSnapshotSchema(),
          to: ChangeSnapshotSchema(),
          appliedAt: { type: 'string', format: 'date-time', readOnly: true },
        },
      },
      history: {
        type: 'array',
        readOnly: true,
        collapsible: true,
        description: 'The person’s earlier journeys (rehire, transfer): kept, never overwritten',
        items: {
          type: 'object',
          properties: {
            journeyId: { type: 'string' },
            event: { type: 'string', enum: JOURNEY_EVENTS },
            status: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            completedAt: { type: 'string', format: 'date-time' },
            title: { type: 'string' },
          },
        },
      },
      milestones: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            label: { type: 'string' },
            metric: { type: 'string', enum: JOURNEY_MILESTONE_METRICS },
            productive: { type: 'boolean' },
            metAt: { type: 'string', format: 'date-time' },
            daysFromStart: { type: 'number' },
          },
        },
      },
      pulse: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            checkpoint: { type: 'string' },
            respondent: { type: 'string', enum: JOURNEY_SURVEY_RESPONDENTS },
            score: { type: 'number' },
            low: { type: 'boolean' },
            submissionId: { type: 'string' },
            submittedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'event'],
  } as const;
};

// Type exports
const jt = JourneyTemplateSchema();
export type JourneyTemplateModel = FromSchema<typeof jt>;

const jr = JourneySchema();
export type JourneyModel = FromSchema<typeof jr>;

// Register collections
registerCollection('Journey Template', DataType.bm_journey_template, JourneyTemplateSchema());
registerCollection('Journey', DataType.bm_journey, JourneySchema());
