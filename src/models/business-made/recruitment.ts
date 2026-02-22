import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// ========== Job Posting ==========

export const JobPostingSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::job-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 200,
        group: 'name',
      },
      department: {
        type: 'string',
        group: 'details',
      },
      location: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.location,
          value: 'name',
          label: 'name',
        },
        group: 'details',
      },
      employmentType: {
        type: 'string',
        enum: ['full-time', 'part-time', 'contract', 'temporary', 'intern'],
        group: 'details',
      },
      workArrangement: {
        type: 'string',
        enum: ['onsite', 'remote', 'hybrid'],
        group: 'details',
      },
      description: {
        type: 'string',
        'x-control': ControlType.richtext,
      },
      responsibilities: {
        type: 'array',
        items: { type: 'string' },
        collapsible: true,
      },
      requirements: {
        type: 'array',
        items: { type: 'string' },
        collapsible: true,
      },
      preferredQualifications: {
        type: 'array',
        items: { type: 'string' },
        collapsible: true,
      },
      skills: {
        type: 'array',
        'x-control-variant': 'chip',
        items: { type: 'string' },
      },
      salary: {
        type: 'object',
        collapsible: true,
        properties: {
          min: { type: 'number', group: 'range' },
          max: { type: 'number', group: 'range' },
          currency: { type: 'string', default: 'USD', group: 'range' },
          period: {
            type: 'string',
            enum: ['hourly', 'weekly', 'monthly', 'annually'],
            default: 'annually',
          },
          showOnPosting: { type: 'boolean', default: false },
        },
      },
      benefits: {
        type: 'array',
        items: { type: 'string' },
        'x-control-variant': 'chip',
      },
      status: {
        type: 'string',
        enum: ['draft', 'open', 'on-hold', 'closed', 'filled', 'cancelled'],
        default: 'draft',
        group: 'status',
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
        group: 'status',
      },
      openings: {
        type: 'number',
        default: 1,
        group: 'status',
      },
      filledCount: {
        type: 'number',
        default: 0,
        readOnly: true,
      },
      hiringManager: {
        type: 'string',
        group: 'team',
      },
      recruiters: {
        type: 'array',
        items: { type: 'string' },
        group: 'team',
      },
      interviewers: {
        type: 'array',
        items: { type: 'string' },
        group: 'team',
      },
      pipeline: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            order: { type: 'number' },
            isDefault: { type: 'boolean' },
          },
        },
        default: [
          { id: 'new', name: 'New', order: 1 },
          { id: 'screening', name: 'Screening', order: 2 },
          { id: 'interview', name: 'Interview', order: 3 },
          { id: 'assessment', name: 'Assessment', order: 4 },
          { id: 'offer', name: 'Offer', order: 5 },
          { id: 'hired', name: 'Hired', order: 6 },
        ],
      },
      postingDate: { type: 'string', format: 'date' },
      closingDate: { type: 'string', format: 'date' },
      publishedAt: { type: 'string', format: 'date-time' },
      externalPostings: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            platform: { type: 'string' },
            url: { type: 'string' },
            postedAt: { type: 'string', format: 'date-time' },
            expiresAt: { type: 'string', format: 'date' },
          },
        },
      },
      applicantCount: { type: 'number', default: 0, readOnly: true },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
    },
    required: ['title', 'department', 'employmentType'],
  } as const;
};

// ========== Applicant ==========

export const ApplicantSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::app-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      jobPostingId: { type: 'string', group: 'job' },
      jobTitle: { type: 'string', group: 'job' },
      personalInfo: {
        type: 'object',
        collapsible: true,
        properties: {
          firstName: { type: 'string', group: 'name' },
          lastName: { type: 'string', group: 'name' },
          email: { type: 'string', format: 'email', group: 'contact' },
          phone: { type: 'string', group: 'contact' },
          linkedIn: { type: 'string' },
          portfolio: { type: 'string' },
          address: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              state: { type: 'string' },
              country: { type: 'string' },
            },
          },
        },
        required: ['firstName', 'lastName', 'email'],
      },
      source: {
        type: 'string',
        enum: ['website', 'linkedin', 'indeed', 'glassdoor', 'referral', 'agency', 'career-fair', 'other'],
        group: 'source',
      },
      referredBy: { type: 'string', group: 'source' },
      resume: {
        type: 'object',
        properties: {
          fileId: { type: 'string' },
          fileName: { type: 'string' },
          uploadedAt: { type: 'string', format: 'date-time' },
          parsedData: { type: 'object' },
        },
      },
      coverLetter: { type: 'string', 'x-control-variant': 'textarea' },
      experience: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            company: { type: 'string' },
            title: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' },
            current: { type: 'boolean' },
            description: { type: 'string' },
          },
        },
      },
      education: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            institution: { type: 'string' },
            degree: { type: 'string' },
            field: { type: 'string' },
            graduationDate: { type: 'string', format: 'date' },
            gpa: { type: 'number' },
          },
        },
      },
      skills: {
        type: 'array',
        items: { type: 'string' },
        'x-control-variant': 'chip',
      },
      stage: {
        type: 'string',
        enum: ['new', 'screening', 'interview', 'assessment', 'offer', 'hired', 'rejected', 'withdrawn'],
        default: 'new',
        group: 'status',
      },
      status: {
        type: 'string',
        enum: ['active', 'on-hold', 'rejected', 'withdrawn', 'hired'],
        default: 'active',
        group: 'status',
      },
      rating: {
        type: 'number',
        minimum: 1,
        maximum: 5,
        group: 'status',
      },
      rejectionReason: { type: 'string' },
      rejectedAt: { type: 'string', format: 'date-time' },
      rejectedBy: { type: 'string' },
      assignedRecruiter: { type: 'string' },
      interviews: {
        type: 'array',
        items: { type: 'string' },
      },
      assessments: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: { type: 'string' },
            name: { type: 'string' },
            score: { type: 'number' },
            maxScore: { type: 'number' },
            completedAt: { type: 'string', format: 'date-time' },
            notes: { type: 'string' },
          },
        },
      },
      feedback: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            reviewerId: { type: 'string' },
            reviewerName: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            recommendation: {
              type: 'string',
              enum: ['strong-yes', 'yes', 'neutral', 'no', 'strong-no'],
            },
            strengths: { type: 'array', items: { type: 'string' } },
            concerns: { type: 'array', items: { type: 'string' } },
            comments: { type: 'string' },
            submittedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      offerId: { type: 'string' },
      expectedSalary: { type: 'number' },
      availableStartDate: { type: 'string', format: 'date' },
      workAuthorization: {
        type: 'string',
        enum: ['citizen', 'permanent-resident', 'visa', 'requires-sponsorship'],
      },
      willingToRelocate: { type: 'boolean' },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        'x-control-variant': 'chip',
      },
      appliedAt: { type: 'string', format: 'date-time' },
    },
    required: ['jobPostingId', 'personalInfo'],
  } as const;
};

// ========== Interview ==========

export const InterviewSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::int-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      applicantId: { type: 'string', group: 'applicant' },
      applicantName: { type: 'string', group: 'applicant' },
      jobPostingId: { type: 'string', group: 'job' },
      jobTitle: { type: 'string', group: 'job' },
      type: {
        type: 'string',
        enum: ['phone-screen', 'video', 'onsite', 'technical', 'panel', 'final'],
        group: 'details',
      },
      round: { type: 'number', default: 1, group: 'details' },
      scheduledAt: { type: 'string', format: 'date-time', group: 'schedule' },
      duration: { type: 'number', description: 'Duration in minutes', group: 'schedule' },
      timezone: { type: 'string', group: 'schedule' },
      location: { type: 'string' },
      meetingLink: { type: 'string' },
      interviewers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show', 'rescheduled'],
        default: 'scheduled',
        group: 'status',
      },
      cancelledReason: { type: 'string' },
      cancelledAt: { type: 'string', format: 'date-time' },
      cancelledBy: { type: 'string' },
      startedAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      agenda: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            duration: { type: 'number' },
            interviewer: { type: 'string' },
          },
        },
      },
      questions: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            category: { type: 'string' },
            expectedAnswer: { type: 'string' },
            candidateAnswer: { type: 'string' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
          },
        },
      },
      feedback: {
        type: 'object',
        collapsible: true,
        properties: {
          overallRating: { type: 'number', minimum: 1, maximum: 5 },
          recommendation: {
            type: 'string',
            enum: ['strong-yes', 'yes', 'neutral', 'no', 'strong-no'],
          },
          technicalSkills: { type: 'number', minimum: 1, maximum: 5 },
          communication: { type: 'number', minimum: 1, maximum: 5 },
          cultureFit: { type: 'number', minimum: 1, maximum: 5 },
          problemSolving: { type: 'number', minimum: 1, maximum: 5 },
          strengths: { type: 'array', items: { type: 'string' } },
          areasOfConcern: { type: 'array', items: { type: 'string' } },
          notes: { type: 'string', 'x-control-variant': 'textarea' },
          submittedAt: { type: 'string', format: 'date-time' },
          submittedBy: { type: 'string' },
        },
      },
      reminderSent: { type: 'boolean', default: false },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['applicantId', 'jobPostingId', 'type', 'scheduledAt', 'interviewers'],
  } as const;
};

// ========== Offer ==========

export const OfferSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::off-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      applicantId: { type: 'string', group: 'applicant' },
      applicantName: { type: 'string', group: 'applicant' },
      jobPostingId: { type: 'string', group: 'job' },
      jobTitle: { type: 'string', group: 'job' },
      position: {
        type: 'object',
        collapsible: true,
        properties: {
          title: { type: 'string', group: 'position' },
          department: { type: 'string', group: 'position' },
          location: { type: 'string', group: 'position' },
          manager: { type: 'string' },
          employmentType: {
            type: 'string',
            enum: ['full-time', 'part-time', 'contract', 'temporary'],
          },
          startDate: { type: 'string', format: 'date' },
        },
      },
      compensation: {
        type: 'object',
        collapsible: true,
        properties: {
          baseSalary: { type: 'number', group: 'salary' },
          currency: { type: 'string', default: 'USD', group: 'salary' },
          payFrequency: {
            type: 'string',
            enum: ['weekly', 'bi-weekly', 'semi-monthly', 'monthly'],
            group: 'salary',
          },
          signingBonus: { type: 'number' },
          annualBonus: { type: 'number' },
          bonusTarget: { type: 'number', description: 'Target bonus as percentage' },
          equity: {
            type: 'object',
            properties: {
              shares: { type: 'number' },
              vestingSchedule: { type: 'string' },
              cliffMonths: { type: 'number' },
              vestingMonths: { type: 'number' },
            },
          },
          relocationBonus: { type: 'number' },
          otherCompensation: { type: 'string' },
        },
      },
      benefits: {
        type: 'object',
        collapsible: true,
        properties: {
          healthInsurance: { type: 'boolean', default: true },
          dentalInsurance: { type: 'boolean', default: true },
          visionInsurance: { type: 'boolean', default: true },
          retirement401k: { type: 'boolean', default: true },
          retirementMatch: { type: 'number' },
          ptoDetails: { type: 'string' },
          otherBenefits: { type: 'array', items: { type: 'string' } },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'pending-approval', 'approved', 'sent', 'accepted', 'declined', 'negotiating', 'expired', 'withdrawn'],
        default: 'draft',
        group: 'status',
      },
      approvals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            approverId: { type: 'string' },
            approverName: { type: 'string' },
            status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
            approvedAt: { type: 'string', format: 'date-time' },
            comments: { type: 'string' },
          },
        },
      },
      sentAt: { type: 'string', format: 'date-time' },
      sentBy: { type: 'string' },
      expiresAt: { type: 'string', format: 'date-time' },
      respondedAt: { type: 'string', format: 'date-time' },
      declineReason: { type: 'string' },
      negotiationHistory: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            date: { type: 'string', format: 'date-time' },
            type: { type: 'string', enum: ['counter-offer', 'revision', 'final'] },
            changes: { type: 'string' },
            requestedBy: { type: 'string' },
          },
        },
      },
      offerLetterUrl: { type: 'string' },
      signedOfferUrl: { type: 'string' },
      contingencies: {
        type: 'array',
        items: { type: 'string' },
      },
      backgroundCheckRequired: { type: 'boolean', default: true },
      backgroundCheckStatus: {
        type: 'string',
        enum: ['pending', 'in-progress', 'passed', 'failed'],
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['applicantId', 'jobPostingId', 'position', 'compensation'],
  } as const;
};

// Type exports
const jp = JobPostingSchema();
export type JobPostingModel = FromSchema<typeof jp>;

const ap = ApplicantSchema();
export type ApplicantModel = FromSchema<typeof ap>;

const int = InterviewSchema();
export type InterviewModel = FromSchema<typeof int>;

const off = OfferSchema();
export type OfferModel = FromSchema<typeof off>;

// Register collections
registerCollection('Job Posting', DataType.bm_job_posting, JobPostingSchema());
registerCollection('Applicant', DataType.bm_applicant, ApplicantSchema());
registerCollection('Interview', DataType.bm_interview, InterviewSchema());
registerCollection('Offer', DataType.bm_offer, OfferSchema());
