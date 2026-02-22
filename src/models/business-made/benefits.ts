import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// ========== HR Benefit Plan ==========

export const HRBenefitPlanSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::bp-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      type: {
        type: 'string',
        enum: [
          'health',
          'dental',
          'vision',
          'life',
          'disability-short-term',
          'disability-long-term',
          'retirement-401k',
          'hsa',
          'fsa',
          'commuter',
          'wellness',
          'employee-assistance',
          'tuition-reimbursement',
          'other',
        ],
        group: 'type',
      },
      category: {
        type: 'string',
        enum: ['medical', 'financial', 'lifestyle', 'retirement', 'insurance'],
        group: 'type',
      },
      provider: {
        type: 'object',
        collapsible: true,
        properties: {
          name: { type: 'string', group: 'provider' },
          planId: { type: 'string', group: 'provider' },
          groupNumber: { type: 'string' },
          contactPhone: { type: 'string' },
          contactEmail: { type: 'string' },
          website: { type: 'string' },
        },
      },
      coverage: {
        type: 'object',
        collapsible: true,
        properties: {
          tiers: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tier: {
                  type: 'string',
                  enum: ['employee-only', 'employee-spouse', 'employee-children', 'family'],
                },
                employeeCost: { type: 'number' },
                employerCost: { type: 'number' },
                totalCost: { type: 'number' },
                frequency: {
                  type: 'string',
                  enum: ['per-pay-period', 'monthly', 'annually'],
                },
              },
            },
          },
          deductible: { type: 'number' },
          outOfPocketMax: { type: 'number' },
          coinsurance: { type: 'number', description: 'Percentage' },
          copay: { type: 'number' },
          coverageDetails: { type: 'string', 'x-control-variant': 'textarea' },
        },
      },
      eligibility: {
        type: 'object',
        collapsible: true,
        properties: {
          employmentTypes: {
            type: 'array',
            items: {
              type: 'string',
              enum: ['full-time', 'part-time', 'contract'],
            },
          },
          waitingPeriodDays: { type: 'number', default: 0 },
          minHoursPerWeek: { type: 'number' },
          eligibleDepartments: {
            type: 'array',
            items: { type: 'string' },
          },
          eligibleLocations: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      enrollment: {
        type: 'object',
        collapsible: true,
        properties: {
          openEnrollmentStart: { type: 'string', format: 'date' },
          openEnrollmentEnd: { type: 'string', format: 'date' },
          effectiveDate: { type: 'string', format: 'date' },
          allowMidYearChanges: { type: 'boolean', default: false },
          qualifyingLifeEvents: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      documents: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            type: { type: 'string', enum: ['summary', 'full-plan', 'enrollment-form', 'other'] },
            fileId: { type: 'string' },
            url: { type: 'string' },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive', 'discontinued'],
        default: 'draft',
        group: 'status',
      },
      planYear: { type: 'number' },
      startDate: { type: 'string', format: 'date' },
      endDate: { type: 'string', format: 'date' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['title', 'type', 'category'],
  } as const;
};

// ========== HR Benefit Enrollment ==========

export const HRBenefitEnrollmentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::be-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      benefitPlanId: { type: 'string', group: 'plan' },
      benefitPlanName: { type: 'string', group: 'plan' },
      benefitType: { type: 'string', group: 'plan' },
      coverageTier: {
        type: 'string',
        enum: ['employee-only', 'employee-spouse', 'employee-children', 'family'],
        group: 'coverage',
      },
      dependents: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string', group: 'name' },
            lastName: { type: 'string', group: 'name' },
            relationship: {
              type: 'string',
              enum: ['spouse', 'domestic-partner', 'child', 'other'],
            },
            dateOfBirth: { type: 'string', format: 'date' },
            ssn: { type: 'string' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            isStudent: { type: 'boolean' },
            isDisabled: { type: 'boolean' },
            primaryCareProvider: { type: 'string' },
          },
          required: ['firstName', 'lastName', 'relationship', 'dateOfBirth'],
        },
      },
      beneficiaries: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            firstName: { type: 'string', group: 'name' },
            lastName: { type: 'string', group: 'name' },
            relationship: { type: 'string' },
            percentage: { type: 'number', minimum: 0, maximum: 100 },
            type: { type: 'string', enum: ['primary', 'contingent'] },
            dateOfBirth: { type: 'string', format: 'date' },
            ssn: { type: 'string' },
            address: { type: 'string' },
          },
          required: ['firstName', 'lastName', 'percentage', 'type'],
        },
      },
      employeeContribution: { type: 'number', group: 'cost' },
      employerContribution: { type: 'number', group: 'cost' },
      totalCost: { type: 'number', group: 'cost' },
      contributionFrequency: {
        type: 'string',
        enum: ['per-pay-period', 'monthly', 'annually'],
        group: 'cost',
      },
      status: {
        type: 'string',
        enum: ['pending', 'active', 'pending-termination', 'terminated', 'waived', 'declined'],
        default: 'pending',
        group: 'status',
      },
      enrollmentType: {
        type: 'string',
        enum: ['new-hire', 'open-enrollment', 'qualifying-life-event', 'reinstatement'],
        group: 'status',
      },
      qualifyingEvent: {
        type: 'object',
        properties: {
          eventType: {
            type: 'string',
            enum: [
              'marriage',
              'divorce',
              'birth',
              'adoption',
              'death',
              'loss-of-coverage',
              'employment-change',
              'address-change',
              'other',
            ],
          },
          eventDate: { type: 'string', format: 'date' },
          description: { type: 'string' },
          documentation: { type: 'string' },
        },
      },
      coverageStartDate: { type: 'string', format: 'date' },
      coverageEndDate: { type: 'string', format: 'date' },
      enrolledAt: { type: 'string', format: 'date-time' },
      enrolledBy: { type: 'string' },
      terminatedAt: { type: 'string', format: 'date-time' },
      terminatedBy: { type: 'string' },
      terminationReason: { type: 'string' },
      waiverReason: { type: 'string' },
      waiverDocumentation: { type: 'string' },
      electionConfirmation: {
        type: 'object',
        properties: {
          confirmedAt: { type: 'string', format: 'date-time' },
          ipAddress: { type: 'string' },
          signatureId: { type: 'string' },
        },
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'benefitPlanId', 'coverageTier'],
  } as const;
};

// Type exports
const bp = HRBenefitPlanSchema();
export type HRBenefitPlanModel = FromSchema<typeof bp>;

const be = HRBenefitEnrollmentSchema();
export type HRBenefitEnrollmentModel = FromSchema<typeof be>;

// Register collections
registerCollection('HR Benefit Plan', DataType.bm_benefit_plan, HRBenefitPlanSchema());
registerCollection('HR Benefit Enrollment', DataType.bm_benefit_enrollment, HRBenefitEnrollmentSchema());
