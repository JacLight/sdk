import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { getCountryDropDownOptions } from '../../data';
import { EMPLOYEE_DOCUMENT_TYPES } from './documents';

/**
 * Workforce Readiness — requirement rules and the requirement status ledger.
 *
 * A requirement rule is one record for anything a person must have: a course, a
 * certification, a policy acknowledgement, a document, a form, an observed floor
 * sign-off or a one-off task. It says who it applies to, when it is due, how often
 * it renews, what evidence satisfies it, and what happens at each gate (scheduler,
 * clock-in, POS, work station, payroll, access) while it is missing.
 *
 * Readiness itself is computed on the server; `bm_requirement_status` is the
 * append-only ledger of every status change, so "who worked non-compliant, when,
 * where" can be answered for any point in time by joining it with shifts/timecards.
 */

// ========== Shared value lists (schema-driven dropdowns) ==========

/** Same values as bm_employee.employment.employmentType — `contract` is a contractor. */
export const EMPLOYMENT_TYPES = ['full-time', 'part-time', 'contract', 'temporary', 'intern'] as const;

export const REQUIREMENT_KINDS = ['course', 'certification', 'policy', 'document', 'form', 'signoff', 'task'] as const;

export const REQUIREMENT_GATES = ['scheduler', 'clockIn', 'pos', 'kitchenStation', 'payroll', 'access'] as const;

export const GATE_EFFECTS = ['none', 'warn', 'override', 'block'] as const;

export const REQUIREMENT_STATUSES = ['compliant', 'due_soon', 'overdue', 'expired', 'waived', 'not_required'] as const;

/** Where the due window of a requirement starts. */
export const DUE_FROM = ['start_date', 'assignment', 'role_change', 'promotion', 'before_first_shift', 'threshold_met'] as const;

/** How a requirement repeats: a rolling period after each completion, or once per fixed training year. */
export const DUE_CADENCES = ['rolling', 'training_year'] as const;

// ========== Shared fragments ==========

/** One jurisdiction: country / state / county / city — same field names as sf_tax_rate. Empty = any. */
export const JurisdictionSchema = () =>
  ({
    type: 'object',
    properties: {
      country: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        maxItems: 1,
        dataSource: { source: 'json', json: getCountryDropDownOptions() },
        description: 'ISO 3166-1 alpha-2, e.g. US. Empty = any country',
      },
      state: { type: 'string', description: 'State / province code, e.g. CA. Empty = any state' },
      county: { type: 'string', description: 'County name. Empty = any county' },
      city: { type: 'string', description: 'City name. Empty = any city' },
    },
  } as const);

/**
 * Who a rule or journey template applies to. Field names match bm_course.eligibility
 * and bm_policy.applicableTo; values match bm_employee.employment (department, jobTitle,
 * jobLevel, location, employmentType) and the linked user's roles.
 * Every list is AND-ed across fields and OR-ed within a field; an empty list = any.
 */
export const ReadinessScopeProperties = () =>
  ({
    openToAll: { type: 'boolean', default: false, description: 'Applies to everyone; the lists below are ignored' },
    roles: {
      type: 'array',
      'x-control': ControlType.selectMany,
      'x-control-variant': 'chip',
      dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
      items: { type: 'string' },
    },
    departments: {
      type: 'array',
      'x-control': ControlType.selectMany,
      'x-control-variant': 'chip',
      dataSource: { source: 'collection', collection: DataType.bm_department, value: 'title', label: 'title' },
      items: { type: 'string' },
      description: 'Matches bm_employee.employment.department',
    },
    positions: {
      type: 'array',
      'x-control': ControlType.selectMany,
      'x-control-variant': 'chip',
      dataSource: { source: 'collection', collection: DataType.bm_position, value: 'title', label: 'title' },
      items: { type: 'string' },
      description: 'Matches bm_employee.employment.jobTitle',
    },
    jobLevels: { type: 'array', items: { type: 'string' }, description: 'Matches bm_employee.employment.jobLevel' },
    locations: {
      type: 'array',
      'x-control': ControlType.selectMany,
      'x-control-variant': 'chip',
      dataSource: { source: 'collection', collection: DataType.location, value: 'name', label: 'name' },
      items: { type: 'string' },
      description: 'Work location — matches bm_employee.employment.location',
    },
    employmentTypes: {
      type: 'array',
      'x-control': ControlType.selectMany,
      'x-control-variant': 'chip',
      items: { type: 'string', enum: EMPLOYMENT_TYPES },
      description: '`contract` = contractors',
    },
    jurisdictions: {
      type: 'array',
      collapsible: true,
      items: JurisdictionSchema(),
      description: 'Resolved from the work location; re-checked on transfer',
    },
  } as const);

/** Effect of a missing requirement at one gate. */
const GateEffectSchema = () =>
  ({
    type: 'object',
    properties: {
      effect: { type: 'string', enum: GATE_EFFECTS, default: 'none', description: 'override = allowed with reason code, expiry and named approver' },
      graceDays: { type: 'number', minimum: 0, default: 0, description: 'Days after due/expiry before the effect applies (warn until then)' },
    },
  } as const);

// ========== Requirement Rule ==========

export const RequirementRuleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::req-', 'random-string::6', 'uppercase'],
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
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      kind: {
        type: 'string',
        enum: REQUIREMENT_KINDS,
        group: 'type',
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'retired'],
        default: 'draft',
        group: 'type',
      },

      // ----- What is required (one of these, by kind) -----
      target: {
        type: 'object',
        collapsible: true,
        description: 'The thing the person must have. Fill the field that matches the kind.',
        properties: {
          courseIds: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: { source: 'collection', collection: DataType.bm_course, value: 'sk', label: 'title' },
            items: { type: 'string' },
            description: 'kind=course. Passing any one of these satisfies it (own or marketplace course)',
          },
          certificationId: {
            type: 'string',
            'x-control': ControlType.selectSingle,
            dataSource: { source: 'collection', collection: DataType.bm_certification, value: 'sk', label: 'title' },
            description: 'kind=certification. The certification type (food handler, alcohol server…)',
          },
          policyId: {
            type: 'string',
            'x-control': ControlType.selectSingle,
            dataSource: { source: 'collection', collection: DataType.bm_policy, value: 'sk', label: 'title' },
            description: 'kind=policy. Acknowledgement of the current version',
          },
          documentType: {
            type: 'string',
            enum: EMPLOYEE_DOCUMENT_TYPES,
            description: 'kind=document. A bm_employee_document of this type',
          },
          formKey: {
            type: 'string',
            'x-control': ControlType.selectSingle,
            dataSource: { source: 'collection', collection: DataType.crm_form, value: 'name', label: 'name' },
            description: 'kind=form. The form that must be saved (W-4, W-9, profile…)',
          },
          signoff: {
            type: 'object',
            collapsible: true,
            description: 'kind=signoff. Observed floor sign-off; each observation is a bm_signoff record',
            properties: {
              stations: { type: 'array', items: { type: 'string' }, description: 'Stations/areas this qualifies for — matches bm_schedule.station' },
              checklist: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    key: { type: 'string' },
                    label: { type: 'string' },
                    required: { type: 'boolean', default: true },
                    photoRequired: { type: 'boolean', default: false },
                  },
                },
              },
              observerRoles: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
                items: { type: 'string' },
                description: 'Who may observe and sign off. Empty = the person’s manager',
              },
              prerequisiteRuleIds: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                dataSource: { source: 'collection', collection: DataType.bm_requirement_rule, value: 'sk', label: 'title' },
                items: { type: 'string' },
                description: 'Course/quiz rules that must be met before the sign-off counts',
              },
            },
          },
          task: {
            type: 'object',
            collapsible: true,
            description: 'kind=task. A one-off item done by the person or someone for them',
            properties: {
              title: { type: 'string' },
              instructions: { type: 'string', 'x-control-variant': 'textarea' },
              assigneeRelation: {
                type: 'string',
                enum: ['hire', 'manager', 'hr', 'it', 'buddy', 'location_manager', 'payroll', 'role'],
                default: 'hire',
              },
              assigneeRole: {
                type: 'string',
                'x-control': ControlType.selectSingle,
                dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
                description: 'When assigneeRelation = role',
              },
            },
          },
        },
      },

      // ----- Who it applies to -----
      appliesTo: {
        type: 'object',
        collapsible: true,
        properties: {
          ...ReadinessScopeProperties(),
          stations: {
            type: 'array',
            items: { type: 'string' },
            description: 'Only while working these stations/areas (bm_schedule.station). Empty = any',
          },
          minEmployerHeadcount: { type: 'number', description: 'Applies only when the org has at least this many employees (e.g. 5+)' },
          minDaysEmployed: { type: 'number', description: 'Only people employed at least this many days (from the start date), e.g. NYC 90' },
          hoursWorkedInYearOver: {
            type: 'number',
            description: 'Only people who worked more than this many hours in the current or previous calendar year, from timesheets (e.g. NYC 80). Ignored when the org keeps no timesheets',
          },
          ageUnder: { type: 'number', description: 'Only people younger than this (minor work permits)' },
        },
      },

      // ----- Supervisor variant -----
      supervisorVariant: {
        type: 'object',
        collapsible: true,
        description: 'Different content or hours for supervisors (e.g. 2h vs 1h harassment prevention)',
        properties: {
          enabled: { type: 'boolean', default: false },
          supervisorRoles: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
            items: { type: 'string' },
          },
          supervisorJobLevels: { type: 'array', items: { type: 'string' } },
          hasDirectReports: { type: 'boolean', default: true, description: 'Anyone with direct reports counts as a supervisor' },
          supervisorCourseIds: {
            type: 'array',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            dataSource: { source: 'collection', collection: DataType.bm_course, value: 'sk', label: 'title' },
            items: { type: 'string' },
          },
          supervisorMinHours: { type: 'number' },
          nonSupervisorMinHours: { type: 'number' },
        },
      },

      // ----- When it is due, how often it renews -----
      due: {
        type: 'object',
        collapsible: true,
        properties: {
          dueFrom: {
            type: 'string',
            enum: DUE_FROM,
            default: 'start_date',
            description: 'threshold_met = the day the person first met the hours/days conditions in appliesTo',
          },
          dueWithinDays: { type: 'number', description: 'Days after dueFrom. Ignored for before_first_shift' },
          dueWithinHoursWorked: {
            type: 'number',
            description: 'Or within this many hours worked after dueFrom, whichever comes first (from timesheets), e.g. 100',
          },
          cadence: {
            type: 'string',
            enum: DUE_CADENCES,
            default: 'rolling',
            description: 'rolling = renewalMonths after each completion. training_year = once in every training year, due by its last day',
          },
          trainingYearStart: {
            type: 'string',
            pattern: '^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$',
            default: '01-01',
            description: 'MM-DD the training year starts, for cadence = training_year (01-01 calendar year, 07-01 July–June)',
          },
          renewalMonths: { type: 'number', description: 'Empty = never renews' },
          renewBeforeDays: { type: 'number', default: 60, description: 'Open the next cycle this many days before expiry' },
        },
      },

      // ----- What proves it -----
      evidence: {
        type: 'object',
        collapsible: true,
        properties: {
          method: {
            type: 'string',
            enum: ['completion', 'upload', 'signature', 'acknowledgement', 'form_saved', 'observed_signoff', 'manual'],
            default: 'completion',
          },
          expiryRequired: { type: 'boolean', default: false, description: 'Upload must carry a valid expiry date' },
          verifiedByManager: { type: 'boolean', default: false },
          signatureRequired: { type: 'boolean', default: false },
          minScore: { type: 'number', description: 'Minimum passing score for course/quiz evidence' },
          keepCourseVersion: { type: 'boolean', default: false, description: 'Record the course/policy version with the proof' },
        },
      },

      // ----- Enforcement per gate -----
      enforcement: {
        type: 'object',
        collapsible: true,
        description: 'What happens at each place work is done while the requirement is missing',
        properties: {
          scheduler: GateEffectSchema(),
          clockIn: GateEffectSchema(),
          pos: {
            type: 'object',
            properties: {
              effect: { type: 'string', enum: GATE_EFFECTS, default: 'none' },
              graceDays: { type: 'number', minimum: 0, default: 0 },
              permissionScope: { type: 'string', description: 'Only this POS permission is gated, e.g. alcohol. Empty = the whole register' },
            },
          },
          // Stored key stays `kitchenStation`; any work line with stations (prep, assembly, service bay).
          kitchenStation: { ...GateEffectSchema(), title: 'Work station', description: 'Moving a ticket at a station (prep line, assembly, service bay) needs this requirement' },
          payroll: GateEffectSchema(),
          access: {
            type: 'object',
            description: 'Role permissions that switch on only once the requirement is met',
            properties: {
              effect: { type: 'string', enum: GATE_EFFECTS, default: 'none' },
              graceDays: { type: 'number', minimum: 0, default: 0 },
              gatedRoles: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                dataSource: { source: 'collection', collection: DataType.userrole, value: 'name', label: 'name' },
                items: { type: 'string' },
              },
              gatedGroups: {
                type: 'array',
                'x-control': ControlType.selectMany,
                'x-control-variant': 'chip',
                dataSource: { source: 'collection', collection: DataType.usergroup, value: 'name', label: 'name' },
                items: { type: 'string' },
              },
            },
          },
        },
      },

      // ----- Escalation ladder -----
      escalation: {
        type: 'object',
        collapsible: true,
        properties: {
          reminderDays: { type: 'array', items: { type: 'number' }, default: [60, 30, 14, 7], description: 'Days before due/expiry to remind the person' },
          notifyManagerAtDays: { type: 'number', default: 14 },
          notifyHrAtDays: { type: 'number', default: 7 },
          flagShiftsAtDays: { type: 'number', default: 7, description: 'Badge affected future shifts on the schedule' },
          reofferShiftsOnBlock: { type: 'boolean', default: false, description: 'When a block applies, offer affected shifts to qualified staff' },
        },
      },

      // ----- Where the rule came from -----
      source: {
        type: 'object',
        collapsible: true,
        properties: {
          type: { type: 'string', enum: ['custom', 'jurisdiction_pack'], default: 'custom' },
          packId: { type: 'string' },
          packVersion: { type: 'string' },
          packOwner: { type: 'string' },
          reviewDate: { type: 'string', format: 'date' },
          citation: { type: 'string', description: 'Statute or regulation reference' },
          regulatoryBody: { type: 'string' },
        },
      },
      tags: { type: 'array', items: { type: 'string' } },
    },
    required: ['title', 'kind'],
  } as const;
};

// ========== Requirement Status (append-only ledger) ==========

export const RequirementStatusSchema = () => {
  return {
    type: 'object',
    description: 'Append-only. One entry per status change, override or waiver; never edited in place.',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::rst-', 'random-string::8', 'uppercase'],
        group: 'name',
      },
      entryType: {
        type: 'string',
        enum: ['status', 'override', 'waiver'],
        default: 'status',
        readOnly: true,
        group: 'type',
      },
      employeeId: {
        type: 'string',
        readOnly: true,
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_employee, value: 'employeeId', label: ['employeeId', 'name'] },
        group: 'employee',
      },
      employeeName: { type: 'string', readOnly: true, group: 'employee' },
      requirementId: {
        type: 'string',
        readOnly: true,
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_requirement_rule, value: 'sk', label: 'title' },
        group: 'requirement',
      },
      requirementTitle: { type: 'string', readOnly: true, group: 'requirement' },
      status: { type: 'string', enum: REQUIREMENT_STATUSES, readOnly: true, group: 'type' },
      from: { type: 'string', format: 'date-time', readOnly: true, description: 'This status holds from…', group: 'period' },
      to: { type: 'string', format: 'date-time', readOnly: true, description: '…until. Empty = current', group: 'period' },
      dueDate: { type: 'string', format: 'date', readOnly: true },
      expiresAt: { type: 'string', format: 'date-time', readOnly: true, description: 'When the evidence expires' },
      cycle: { type: 'number', default: 1, readOnly: true, description: 'Renewal cycle, 1 = first time' },
      businessLocation: { type: 'string', readOnly: true, description: 'Work location when the entry was written' },
      evidence: {
        type: 'object',
        readOnly: true,
        properties: {
          datatype: { type: 'string', description: 'bm_course_enrollment, bm_employee_document, bm_policy_acknowledgement, bm_signoff, crm_form_submission, task…' },
          id: { type: 'string' },
          version: { type: 'number', description: 'Course/policy version the evidence was for' },
        },
      },
      sourceEvent: {
        type: 'string',
        readOnly: true,
        enum: [
          'hire',
          'assignment',
          'role_change',
          'promotion',
          'transfer',
          'evidence_received',
          'evidence_rejected',
          'due_soon',
          'overdue',
          'expired',
          'renewal_opened',
          'rule_changed',
          'override',
          'waiver',
          'recalculation',
        ],
      },
      override: {
        type: 'object',
        readOnly: true,
        description: 'entryType = override or waiver',
        properties: {
          reasonCode: {
            type: 'string',
            enum: ['renewal_booked', 'awaiting_document', 'training_scheduled', 'business_need', 'not_applicable', 'system_error', 'other'],
          },
          reason: { type: 'string' },
          approverId: { type: 'string' },
          approverName: { type: 'string' },
          expiresAt: { type: 'string', format: 'date-time' },
          gate: { type: 'string', enum: [...REQUIREMENT_GATES, 'all'] },
          shiftId: { type: 'string', description: 'When the override was for one shift' },
        },
      },
      previousEntryId: { type: 'string', readOnly: true },
    },
    required: ['employeeId', 'requirementId', 'entryType'],
  } as const;
};

// Type exports
const reqRule = RequirementRuleSchema();
export type RequirementRuleModel = FromSchema<typeof reqRule>;

const reqStatus = RequirementStatusSchema();
export type RequirementStatusModel = FromSchema<typeof reqStatus>;

// Register collections
registerCollection('Requirement Rule', DataType.bm_requirement_rule, RequirementRuleSchema());
registerCollection('Requirement Status', DataType.bm_requirement_status, RequirementStatusSchema());
