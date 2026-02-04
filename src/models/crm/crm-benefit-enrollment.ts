import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const BenefitEnrollmentSchema = () => {
  return {
    type: 'object',
    properties: {
      number: {
        type: 'string',
        unique: true,
        readOnly: true,
        transform: ['random-string::10', 'uri'],
        description: 'Enrollment ID',
        group: 'general',
      },
      status: {
        type: 'string',
        enum: ['pending', 'under_review', 'approved', 'rejected', 'active', 'expired', 'cancelled'],
        default: 'pending',
        'x-control': ControlType.label,
        group: 'general',
      },
      benefit: {
        type: 'string',
        description: 'Benefit being applied for',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.benefit,
          value: 'name',
          label: 'name',
        },
        group: 'general',
      },
      customer: {
        type: 'object',
        description: 'Customer information',
        properties: {
          id: {
            type: 'string',
            description: 'Customer ID',
          },
          name: {
            type: 'string',
          },
          email: {
            type: 'string',
            format: 'email',
          },
          phone: {
            type: 'string',
          },
        },
        group: 'customer',
      },
      applicationForm: {
        type: 'string',
        description: 'Application form collection name',
        group: 'application',
      },
      formSubmissionId: {
        type: 'string',
        description: 'ID of submitted form record',
        group: 'application',
      },
      formData: {
        type: 'object',
        description: 'Submitted application form data',
        hideIn: ['table'],
        group: 'application',
      },
      documents: {
        type: 'array',
        description: 'Supporting documents',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            url: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
          },
        },
        group: 'application',
      },
      submittedAt: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        group: 'timeline',
      },
      submittedBy: {
        type: 'string',
        description: 'Who submitted the application',
        group: 'timeline',
      },
      reviewedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      reviewedBy: {
        type: 'string',
        description: 'Admin who reviewed',
        group: 'timeline',
      },
      approvedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      rejectedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timeline',
      },
      activatedAt: {
        type: 'string',
        format: 'date-time',
        description: 'When benefit became active',
        group: 'timeline',
      },
      expiresAt: {
        type: 'string',
        format: 'date-time',
        description: 'When benefit expires',
        group: 'timeline',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        description: 'Applicant notes',
        group: 'notes',
      },
      reviewNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        description: 'Admin review notes',
        group: 'notes',
      },
      rejectionReason: {
        type: 'string',
        'x-control-variant': 'textarea',
        description: 'Reason for rejection',
        group: 'notes',
      },
      history: {
        type: 'array',
        hideIn: ['form', 'table'],
        description: 'Status change history',
        items: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            changedAt: { type: 'string', format: 'date-time' },
            changedBy: { type: 'string' },
            note: { type: 'string' },
          },
        },
      },
    },
    required: ['benefit'],
  } as const;
};

const schema = BenefitEnrollmentSchema();
export type BenefitEnrollmentModel = FromSchema<typeof schema>;

registerCollection('Benefit Enrollment', DataType.benefit_enrollment, BenefitEnrollmentSchema());
