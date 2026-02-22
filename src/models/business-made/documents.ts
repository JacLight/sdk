import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// ========== Employee Document ==========

export const EmployeeDocumentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::edoc-', 'random-string::6', 'uppercase'],
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
      category: {
        type: 'string',
        enum: [
          'personal',
          'identification',
          'employment',
          'contract',
          'performance',
          'disciplinary',
          'training',
          'benefits',
          'payroll',
          'tax',
          'immigration',
          'medical',
          'certification',
          'background-check',
          'other',
        ],
        group: 'type',
      },
      documentType: {
        type: 'string',
        enum: [
          'offer-letter',
          'employment-contract',
          'nda',
          'non-compete',
          'handbook-acknowledgement',
          'i9',
          'w4',
          'direct-deposit',
          'emergency-contact',
          'id-copy',
          'passport',
          'visa',
          'work-permit',
          'drivers-license',
          'social-security',
          'degree',
          'certificate',
          'license',
          'resume',
          'reference-letter',
          'performance-review',
          'warning-letter',
          'termination-letter',
          'resignation-letter',
          'exit-interview',
          'severance-agreement',
          'other',
        ],
        group: 'type',
      },
      file: {
        type: 'object',
        properties: {
          fileId: { type: 'string' },
          fileName: { type: 'string' },
          fileType: { type: 'string' },
          fileSize: { type: 'number' },
          url: { type: 'string' },
        },
      },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      status: {
        type: 'string',
        enum: ['draft', 'pending-signature', 'signed', 'active', 'expired', 'archived', 'rejected'],
        default: 'active',
        group: 'status',
      },
      issueDate: { type: 'string', format: 'date' },
      effectiveDate: { type: 'string', format: 'date' },
      expirationDate: { type: 'string', format: 'date' },
      isExpirable: { type: 'boolean', default: false },
      reminderDaysBefore: { type: 'number' },
      signature: {
        type: 'object',
        collapsible: true,
        properties: {
          required: { type: 'boolean', default: false },
          employeeSigned: { type: 'boolean' },
          employeeSignedAt: { type: 'string', format: 'date-time' },
          employeeSignatureId: { type: 'string' },
          witnessSigned: { type: 'boolean' },
          witnessName: { type: 'string' },
          witnessSignedAt: { type: 'string', format: 'date-time' },
          witnessSignatureId: { type: 'string' },
          managerSigned: { type: 'boolean' },
          managerName: { type: 'string' },
          managerSignedAt: { type: 'string', format: 'date-time' },
          managerSignatureId: { type: 'string' },
        },
      },
      verification: {
        type: 'object',
        properties: {
          verified: { type: 'boolean', default: false },
          verifiedBy: { type: 'string' },
          verifiedAt: { type: 'string', format: 'date-time' },
          verificationMethod: { type: 'string' },
          notes: { type: 'string' },
        },
      },
      confidentiality: {
        type: 'string',
        enum: ['public', 'internal', 'confidential', 'highly-confidential'],
        default: 'confidential',
      },
      accessControl: {
        type: 'object',
        properties: {
          visibleToEmployee: { type: 'boolean', default: true },
          visibleToManager: { type: 'boolean', default: true },
          restrictedToRoles: { type: 'array', items: { type: 'string' } },
        },
      },
      uploadedBy: { type: 'string' },
      uploadedAt: { type: 'string', format: 'date-time' },
      lastModifiedBy: { type: 'string' },
      lastModifiedAt: { type: 'string', format: 'date-time' },
      version: { type: 'number', default: 1 },
      previousVersionId: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['title', 'employeeId', 'category', 'documentType'],
  } as const;
};

// ========== Policy ==========

export const PolicySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::pol-', 'random-string::6', 'uppercase'],
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
        maxLength: 200,
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      category: {
        type: 'string',
        enum: [
          'hr',
          'it',
          'security',
          'compliance',
          'safety',
          'finance',
          'legal',
          'operations',
          'code-of-conduct',
          'benefits',
          'travel',
          'expense',
          'other',
        ],
        group: 'type',
      },
      type: {
        type: 'string',
        enum: ['policy', 'procedure', 'guideline', 'handbook', 'code'],
        group: 'type',
      },
      content: {
        type: 'string',
        'x-control-variant': 'richtext',
      },
      document: {
        type: 'object',
        properties: {
          fileId: { type: 'string' },
          fileName: { type: 'string' },
          url: { type: 'string' },
        },
      },
      sections: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            order: { type: 'number' },
          },
        },
      },
      applicableTo: {
        type: 'object',
        collapsible: true,
        properties: {
          allEmployees: { type: 'boolean', default: true },
          departments: { type: 'array', items: { type: 'string' } },
          locations: { type: 'array', items: { type: 'string' } },
          employmentTypes: { type: 'array', items: { type: 'string' } },
          jobLevels: { type: 'array', items: { type: 'string' } },
          roles: { type: 'array', items: { type: 'string' } },
        },
      },
      compliance: {
        type: 'object',
        collapsible: true,
        properties: {
          isRegulatory: { type: 'boolean', default: false },
          regulatoryBody: { type: 'string' },
          regulationReference: { type: 'string' },
          auditRequired: { type: 'boolean', default: false },
          auditFrequency: { type: 'string' },
          lastAuditDate: { type: 'string', format: 'date' },
          nextAuditDate: { type: 'string', format: 'date' },
        },
      },
      acknowledgement: {
        type: 'object',
        properties: {
          required: { type: 'boolean', default: true },
          frequency: { type: 'string', enum: ['once', 'annually', 'on-change', 'quarterly'] },
          deadlineDays: { type: 'number', description: 'Days from effective date to acknowledge' },
          reminderDays: { type: 'array', items: { type: 'number' } },
        },
      },
      status: {
        type: 'string',
        enum: ['draft', 'in-review', 'approved', 'published', 'archived', 'superseded'],
        default: 'draft',
        group: 'status',
      },
      effectiveDate: { type: 'string', format: 'date' },
      expirationDate: { type: 'string', format: 'date' },
      reviewDate: { type: 'string', format: 'date' },
      reviewFrequencyMonths: { type: 'number' },
      version: { type: 'number', default: 1 },
      previousVersionId: { type: 'string' },
      changeLog: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            version: { type: 'number' },
            date: { type: 'string', format: 'date' },
            changes: { type: 'string' },
            changedBy: { type: 'string' },
          },
        },
      },
      owner: {
        type: 'object',
        properties: {
          departmentId: { type: 'string' },
          departmentName: { type: 'string' },
          ownerId: { type: 'string' },
          ownerName: { type: 'string' },
        },
      },
      approvals: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            approverId: { type: 'string' },
            approverName: { type: 'string' },
            approverTitle: { type: 'string' },
            approvedAt: { type: 'string', format: 'date-time' },
            comments: { type: 'string' },
          },
        },
      },
      relatedPolicies: { type: 'array', items: { type: 'string' } },
      tags: { type: 'array', items: { type: 'string' } },
    },
    required: ['code', 'title', 'category', 'type'],
  } as const;
};

// ========== Policy Acknowledgement ==========

export const PolicyAcknowledgementSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::pack-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      employeeId: { type: 'string', group: 'employee' },
      employeeName: { type: 'string', group: 'employee' },
      employeeDepartment: { type: 'string', group: 'employee' },
      policyId: { type: 'string', group: 'policy' },
      policyCode: { type: 'string', group: 'policy' },
      policyTitle: { type: 'string', group: 'policy' },
      policyVersion: { type: 'number' },
      status: {
        type: 'string',
        enum: ['pending', 'acknowledged', 'declined', 'expired', 'waived'],
        default: 'pending',
        group: 'status',
      },
      assignedAt: { type: 'string', format: 'date-time' },
      dueDate: { type: 'string', format: 'date' },
      acknowledgedAt: { type: 'string', format: 'date-time' },
      acknowledgementMethod: {
        type: 'string',
        enum: ['electronic', 'physical', 'verbal', 'waived'],
      },
      signature: {
        type: 'object',
        properties: {
          signatureId: { type: 'string' },
          signedAt: { type: 'string', format: 'date-time' },
          ipAddress: { type: 'string' },
          userAgent: { type: 'string' },
        },
      },
      statement: { type: 'string', description: 'Acknowledgement statement presented' },
      employeeComments: { type: 'string' },
      quiz: {
        type: 'object',
        collapsible: true,
        properties: {
          required: { type: 'boolean' },
          passed: { type: 'boolean' },
          score: { type: 'number' },
          passingScore: { type: 'number' },
          attempts: { type: 'number' },
          completedAt: { type: 'string', format: 'date-time' },
        },
      },
      declinedReason: { type: 'string' },
      declinedAt: { type: 'string', format: 'date-time' },
      waivedBy: { type: 'string' },
      waivedAt: { type: 'string', format: 'date-time' },
      waiverReason: { type: 'string' },
      reminders: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            sentAt: { type: 'string', format: 'date-time' },
            method: { type: 'string', enum: ['email', 'notification', 'manager'] },
            reminderNumber: { type: 'number' },
          },
        },
      },
      escalated: { type: 'boolean', default: false },
      escalatedTo: { type: 'string' },
      escalatedAt: { type: 'string', format: 'date-time' },
      expiresAt: { type: 'string', format: 'date-time' },
      renewalRequired: { type: 'boolean', default: false },
      previousAcknowledgementId: { type: 'string' },
      notes: { type: 'string', 'x-control-variant': 'textarea' },
    },
    required: ['employeeId', 'policyId'],
  } as const;
};

// Type exports
const edoc = EmployeeDocumentSchema();
export type EmployeeDocumentModel = FromSchema<typeof edoc>;

const policy = PolicySchema();
export type PolicyModel = FromSchema<typeof policy>;

const policyAck = PolicyAcknowledgementSchema();
export type PolicyAcknowledgementModel = FromSchema<typeof policyAck>;

// Register collections
registerCollection('Employee Document', DataType.bm_employee_document, EmployeeDocumentSchema());
registerCollection('Policy', DataType.bm_policy, PolicySchema());
registerCollection('Policy Acknowledgement', DataType.bm_policy_acknowledgement, PolicyAcknowledgementSchema());
