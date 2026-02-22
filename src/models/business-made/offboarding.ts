import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// ========== Offboarding ==========

export const OffboardingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::off-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeEmail: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      employeePosition: { type: 'string', group: 'employee' },
      employeeManager: { type: 'string', group: 'employee' },
      hireDate: { type: 'string', format: 'date' },
      terminationType: {
        type: 'string',
        enum: ['voluntary-resignation', 'involuntary-termination', 'layoff', 'retirement', 'end-of-contract', 'mutual-agreement', 'death', 'other'],
        group: 'type',
      },
      terminationReason: {
        type: 'string',
        enum: [
          'new-opportunity',
          'relocation',
          'career-change',
          'personal-reasons',
          'family-reasons',
          'health',
          'retirement',
          'compensation',
          'management',
          'culture-fit',
          'performance',
          'policy-violation',
          'misconduct',
          'restructuring',
          'position-elimination',
          'contract-end',
          'other',
        ],
      },
      reasonDetails: { type: 'string', 'x-control-variant': 'textarea' },
      resignationDate: { type: 'string', format: 'date' },
      noticeDate: { type: 'string', format: 'date' },
      lastWorkingDate: { type: 'string', format: 'date', group: 'dates' },
      terminationDate: { type: 'string', format: 'date', group: 'dates' },
      noticePeriodDays: { type: 'number' },
      noticePeriodWaived: { type: 'boolean', default: false },
      gardenLeave: { type: 'boolean', default: false },
      status: {
        type: 'string',
        enum: ['initiated', 'in-progress', 'pending-exit-interview', 'pending-clearance', 'completed', 'cancelled'],
        default: 'initiated',
        group: 'status',
      },
      checklist: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            category: {
              type: 'string',
              enum: ['hr', 'it', 'finance', 'facilities', 'manager', 'employee'],
            },
            task: { type: 'string' },
            description: { type: 'string' },
            assignedTo: { type: 'string' },
            assignedToName: { type: 'string' },
            dueDate: { type: 'string', format: 'date' },
            status: { type: 'string', enum: ['pending', 'in-progress', 'completed', 'not-applicable'] },
            completedAt: { type: 'string', format: 'date-time' },
            completedBy: { type: 'string' },
            notes: { type: 'string' },
            required: { type: 'boolean', default: true },
          },
        },
      },
      knowledgeTransfer: {
        type: 'object',
        collapsible: true,
        properties: {
          required: { type: 'boolean', default: true },
          successor: { type: 'string' },
          successorName: { type: 'string' },
          documents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                fileId: { type: 'string' },
                uploadedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          sessions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                topic: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                attendees: { type: 'array', items: { type: 'string' } },
                notes: { type: 'string' },
                status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
              },
            },
          },
          status: { type: 'string', enum: ['not-started', 'in-progress', 'completed'] },
          completedAt: { type: 'string', format: 'date-time' },
        },
      },
      equipmentReturn: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            item: { type: 'string' },
            assetTag: { type: 'string' },
            serialNumber: { type: 'string' },
            condition: { type: 'string', enum: ['good', 'fair', 'poor', 'damaged'] },
            returned: { type: 'boolean' },
            returnedAt: { type: 'string', format: 'date-time' },
            receivedBy: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
      accessRevocation: {
        type: 'object',
        collapsible: true,
        properties: {
          emailDeactivated: { type: 'boolean' },
          emailDeactivatedAt: { type: 'string', format: 'date-time' },
          systemAccessRevoked: { type: 'boolean' },
          systemAccessRevokedAt: { type: 'string', format: 'date-time' },
          badgeDeactivated: { type: 'boolean' },
          badgeDeactivatedAt: { type: 'string', format: 'date-time' },
          parkingRevoked: { type: 'boolean' },
          vpnRevoked: { type: 'boolean' },
          systems: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                system: { type: 'string' },
                accessRevoked: { type: 'boolean' },
                revokedAt: { type: 'string', format: 'date-time' },
                revokedBy: { type: 'string' },
              },
            },
          },
        },
      },
      finalPay: {
        type: 'object',
        collapsible: true,
        properties: {
          regularPayThrough: { type: 'string', format: 'date' },
          accruedPtoHours: { type: 'number' },
          ptoPayoutAmount: { type: 'number' },
          unpaidExpenses: { type: 'number' },
          bonusOwed: { type: 'number' },
          deductions: { type: 'number' },
          severanceAmount: { type: 'number' },
          severanceWeeks: { type: 'number' },
          totalFinalPay: { type: 'number' },
          paymentDate: { type: 'string', format: 'date' },
          paymentMethod: { type: 'string', enum: ['direct-deposit', 'check', 'wire'] },
          processed: { type: 'boolean' },
          processedAt: { type: 'string', format: 'date-time' },
        },
      },
      benefits: {
        type: 'object',
        collapsible: true,
        properties: {
          cobraEligible: { type: 'boolean' },
          cobraNotificationSent: { type: 'boolean' },
          cobraNotificationDate: { type: 'string', format: 'date' },
          benefitsEndDate: { type: 'string', format: 'date' },
          retirement401kInfo: { type: 'string' },
          lifeInsuranceConversion: { type: 'boolean' },
          outplacementOffered: { type: 'boolean' },
        },
      },
      agreements: {
        type: 'object',
        collapsible: true,
        properties: {
          severanceAgreement: {
            type: 'object',
            properties: {
              offered: { type: 'boolean' },
              signed: { type: 'boolean' },
              signedAt: { type: 'string', format: 'date-time' },
              documentId: { type: 'string' },
            },
          },
          nonCompeteReminder: { type: 'boolean' },
          ndaReminder: { type: 'boolean' },
          intellectualPropertyAgreement: { type: 'boolean' },
        },
      },
      exitInterviewId: { type: 'string' },
      exitInterviewCompleted: { type: 'boolean', default: false },
      rehireEligible: { type: 'boolean' },
      rehireNotes: { type: 'string' },
      references: {
        type: 'object',
        properties: {
          canProvideReference: { type: 'boolean' },
          referenceContact: { type: 'string' },
          referencePolicy: { type: 'string' },
        },
      },
      hrRepId: { type: 'string' },
      hrRepName: { type: 'string' },
      completedAt: { type: 'string', format: 'date-time' },
      completedBy: { type: 'string' },
      documents: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            fileId: { type: 'string' },
            fileName: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'terminationType', 'lastWorkingDate'],
  } as const;
};

// ========== Exit Interview ==========

export const ExitInterviewSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::exit-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      offboardingId: { type: 'string' },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      employeePosition: { type: 'string', group: 'employee' },
      employeeTenureYears: { type: 'number' },
      interviewerId: { type: 'string', group: 'interviewer' },
      interviewerName: { type: 'string', group: 'interviewer' },
      interviewType: {
        type: 'string',
        enum: ['in-person', 'video', 'phone', 'written-survey'],
        group: 'type',
      },
      scheduledDate: { type: 'string', format: 'date-time' },
      conductedDate: { type: 'string', format: 'date-time' },
      duration: { type: 'number', description: 'Minutes' },
      status: {
        type: 'string',
        enum: ['scheduled', 'completed', 'declined', 'no-show', 'cancelled'],
        default: 'scheduled',
        group: 'status',
      },
      declineReason: { type: 'string' },
      primaryReasonForLeaving: {
        type: 'string',
        enum: [
          'better-opportunity',
          'compensation',
          'benefits',
          'career-growth',
          'work-life-balance',
          'management',
          'company-culture',
          'job-satisfaction',
          'relocation',
          'personal-reasons',
          'retirement',
          'other',
        ],
      },
      responses: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            questionId: { type: 'string' },
            question: { type: 'string' },
            category: {
              type: 'string',
              enum: [
                'reason-for-leaving',
                'job-satisfaction',
                'management',
                'compensation',
                'work-environment',
                'career-development',
                'company-culture',
                'recommendations',
              ],
            },
            responseType: { type: 'string', enum: ['rating', 'text', 'multiple-choice', 'yes-no'] },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            textResponse: { type: 'string' },
            selectedOption: { type: 'string' },
          },
        },
      },
      ratings: {
        type: 'object',
        collapsible: true,
        properties: {
          overallSatisfaction: { type: 'number', minimum: 1, maximum: 5 },
          managementSupport: { type: 'number', minimum: 1, maximum: 5 },
          workLifeBalance: { type: 'number', minimum: 1, maximum: 5 },
          compensationFairness: { type: 'number', minimum: 1, maximum: 5 },
          careerGrowth: { type: 'number', minimum: 1, maximum: 5 },
          companyCulture: { type: 'number', minimum: 1, maximum: 5 },
          teamDynamics: { type: 'number', minimum: 1, maximum: 5 },
          workEnvironment: { type: 'number', minimum: 1, maximum: 5 },
          trainingDevelopment: { type: 'number', minimum: 1, maximum: 5 },
          communication: { type: 'number', minimum: 1, maximum: 5 },
        },
      },
      feedback: {
        type: 'object',
        collapsible: true,
        properties: {
          whatWorkedWell: { type: 'string', 'x-control-variant': 'textarea' },
          whatCouldImprove: { type: 'string', 'x-control-variant': 'textarea' },
          managementFeedback: { type: 'string', 'x-control-variant': 'textarea' },
          teamFeedback: { type: 'string', 'x-control-variant': 'textarea' },
          trainingFeedback: { type: 'string', 'x-control-variant': 'textarea' },
          recommendationsForCompany: { type: 'string', 'x-control-variant': 'textarea' },
          additionalComments: { type: 'string', 'x-control-variant': 'textarea' },
        },
      },
      wouldRecommend: { type: 'boolean' },
      wouldRejoin: { type: 'boolean' },
      conditionsToRejoin: { type: 'string' },
      newEmployerInfo: {
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          industry: { type: 'string' },
          position: { type: 'string' },
          isCompetitor: { type: 'boolean' },
        },
      },
      actionItems: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            description: { type: 'string' },
            category: { type: 'string' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            assignedTo: { type: 'string' },
            status: { type: 'string', enum: ['open', 'in-progress', 'closed'] },
            dueDate: { type: 'string', format: 'date' },
          },
        },
      },
      summary: { type: 'string', 'x-control-variant': 'textarea' },
      confidential: { type: 'boolean', default: true },
      shareWithManager: { type: 'boolean', default: false },
      shareWithLeadership: { type: 'boolean', default: false },
      attachments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileId: { type: 'string' },
            fileName: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      interviewerNotes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'interviewerId', 'interviewType'],
  } as const;
};

// Type exports
const off = OffboardingSchema();
export type OffboardingModel = FromSchema<typeof off>;

const exit = ExitInterviewSchema();
export type ExitInterviewModel = FromSchema<typeof exit>;

// Register collections
registerCollection('Offboarding', DataType.bm_offboarding, OffboardingSchema());
registerCollection('Exit Interview', DataType.bm_exit_interview, ExitInterviewSchema());
