import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// ========== Goal ==========

export const GoalSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::goal-', 'random-string::6', 'uppercase'],
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
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      managerId: { type: 'string', group: 'manager' },
      managerName: { type: 'string', group: 'manager' },
      type: {
        type: 'string',
        enum: ['individual', 'team', 'department', 'company'],
        group: 'type',
      },
      category: {
        type: 'string',
        enum: ['performance', 'development', 'project', 'behavioral', 'strategic'],
        group: 'type',
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'medium',
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'on-track', 'at-risk', 'behind', 'completed', 'cancelled'],
        default: 'draft',
        group: 'status',
      },
      startDate: { type: 'string', format: 'date', group: 'dates' },
      dueDate: { type: 'string', format: 'date', group: 'dates' },
      completedDate: { type: 'string', format: 'date' },
      weight: { type: 'number', description: 'Weight in performance evaluation', minimum: 0, maximum: 100 },
      progress: { type: 'number', minimum: 0, maximum: 100, default: 0 },
      keyResults: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            targetValue: { type: 'number' },
            currentValue: { type: 'number' },
            unit: { type: 'string' },
            progress: { type: 'number' },
            status: { type: 'string', enum: ['not-started', 'in-progress', 'completed'] },
          },
        },
      },
      milestones: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            dueDate: { type: 'string', format: 'date' },
            completedDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['pending', 'completed', 'missed'] },
          },
        },
      },
      updates: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            progress: { type: 'number' },
            note: { type: 'string' },
            createdBy: { type: 'string' },
          },
        },
      },
      linkedGoals: { type: 'array', items: { type: 'string' } },
      reviewPeriod: { type: 'string' },
      alignedTo: { type: 'string', description: 'Parent goal or company objective' },
      visibility: {
        type: 'string',
        enum: ['private', 'manager', 'team', 'department', 'company'],
        default: 'manager',
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['title', 'employeeId', 'type', 'startDate', 'dueDate'],
  } as const;
};

// ========== Performance Review ==========

export const PerformanceReviewSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::pr-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      employeePosition: { type: 'string', group: 'employee' },
      reviewerId: { type: 'string', group: 'reviewer' },
      reviewerName: { type: 'string', group: 'reviewer' },
      reviewType: {
        type: 'string',
        enum: ['annual', 'semi-annual', 'quarterly', 'probation', '30-day', '60-day', '90-day', 'promotion', 'ad-hoc'],
        group: 'type',
      },
      reviewPeriod: {
        type: 'object',
        properties: {
          startDate: { type: 'string', format: 'date' },
          endDate: { type: 'string', format: 'date' },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'self-review', 'manager-review', 'calibration', 'completed', 'acknowledged'],
        default: 'draft',
        group: 'status',
      },
      selfAssessment: {
        type: 'object',
        collapsible: true,
        properties: {
          accomplishments: { type: 'string', 'x-control-variant': 'textarea' },
          challenges: { type: 'string', 'x-control-variant': 'textarea' },
          developmentAreas: { type: 'string', 'x-control-variant': 'textarea' },
          careerAspirations: { type: 'string', 'x-control-variant': 'textarea' },
          additionalComments: { type: 'string', 'x-control-variant': 'textarea' },
          submittedAt: { type: 'string', format: 'date-time' },
        },
      },
      competencies: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' },
            selfRating: { type: 'number', minimum: 1, maximum: 5 },
            managerRating: { type: 'number', minimum: 1, maximum: 5 },
            weight: { type: 'number' },
            comments: { type: 'string' },
          },
        },
      },
      goalReview: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            goalId: { type: 'string' },
            goalTitle: { type: 'string' },
            weight: { type: 'number' },
            achievement: { type: 'number', description: 'Percentage achieved' },
            selfRating: { type: 'number', minimum: 1, maximum: 5 },
            managerRating: { type: 'number', minimum: 1, maximum: 5 },
            comments: { type: 'string' },
          },
        },
      },
      overallRating: {
        type: 'object',
        properties: {
          selfRating: { type: 'number', minimum: 1, maximum: 5 },
          managerRating: { type: 'number', minimum: 1, maximum: 5 },
          finalRating: { type: 'number', minimum: 1, maximum: 5 },
          ratingLabel: {
            type: 'string',
            enum: ['exceeds-expectations', 'meets-expectations', 'developing', 'needs-improvement', 'unsatisfactory'],
          },
        },
      },
      managerFeedback: {
        type: 'object',
        collapsible: true,
        properties: {
          strengths: { type: 'string', 'x-control-variant': 'textarea' },
          areasForImprovement: { type: 'string', 'x-control-variant': 'textarea' },
          developmentRecommendations: { type: 'string', 'x-control-variant': 'textarea' },
          overallComments: { type: 'string', 'x-control-variant': 'textarea' },
        },
      },
      developmentPlan: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            area: { type: 'string' },
            action: { type: 'string' },
            resources: { type: 'string' },
            timeline: { type: 'string' },
            status: { type: 'string', enum: ['planned', 'in-progress', 'completed'] },
          },
        },
      },
      calibrationNotes: { type: 'string', 'x-control-variant': 'textarea' },
      compensationRecommendation: {
        type: 'object',
        collapsible: true,
        properties: {
          meritIncrease: { type: 'number' },
          bonus: { type: 'number' },
          promotion: { type: 'boolean' },
          newTitle: { type: 'string' },
          newGrade: { type: 'string' },
          justification: { type: 'string' },
        },
      },
      acknowledgement: {
        type: 'object',
        properties: {
          acknowledgedAt: { type: 'string', format: 'date-time' },
          employeeComments: { type: 'string' },
          signatureId: { type: 'string' },
        },
      },
      nextReviewDate: { type: 'string', format: 'date' },
      reviewMeetingDate: { type: 'string', format: 'date-time' },
      meetingNotes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'reviewerId', 'reviewType'],
  } as const;
};

// ========== Performance Improvement Plan (PIP) ==========

export const PIPSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::pip-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      employeePosition: { type: 'string', group: 'employee' },
      managerId: { type: 'string', group: 'manager' },
      managerName: { type: 'string', group: 'manager' },
      hrRepId: { type: 'string', group: 'hr' },
      hrRepName: { type: 'string', group: 'hr' },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'extended', 'completed-successful', 'completed-unsuccessful', 'cancelled'],
        default: 'draft',
        group: 'status',
      },
      reason: {
        type: 'string',
        enum: ['performance', 'attendance', 'behavior', 'policy-violation', 'skills-gap', 'multiple'],
        group: 'type',
      },
      reasonDetails: { type: 'string', 'x-control-variant': 'textarea' },
      performanceIssues: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            issue: { type: 'string' },
            examples: { type: 'string' },
            expectedStandard: { type: 'string' },
            currentPerformance: { type: 'string' },
          },
        },
      },
      startDate: { type: 'string', format: 'date', group: 'dates' },
      endDate: { type: 'string', format: 'date', group: 'dates' },
      originalEndDate: { type: 'string', format: 'date' },
      extensionCount: { type: 'number', default: 0 },
      improvementGoals: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            measurableCriteria: { type: 'string' },
            targetDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['not-started', 'in-progress', 'met', 'not-met'] },
            evidence: { type: 'string' },
          },
        },
      },
      supportProvided: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: { type: 'string', enum: ['training', 'coaching', 'mentoring', 'resources', 'schedule-adjustment', 'other'] },
            description: { type: 'string' },
            providedBy: { type: 'string' },
            date: { type: 'string', format: 'date' },
          },
        },
      },
      checkIns: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            attendees: { type: 'array', items: { type: 'string' } },
            progressSummary: { type: 'string' },
            goalsReviewed: { type: 'array', items: { type: 'string' } },
            concerns: { type: 'string' },
            nextSteps: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
      consequences: { type: 'string', 'x-control-variant': 'textarea' },
      employeeAcknowledgement: {
        type: 'object',
        properties: {
          acknowledged: { type: 'boolean' },
          acknowledgedAt: { type: 'string', format: 'date-time' },
          employeeComments: { type: 'string' },
          signatureId: { type: 'string' },
        },
      },
      outcome: {
        type: 'object',
        properties: {
          result: { type: 'string', enum: ['successful', 'unsuccessful', 'extended'] },
          summary: { type: 'string' },
          nextAction: { type: 'string', enum: ['none', 'extend-pip', 'demotion', 'termination', 'reassignment'] },
          decisionDate: { type: 'string', format: 'date' },
          decidedBy: { type: 'string' },
        },
      },
      documents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileId: { type: 'string' },
            fileName: { type: 'string' },
            type: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      confidential: { type: 'boolean', default: true },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'managerId', 'reason', 'startDate', 'endDate'],
  } as const;
};

// Type exports
const goal = GoalSchema();
export type GoalModel = FromSchema<typeof goal>;

const pr = PerformanceReviewSchema();
export type PerformanceReviewModel = FromSchema<typeof pr>;

const pip = PIPSchema();
export type PIPModel = FromSchema<typeof pip>;

// Register collections
registerCollection('Goal', DataType.bm_goal, GoalSchema());
registerCollection('Performance Review', DataType.bm_performance_review, PerformanceReviewSchema());
registerCollection('Performance Improvement Plan', DataType.bm_pip, PIPSchema());
