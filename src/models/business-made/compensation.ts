import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// ========== Salary Grade ==========

export const SalaryGradeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::sg-', 'random-string::6', 'uppercase'],
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
      level: { type: 'number', group: 'level' },
      band: {
        type: 'string',
        enum: ['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'executive'],
        group: 'level',
      },
      salaryRange: {
        type: 'object',
        properties: {
          minimum: { type: 'number' },
          midpoint: { type: 'number' },
          maximum: { type: 'number' },
          currency: { type: 'string', default: 'USD' },
        },
      },
      hourlyRange: {
        type: 'object',
        properties: {
          minimum: { type: 'number' },
          midpoint: { type: 'number' },
          maximum: { type: 'number' },
        },
      },
      payFrequency: {
        type: 'string',
        enum: ['hourly', 'weekly', 'bi-weekly', 'semi-monthly', 'monthly', 'annually'],
        default: 'annually',
      },
      exempt: { type: 'boolean', default: true, description: 'FLSA exempt status' },
      targetBonus: {
        type: 'object',
        properties: {
          percentage: { type: 'number' },
          minPercentage: { type: 'number' },
          maxPercentage: { type: 'number' },
        },
      },
      equityEligible: { type: 'boolean', default: false },
      equityRange: {
        type: 'object',
        properties: {
          minShares: { type: 'number' },
          maxShares: { type: 'number' },
          vestingSchedule: { type: 'string' },
        },
      },
      benefits: {
        type: 'object',
        collapsible: true,
        properties: {
          healthInsurance: { type: 'boolean', default: true },
          dentalInsurance: { type: 'boolean', default: true },
          visionInsurance: { type: 'boolean', default: true },
          lifeInsurance: { type: 'boolean', default: true },
          retirement401k: { type: 'boolean', default: true },
          matchPercentage: { type: 'number' },
          ptoAccrualDays: { type: 'number' },
          additionalBenefits: { type: 'array', items: { type: 'string' } },
        },
      },
      jobFamilies: { type: 'array', items: { type: 'string' } },
      positions: { type: 'array', items: { type: 'string' } },
      locations: { type: 'array', items: { type: 'string' } },
      geoDifferential: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            location: { type: 'string' },
            adjustmentPercentage: { type: 'number' },
            adjustedMinimum: { type: 'number' },
            adjustedMaximum: { type: 'number' },
          },
        },
      },
      effectiveDate: { type: 'string', format: 'date' },
      expirationDate: { type: 'string', format: 'date' },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive', 'archived'],
        default: 'draft',
        group: 'status',
      },
      version: { type: 'number', default: 1 },
      previousVersionId: { type: 'string' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['code', 'title', 'level'],
  } as const;
};

// ========== Compensation Change ==========

export const CompensationChangeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::cc-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      employeePosition: { type: 'string', group: 'employee' },
      changeType: {
        type: 'string',
        enum: ['merit-increase', 'promotion', 'market-adjustment', 'equity-adjustment', 'demotion', 'cost-of-living', 'one-time', 'new-hire', 'transfer', 'correction'],
        group: 'type',
      },
      reason: { type: 'string', 'x-control-variant': 'textarea' },
      previousCompensation: {
        type: 'object',
        collapsible: true,
        properties: {
          baseSalary: { type: 'number' },
          hourlyRate: { type: 'number' },
          payFrequency: { type: 'string' },
          salaryGradeId: { type: 'string' },
          salaryGradeCode: { type: 'string' },
          targetBonus: { type: 'number' },
          compaRatio: { type: 'number' },
        },
      },
      newCompensation: {
        type: 'object',
        collapsible: true,
        properties: {
          baseSalary: { type: 'number' },
          hourlyRate: { type: 'number' },
          payFrequency: { type: 'string' },
          salaryGradeId: { type: 'string' },
          salaryGradeCode: { type: 'string' },
          targetBonus: { type: 'number' },
          compaRatio: { type: 'number' },
        },
      },
      changeAmount: { type: 'number', group: 'change' },
      changePercentage: { type: 'number', group: 'change' },
      effectiveDate: { type: 'string', format: 'date', group: 'dates' },
      payrollEffectiveDate: { type: 'string', format: 'date' },
      reviewPeriod: { type: 'string' },
      performanceRating: { type: 'string' },
      promotionDetails: {
        type: 'object',
        collapsible: true,
        properties: {
          previousPositionId: { type: 'string' },
          previousPositionTitle: { type: 'string' },
          newPositionId: { type: 'string' },
          newPositionTitle: { type: 'string' },
          previousDepartment: { type: 'string' },
          newDepartment: { type: 'string' },
        },
      },
      equityChange: {
        type: 'object',
        collapsible: true,
        properties: {
          grantType: { type: 'string', enum: ['stock-options', 'rsu', 'performance-shares'] },
          shares: { type: 'number' },
          grantDate: { type: 'string', format: 'date' },
          vestingSchedule: { type: 'string' },
          expirationDate: { type: 'string', format: 'date' },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'pending-approval', 'approved', 'rejected', 'processed', 'cancelled'],
        default: 'draft',
        group: 'status',
      },
      approvalChain: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            level: { type: 'number' },
            approverId: { type: 'string' },
            approverName: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'skipped'] },
            decidedAt: { type: 'string', format: 'date-time' },
            comments: { type: 'string' },
          },
        },
      },
      requestedBy: { type: 'string' },
      requestedAt: { type: 'string', format: 'date-time' },
      approvedBy: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
      rejectedBy: { type: 'string' },
      rejectedAt: { type: 'string', format: 'date-time' },
      rejectionReason: { type: 'string' },
      processedAt: { type: 'string', format: 'date-time' },
      processedBy: { type: 'string' },
      budgetCode: { type: 'string' },
      fiscalYear: { type: 'number' },
      linkedPerformanceReviewId: { type: 'string' },
      documents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileId: { type: 'string' },
            fileName: { type: 'string' },
            type: { type: 'string' },
          },
        },
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'changeType', 'effectiveDate'],
  } as const;
};

// ========== Bonus ==========

export const BonusSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::bonus-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      bonusType: {
        type: 'string',
        enum: ['performance', 'signing', 'retention', 'referral', 'spot', 'holiday', 'project', 'sales-commission', 'profit-sharing', 'year-end', 'discretionary', 'other'],
        group: 'type',
      },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      amount: { type: 'number', group: 'amount' },
      currency: { type: 'string', default: 'USD', group: 'amount' },
      calculationMethod: {
        type: 'string',
        enum: ['fixed', 'percentage-of-salary', 'formula', 'discretionary'],
      },
      percentageOfSalary: { type: 'number' },
      targetAmount: { type: 'number' },
      actualPerformance: { type: 'number', description: 'Performance multiplier' },
      performancePeriod: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
          fiscalYear: { type: 'number' },
          quarter: { type: 'number' },
        },
      },
      criteria: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            metric: { type: 'string' },
            target: { type: 'number' },
            actual: { type: 'number' },
            weight: { type: 'number' },
            achievement: { type: 'number' },
          },
        },
      },
      paymentDate: { type: 'string', format: 'date', group: 'dates' },
      payrollPeriod: { type: 'string' },
      taxTreatment: {
        type: 'string',
        enum: ['supplemental', 'aggregate', 'gross-up'],
      },
      grossAmount: { type: 'number' },
      netAmount: { type: 'number' },
      deductions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            amount: { type: 'number' },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'pending-approval', 'approved', 'scheduled', 'paid', 'rejected', 'cancelled'],
        default: 'draft',
        group: 'status',
      },
      approvalChain: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            level: { type: 'number' },
            approverId: { type: 'string' },
            approverName: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'skipped'] },
            decidedAt: { type: 'string', format: 'date-time' },
            comments: { type: 'string' },
          },
        },
      },
      requestedBy: { type: 'string' },
      requestedAt: { type: 'string', format: 'date-time' },
      approvedBy: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
      paidAt: { type: 'string', format: 'date-time' },
      payStubId: { type: 'string' },
      payrollRunId: { type: 'string' },
      budgetCode: { type: 'string' },
      costCenter: { type: 'string' },
      linkedReviewId: { type: 'string' },
      linkedProjectId: { type: 'string' },
      clawbackEligible: { type: 'boolean', default: false },
      clawbackPeriodMonths: { type: 'number' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'bonusType', 'amount'],
  } as const;
};

// Type exports
const sg = SalaryGradeSchema();
export type SalaryGradeModel = FromSchema<typeof sg>;

const cc = CompensationChangeSchema();
export type CompensationChangeModel = FromSchema<typeof cc>;

const bonus = BonusSchema();
export type BonusModel = FromSchema<typeof bonus>;

// Register collections
registerCollection('Salary Grade', DataType.bm_salary_grade, SalaryGradeSchema());
registerCollection('Compensation Change', DataType.bm_compensation_change, CompensationChangeSchema());
registerCollection('Bonus', DataType.bm_bonus, BonusSchema());
