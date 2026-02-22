import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// ========== Department ==========

export const DepartmentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::dept-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      code: {
        type: 'string',
        pattern: '^[A-Z0-9_-]+$',
        unique: true,
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      parentDepartmentId: { type: 'string' },
      parentDepartmentName: { type: 'string' },
      level: { type: 'number', description: 'Hierarchy level (1 = top)' },
      path: { type: 'string', description: 'Full path in hierarchy' },
      headId: { type: 'string', group: 'head' },
      headName: { type: 'string', group: 'head' },
      headTitle: { type: 'string', group: 'head' },
      type: {
        type: 'string',
        enum: ['business-unit', 'division', 'department', 'team', 'group'],
        group: 'type',
      },
      function: {
        type: 'string',
        enum: ['operations', 'sales', 'marketing', 'finance', 'hr', 'engineering', 'product', 'customer-success', 'legal', 'it', 'admin', 'executive', 'other'],
      },
      costCenter: { type: 'string' },
      budgetCode: { type: 'string' },
      location: {
        type: 'object',
        properties: {
          primary: { type: 'string' },
          additional: { type: 'array', items: { type: 'string' } },
        },
      },
      headcount: {
        type: 'object',
        properties: {
          current: { type: 'number' },
          approved: { type: 'number' },
          open: { type: 'number' },
        },
      },
      budget: {
        type: 'object',
        collapsible: true,
        properties: {
          fiscalYear: { type: 'number' },
          totalBudget: { type: 'number' },
          personnelBudget: { type: 'number' },
          operatingBudget: { type: 'number' },
          spent: { type: 'number' },
          remaining: { type: 'number' },
        },
      },
      contact: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          phone: { type: 'string' },
          slackChannel: { type: 'string' },
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'pending', 'dissolved'],
        default: 'active',
        group: 'status',
      },
      effectiveDate: { type: 'string', format: 'date' },
      dissolvedDate: { type: 'string', format: 'date' },
      sortOrder: { type: 'number', default: 0 },
      color: {
        type: 'string',
        'x-control': ControlType.color,
      },
      icon: { type: 'string' },
      metadata: {
        type: 'object',
        additionalProperties: true,
      },
    },
    required: ['code', 'title'],
  } as const;
};

// ========== Job Position ==========

export const JobPositionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::pos-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      code: {
        type: 'string',
        pattern: '^[A-Z0-9_-]+$',
        unique: true,
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      departmentId: { type: 'string', group: 'department' },
      departmentName: { type: 'string', group: 'department' },
      reportsToPositionId: { type: 'string' },
      reportsToPositionTitle: { type: 'string' },
      jobFamily: { type: 'string' },
      level: {
        type: 'string',
        enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'vp', 'c-level'],
        group: 'level',
      },
      salaryGradeId: { type: 'string' },
      salaryGradeCode: { type: 'string' },
      employmentType: {
        type: 'string',
        enum: ['full-time', 'part-time', 'contract', 'temporary', 'intern'],
        group: 'type',
      },
      exempt: { type: 'boolean', default: true, description: 'FLSA exempt status' },
      location: {
        type: 'object',
        properties: {
          primary: { type: 'string' },
          remoteEligible: { type: 'boolean', default: false },
          hybridEligible: { type: 'boolean', default: false },
        },
      },
      headcount: {
        type: 'object',
        properties: {
          approved: { type: 'number' },
          filled: { type: 'number' },
          open: { type: 'number' },
        },
      },
      responsibilities: { type: 'array', items: { type: 'string' } },
      qualifications: {
        type: 'object',
        collapsible: true,
        properties: {
          education: { type: 'string' },
          experienceYears: { type: 'number' },
          requiredSkills: { type: 'array', items: { type: 'string' } },
          preferredSkills: { type: 'array', items: { type: 'string' } },
          certifications: { type: 'array', items: { type: 'string' } },
          languages: { type: 'array', items: { type: 'string' } },
        },
      },
      competencies: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            competency: { type: 'string' },
            requiredLevel: { type: 'number', minimum: 1, maximum: 5 },
            weight: { type: 'number' },
          },
        },
      },
      workingConditions: {
        type: 'object',
        properties: {
          travelRequired: { type: 'boolean', default: false },
          travelPercentage: { type: 'number' },
          physicalRequirements: { type: 'string' },
          shiftWork: { type: 'boolean', default: false },
          onCall: { type: 'boolean', default: false },
        },
      },
      benefits: {
        type: 'object',
        properties: {
          eligibleForBonus: { type: 'boolean', default: true },
          eligibleForEquity: { type: 'boolean', default: false },
          additionalBenefits: { type: 'array', items: { type: 'string' } },
        },
      },
      careerPath: {
        type: 'object',
        collapsible: true,
        properties: {
          nextPositions: { type: 'array', items: { type: 'string' } },
          previousPositions: { type: 'array', items: { type: 'string' } },
          lateralMoves: { type: 'array', items: { type: 'string' } },
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'frozen', 'eliminated'],
        default: 'active',
        group: 'status',
      },
      effectiveDate: { type: 'string', format: 'date' },
      eliminatedDate: { type: 'string', format: 'date' },
      jobPostingId: { type: 'string' },
      eeocCategory: {
        type: 'string',
        enum: ['executive', 'first-mid-officials-managers', 'professionals', 'technicians', 'sales-workers', 'administrative-support', 'craft-workers', 'operatives', 'laborers', 'service-workers'],
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['code', 'title', 'departmentId'],
  } as const;
};

// ========== Org Chart ==========

export const OrgChartSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::org-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      type: {
        type: 'string',
        enum: ['company', 'department', 'team', 'project', 'matrix'],
        group: 'type',
      },
      rootNodeId: { type: 'string' },
      nodes: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['employee', 'position', 'department', 'placeholder'] },
            entityId: { type: 'string' },
            label: { type: 'string' },
            title: { type: 'string' },
            imageUrl: { type: 'string' },
            parentId: { type: 'string' },
            children: { type: 'array', items: { type: 'string' } },
            metadata: { type: 'object' },
            x: { type: 'number' },
            y: { type: 'number' },
            collapsed: { type: 'boolean', default: false },
          },
        },
      },
      relationships: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            type: { type: 'string', enum: ['reporting', 'dotted-line', 'advisory', 'project'] },
            sourceId: { type: 'string' },
            targetId: { type: 'string' },
            label: { type: 'string' },
          },
        },
      },
      layout: {
        type: 'object',
        properties: {
          direction: { type: 'string', enum: ['top-down', 'left-right', 'bottom-up', 'right-left'] },
          alignment: { type: 'string', enum: ['center', 'left', 'right'] },
          nodeSpacing: { type: 'number' },
          levelSpacing: { type: 'number' },
        },
      },
      display: {
        type: 'object',
        properties: {
          showPhotos: { type: 'boolean', default: true },
          showTitles: { type: 'boolean', default: true },
          showDepartments: { type: 'boolean', default: true },
          showHeadcount: { type: 'boolean', default: false },
          showVacancies: { type: 'boolean', default: false },
          colorByDepartment: { type: 'boolean', default: true },
        },
      },
      filters: {
        type: 'object',
        properties: {
          departments: { type: 'array', items: { type: 'string' } },
          locations: { type: 'array', items: { type: 'string' } },
          levels: { type: 'array', items: { type: 'string' } },
          employmentTypes: { type: 'array', items: { type: 'string' } },
        },
      },
      asOfDate: { type: 'string', format: 'date' },
      version: { type: 'number', default: 1 },
      status: {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
        group: 'status',
      },
      publishedAt: { type: 'string', format: 'date-time' },
      publishedBy: { type: 'string' },
      isDefault: { type: 'boolean', default: false },
      accessControl: {
        type: 'object',
        properties: {
          visibility: { type: 'string', enum: ['public', 'internal', 'restricted'] },
          allowedRoles: { type: 'array', items: { type: 'string' } },
          allowedDepartments: { type: 'array', items: { type: 'string' } },
        },
      },
      lastSyncedAt: { type: 'string', format: 'date-time' },
      autoSync: { type: 'boolean', default: false },
    },
    required: ['title', 'type'],
  } as const;
};

// Type exports
const dept = DepartmentSchema();
export type DepartmentModel = FromSchema<typeof dept>;

const pos = JobPositionSchema();
export type JobPositionModel = FromSchema<typeof pos>;

const org = OrgChartSchema();
export type OrgChartModel = FromSchema<typeof org>;

// Register collections
registerCollection('Department', DataType.bm_department, DepartmentSchema());
registerCollection('Job Position', DataType.bm_position, JobPositionSchema());
registerCollection('Org Chart', DataType.bm_org_chart, OrgChartSchema());
