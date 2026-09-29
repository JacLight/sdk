import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// ========== Course ==========

export const CourseSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::crs-', 'random-string::6', 'uppercase'],
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
      category: {
        type: 'string',
        enum: ['compliance', 'technical', 'soft-skills', 'leadership', 'safety', 'product', 'onboarding', 'professional-development', 'other'],
        group: 'type',
      },
      type: {
        type: 'string',
        enum: ['online', 'instructor-led', 'blended', 'self-paced', 'webinar', 'workshop', 'conference'],
        group: 'type',
      },
      format: {
        type: 'string',
        enum: ['video', 'interactive', 'document', 'live', 'simulation', 'mixed'],
      },
      source: {
        type: 'string',
        enum: ['own', 'link', 'marketplace'],
        default: 'own',
        description: "own = the business's content; link = taken elsewhere at launchUrl; marketplace = a course from the platform course app",
        group: 'type',
      },
      launchUrl: {
        type: 'string',
        format: 'uri',
        description: 'Where the course is taken. When the course app is connected it supplies a per-learner start/resume link instead.',
        group: 'type',
      },
      renewalMonths: {
        type: 'number',
        minimum: 0,
        description: 'A completion stops counting this many months later. A requirement rule’s renewal wins over this. Empty = never expires.',
        group: 'type',
      },
      postId: {
        type: 'string',
        title: 'Content Studio course',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.post, value: 'sk', label: 'title' },
        description: 'A Content Studio course (post sk). When set, the course is taken there: completion and score come only from the person’s post_progress, marked by the server.',
        group: 'type',
      },
      marketplace: {
        type: 'object',
        collapsible: true,
        description: 'source = marketplace. Completion flows back from the course app as evidence on the enrollment.',
        properties: {
          marketplaceCourseId: { type: 'string' },
          provider: { type: 'string' },
          url: { type: 'string' },
          courseVersion: { type: 'string' },
        },
      },
      version: { type: 'number', default: 1, description: 'Content version — recorded with each completion' },
      provider: {
        type: 'object',
        collapsible: true,
        properties: {
          type: { type: 'string', enum: ['internal', 'external', 'vendor'] },
          name: { type: 'string' },
          instructorId: { type: 'string' },
          instructorName: { type: 'string' },
          contactEmail: { type: 'string' },
          website: { type: 'string' },
        },
      },
      duration: {
        type: 'object',
        properties: {
          hours: { type: 'number' },
          days: { type: 'number' },
          selfPacedDeadlineDays: { type: 'number' },
        },
      },
      content: {
        type: 'object',
        collapsible: true,
        properties: {
          objectives: { type: 'array', items: { type: 'string' } },
          outline: { type: 'string', 'x-control-variant': 'textarea' },
          prerequisites: { type: 'array', items: { type: 'string' } },
          materials: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                type: { type: 'string' },
                fileId: { type: 'string' },
                url: { type: 'string' },
              },
            },
          },
          modules: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                title: { type: 'string' },
                description: { type: 'string' },
                duration: { type: 'number' },
                order: { type: 'number' },
                contentType: { type: 'string' },
                contentUrl: { type: 'string' },
                body: { type: 'string', 'x-control-variant': 'textarea', description: 'Module text' },
                sections: {
                  type: 'array',
                  items: { type: 'object', properties: { title: { type: 'string' }, body: { type: 'string', 'x-control-variant': 'textarea' } } },
                },
                translations: { type: 'object', hidden: true, description: 'Per language: { title, description, sections, body }' },
              },
            },
          },
        },
      },
      assessment: {
        type: 'object',
        collapsible: true,
        properties: {
          hasAssessment: { type: 'boolean', default: false },
          passingScore: { type: 'number' },
          maxAttempts: { type: 'number' },
          assessmentType: { type: 'string', enum: ['quiz', 'exam', 'practical', 'project', 'presentation'] },
          questions: { type: 'number' },
          timeLimit: { type: 'number', description: 'Minutes' },
          items: {
            type: 'array',
            description: 'Quiz questions',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                question: { type: 'string' },
                options: { type: 'array', items: { type: 'string' } },
                answerIndex: { type: 'number' },
                explanation: { type: 'string' },
                moduleId: { type: 'string' },
                translations: { type: 'object', hidden: true, description: 'Per language: { question, options, explanation }' },
              },
            },
          },
        },
      },
      generation: {
        type: 'object',
        readOnly: true,
        collapsible: true,
        description: 'Set when the course was generated from the business\'s own SOPs, policies or files',
        properties: {
          generator: { type: 'string' },
          lineageId: { type: 'string' },
          previousVersionId: { type: 'string' },
          supersededById: { type: 'string' },
          sources: {
            type: 'array',
            items: { type: 'object', properties: { datatype: { type: 'string' }, id: { type: 'string' }, version: { type: 'string' }, title: { type: 'string' }, path: { type: 'string' } } },
          },
          changedSources: { type: 'array', items: { type: 'object' } },
          reason: { type: 'string', enum: ['initial', 'source_changed', 'manual'] },
          audience: { type: 'object', properties: { roles: { type: 'array', items: { type: 'string' } }, locations: { type: 'array', items: { type: 'string' } } } },
          quiz: { type: 'boolean' },
          quizQuestions: { type: 'number' },
          languages: { type: 'array', items: { type: 'string' } },
          guidance: { type: 'string' },
          model: { type: 'string' },
          generatedAt: { type: 'string', format: 'date-time' },
          generatedBy: { type: 'string' },
          publishedAt: { type: 'string', format: 'date-time' },
          publishedBy: { type: 'string' },
          warnings: { type: 'array', items: { type: 'string' } },
        },
      },
      schedule: {
        type: 'object',
        collapsible: true,
        properties: {
          isRecurring: { type: 'boolean', default: false },
          frequency: { type: 'string', enum: ['weekly', 'monthly', 'quarterly', 'annually'] },
          sessions: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                startDate: { type: 'string', format: 'date-time' },
                endDate: { type: 'string', format: 'date-time' },
                location: { type: 'string' },
                virtualLink: { type: 'string' },
                capacity: { type: 'number' },
                enrolled: { type: 'number' },
                waitlist: { type: 'number' },
                status: { type: 'string', enum: ['scheduled', 'in-progress', 'completed', 'cancelled'] },
              },
            },
          },
        },
      },
      eligibility: {
        type: 'object',
        collapsible: true,
        properties: {
          departments: { type: 'array', items: { type: 'string' } },
          positions: { type: 'array', items: { type: 'string' } },
          jobLevels: { type: 'array', items: { type: 'string' } },
          requiredForRoles: { type: 'array', items: { type: 'string' } },
          openToAll: { type: 'boolean', default: true },
        },
      },
      compliance: {
        type: 'object',
        collapsible: true,
        properties: {
          isRequired: { type: 'boolean', default: false },
          renewalPeriodMonths: { type: 'number' },
          regulatoryBody: { type: 'string' },
          complianceCode: { type: 'string' },
        },
      },
      cost: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          currency: { type: 'string', default: 'USD' },
          costCenter: { type: 'string' },
          requiresApproval: { type: 'boolean', default: false },
        },
      },
      credits: {
        type: 'object',
        properties: {
          ceuCredits: { type: 'number' },
          pduCredits: { type: 'number' },
          cpeCredits: { type: 'number' },
          internalCredits: { type: 'number' },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive', 'archived'],
        default: 'draft',
        group: 'status',
      },
      rating: { type: 'number', minimum: 0, maximum: 5 },
      reviewCount: { type: 'number' },
      enrollmentCount: { type: 'number' },
      completionCount: { type: 'number' },
      tags: { type: 'array', items: { type: 'string' } },
      thumbnail: { type: 'string' },
    },
    required: ['title', 'category', 'type'],
  } as const;
};

// ========== Certification ==========

export const CertificationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::cert-', 'random-string::6', 'uppercase'],
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
      issuingOrganization: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          website: { type: 'string' },
          accreditationBody: { type: 'string' },
        },
      },
      type: {
        type: 'string',
        enum: ['professional', 'technical', 'compliance', 'industry', 'internal', 'vendor'],
        group: 'type',
      },
      level: {
        type: 'string',
        enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      },
      requirements: {
        type: 'object',
        collapsible: true,
        properties: {
          prerequisites: { type: 'array', items: { type: 'string' } },
          requiredCourses: { type: 'array', items: { type: 'string' } },
          experienceYears: { type: 'number' },
          educationLevel: { type: 'string' },
          examRequired: { type: 'boolean', default: true },
          practicalAssessment: { type: 'boolean', default: false },
        },
      },
      exam: {
        type: 'object',
        collapsible: true,
        properties: {
          format: { type: 'string', enum: ['online', 'in-person', 'proctored-online'] },
          duration: { type: 'number', description: 'Minutes' },
          passingScore: { type: 'number' },
          questionsCount: { type: 'number' },
          retakePolicy: { type: 'string' },
          retakeWaitDays: { type: 'number' },
          fee: { type: 'number' },
        },
      },
      validity: {
        type: 'object',
        properties: {
          validityPeriodMonths: { type: 'number' },
          requiresRenewal: { type: 'boolean', default: true },
          renewalRequirements: { type: 'string' },
          continuingEducationCredits: { type: 'number' },
        },
      },
      cost: {
        type: 'object',
        properties: {
          examFee: { type: 'number' },
          renewalFee: { type: 'number' },
          studyMaterialsCost: { type: 'number' },
          companyReimbursement: { type: 'boolean', default: false },
          reimbursementAmount: { type: 'number' },
        },
      },
      benefits: {
        type: 'object',
        properties: {
          salaryIncrease: { type: 'number' },
          promotionEligibility: { type: 'boolean' },
          requiredForRole: { type: 'array', items: { type: 'string' } },
        },
      },
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'retired'],
        default: 'active',
        group: 'status',
      },
      relatedCertifications: { type: 'array', items: { type: 'string' } },
      tags: { type: 'array', items: { type: 'string' } },
    },
    required: ['title', 'type'],
  } as const;
};

// ========== Learning Path ==========

export const LearningPathSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::lp-', 'random-string::6', 'uppercase'],
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
        enum: ['role-based', 'skill-based', 'career-development', 'onboarding', 'compliance', 'custom'],
        group: 'type',
      },
      targetAudience: {
        type: 'object',
        collapsible: true,
        properties: {
          roles: { type: 'array', items: { type: 'string' } },
          departments: { type: 'array', items: { type: 'string' } },
          levels: { type: 'array', items: { type: 'string' } },
          isOpenToAll: { type: 'boolean', default: false },
        },
      },
      objectives: { type: 'array', items: { type: 'string' } },
      skills: { type: 'array', items: { type: 'string' } },
      stages: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            order: { type: 'number' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['course', 'certification', 'assessment', 'project', 'mentoring'] },
                  itemId: { type: 'string' },
                  itemTitle: { type: 'string' },
                  isRequired: { type: 'boolean', default: true },
                  order: { type: 'number' },
                  estimatedHours: { type: 'number' },
                },
              },
            },
            completionCriteria: { type: 'string' },
          },
        },
      },
      estimatedDuration: {
        type: 'object',
        properties: {
          hours: { type: 'number' },
          weeks: { type: 'number' },
        },
      },
      completionCriteria: {
        type: 'object',
        properties: {
          requiredItemsPercentage: { type: 'number', default: 100 },
          minimumScore: { type: 'number' },
          certificationRequired: { type: 'boolean', default: false },
        },
      },
      rewards: {
        type: 'object',
        properties: {
          badge: { type: 'string' },
          certificate: { type: 'boolean', default: false },
          credits: { type: 'number' },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'active', 'inactive', 'archived'],
        default: 'draft',
        group: 'status',
      },
      version: { type: 'number', default: 1 },
      thumbnail: { type: 'string' },
      enrollmentCount: { type: 'number' },
      completionCount: { type: 'number' },
      averageCompletionDays: { type: 'number' },
      rating: { type: 'number', minimum: 0, maximum: 5 },
    },
    required: ['title', 'type'],
  } as const;
};

// ========== Course Enrollment ==========

export const CourseEnrollmentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::ce-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      courseId: { type: 'string', group: 'course' },
      courseName: { type: 'string', group: 'course' },
      courseType: { type: 'string', group: 'course' },
      sessionId: { type: 'string' },
      learningPathId: { type: 'string' },
      enrollmentType: {
        type: 'string',
        enum: ['self-enrolled', 'assigned', 'required', 'recommended'],
        group: 'type',
      },
      assignedBy: { type: 'string' },
      assignedAt: { type: 'string', format: 'date-time' },
      status: {
        type: 'string',
        enum: ['enrolled', 'in-progress', 'completed', 'failed', 'withdrawn', 'waitlisted', 'expired'],
        default: 'enrolled',
        group: 'status',
      },
      enrolledAt: { type: 'string', format: 'date-time' },
      startedAt: { type: 'string', format: 'date-time' },
      completedAt: { type: 'string', format: 'date-time' },
      dueDate: { type: 'string', format: 'date' },
      progress: {
        type: 'object',
        properties: {
          percentage: { type: 'number', minimum: 0, maximum: 100 },
          modulesCompleted: { type: 'number' },
          totalModules: { type: 'number' },
          lastAccessedAt: { type: 'string', format: 'date-time' },
          timeSpentMinutes: { type: 'number' },
        },
      },
      moduleProgress: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            moduleId: { type: 'string' },
            status: { type: 'string', enum: ['not-started', 'in-progress', 'completed'] },
            completedAt: { type: 'string', format: 'date-time' },
            timeSpentMinutes: { type: 'number' },
            score: { type: 'number' },
          },
        },
      },
      assessment: {
        type: 'object',
        collapsible: true,
        properties: {
          attempts: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                attemptNumber: { type: 'number' },
                date: { type: 'string', format: 'date-time' },
                score: { type: 'number' },
                passed: { type: 'boolean' },
                timeSpentMinutes: { type: 'number' },
              },
            },
          },
          bestScore: { type: 'number' },
          passed: { type: 'boolean' },
          certificateIssued: { type: 'boolean' },
          certificateId: { type: 'string' },
        },
      },
      feedback: {
        type: 'object',
        properties: {
          rating: { type: 'number', minimum: 1, maximum: 5 },
          review: { type: 'string' },
          submittedAt: { type: 'string', format: 'date-time' },
        },
      },
      cost: {
        type: 'object',
        properties: {
          amount: { type: 'number' },
          paidBy: { type: 'string', enum: ['company', 'employee', 'shared'] },
          approved: { type: 'boolean' },
          approvedBy: { type: 'string' },
          reimbursed: { type: 'boolean' },
        },
      },
      creditsEarned: {
        type: 'object',
        properties: {
          ceu: { type: 'number' },
          pdu: { type: 'number' },
          cpe: { type: 'number' },
          internal: { type: 'number' },
        },
      },
      requirementId: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_requirement_rule, value: 'sk', label: 'title' },
        description: 'The requirement this enrollment satisfies',
        group: 'requirement',
      },
      cycle: { type: 'number', default: 1, description: 'Renewal cycle, 1 = first', group: 'requirement' },
      expiresAt: { type: 'string', format: 'date-time', description: 'When this completion stops counting', group: 'requirement' },
      courseVersion: { type: 'number', description: 'bm_course.version completed' },
      externalCompletion: {
        type: 'object',
        collapsible: true,
        description: 'Completion reported by the course app (marketplace course)',
        properties: {
          provider: { type: 'string' },
          reference: { type: 'string', description: 'The course app’s completion / certificate id' },
          completedAt: { type: 'string', format: 'date-time' },
          score: { type: 'number' },
          certificateUrl: { type: 'string' },
        },
      },
      selfReport: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        description: 'The person said they finished (and the score they gave). Awaiting HR confirmation — never counts as a completion.',
        properties: {
          submittedAt: { type: 'string', format: 'date-time' },
          score: { type: 'number' },
          timeSpentMinutes: { type: 'number' },
        },
      },
      manualCompletion: {
        type: 'object',
        collapsible: true,
        readOnly: true,
        description: 'Completion marked by HR/admin (not self-reported, not from the course app)',
        properties: {
          markedBy: { type: 'string' },
          markedByName: { type: 'string' },
          markedAt: { type: 'string', format: 'date-time' },
          note: { type: 'string' },
          score: { type: 'number' },
          certificate: {
            type: 'object',
            properties: { fileId: { type: 'string' }, url: { type: 'string' }, path: { type: 'string' }, name: { type: 'string' } },
          },
        },
      },
      completionHistory: {
        type: 'array',
        readOnly: true,
        description: 'Append-only: every completion and every undo of one, never removed',
        items: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['completed', 'not_completed'] },
            source: { type: 'string', enum: ['manual', 'course_app', 'self'] },
            at: { type: 'string', format: 'date-time', description: 'When this entry was written' },
            by: { type: 'string' },
            byName: { type: 'string' },
            completedAt: { type: 'string', format: 'date-time' },
            expiresAt: { type: 'string', format: 'date-time' },
            score: { type: 'number' },
            note: { type: 'string' },
            reference: { type: 'string', description: 'Course-app completion id, kept so an undone completion is not re-applied by a webhook retry' },
            certificate: {
              type: 'object',
              properties: { fileId: { type: 'string' }, url: { type: 'string' }, path: { type: 'string' }, name: { type: 'string' } },
            },
          },
        },
      },
      reminders: {
        type: 'array',
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            sentAt: { type: 'string', format: 'date-time' },
            method: { type: 'string', enum: ['email', 'notification', 'manager'] },
            recipient: { type: 'string', enum: ['employee', 'manager', 'hr'] },
            reminderNumber: { type: 'number' },
            daysBefore: { type: 'number' },
          },
        },
      },
      withdrawalReason: { type: 'string' },
      managerApproval: {
        type: 'object',
        properties: {
          required: { type: 'boolean' },
          status: { type: 'string', enum: ['pending', 'approved', 'rejected'] },
          approvedBy: { type: 'string' },
          approvedAt: { type: 'string', format: 'date-time' },
          comments: { type: 'string' },
        },
      },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'courseId'],
  } as const;
};

// ========== Floor Sign-off ==========
// One observed sign-off of a person at a station, against the checklist defined on a
// bm_requirement_rule of kind=signoff. It is evidence (like an enrollment is for a course):
// a pass satisfies the rule, and the rule's renewal/expiry applies from observedAt.

export const SignoffSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::so-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_employee, value: 'employeeId', label: ['employeeId', 'name'] },
        group: 'employee',
      },
      employeeName: { type: 'string', group: 'employee' },
      requirementId: {
        type: 'string',
        'x-control': ControlType.selectSingle,
        dataSource: { source: 'collection', collection: DataType.bm_requirement_rule, value: 'sk', label: 'title' },
        description: 'The sign-off rule (holds the checklist and stations)',
        group: 'requirement',
      },
      station: { type: 'string', description: 'Station/area observed — matches bm_schedule.station', group: 'requirement' },
      businessLocation: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        maxItems: 1,
        dataSource: { source: 'collection', collection: DataType.location, value: 'name', label: 'name' },
        group: 'requirement',
      },
      observerId: { type: 'string', group: 'observer' },
      observerName: { type: 'string', group: 'observer' },
      observedAt: { type: 'string', format: 'date-time', group: 'observer' },
      result: {
        type: 'string',
        enum: ['pass', 'fail', 'needs_practice'],
        group: 'status',
      },
      checklist: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            key: { type: 'string' },
            label: { type: 'string' },
            passed: { type: 'boolean' },
            note: { type: 'string' },
            photoIds: { type: 'array', items: { type: 'string' } },
          },
        },
      },
      photos: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fileId: { type: 'string' },
            url: { type: 'string' },
          },
        },
      },
      observerSignatureId: { type: 'string' },
      cycle: { type: 'number', default: 1 },
      expiresAt: { type: 'string', format: 'date-time' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'requirementId', 'result'],
  } as const;
};

// Type exports
const course = CourseSchema();
export type CourseModel = FromSchema<typeof course>;

const cert = CertificationSchema();
export type CertificationModel = FromSchema<typeof cert>;

const lp = LearningPathSchema();
export type LearningPathModel = FromSchema<typeof lp>;

const ce = CourseEnrollmentSchema();
export type CourseEnrollmentModel = FromSchema<typeof ce>;

const signoff = SignoffSchema();
export type SignoffModel = FromSchema<typeof signoff>;

// Register collections
registerCollection('Course', DataType.bm_course, CourseSchema());
registerCollection('Certification', DataType.bm_certification, CertificationSchema());
registerCollection('Learning Path', DataType.bm_learning_path, LearningPathSchema());
registerCollection('Course Enrollment', DataType.bm_course_enrollment, CourseEnrollmentSchema());
registerCollection('Floor Sign-off', DataType.bm_signoff, SignoffSchema());
