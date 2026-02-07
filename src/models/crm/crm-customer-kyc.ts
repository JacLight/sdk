import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CustomerKYCSchema = () => {
  return {
    type: 'object',
    properties: {
      // Link to customer
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'email',
          label: 'email',
        },
        group: 'customer',
      },
      status: {
        type: 'string',
        enum: ['pending', 'in_review', 'additional_info_required', 'verified', 'rejected', 'expired', 'suspended'],
        default: 'pending',
        group: 'customer',
      },
      tier: {
        type: 'string',
        enum: ['basic', 'standard', 'enhanced', 'full'],
        default: 'basic',
        description: 'Verification level',
        group: 'customer',
      },
      riskLevel: {
        type: 'string',
        enum: ['low', 'medium', 'high', 'prohibited'],
        group: 'risk',
      },
      riskScore: {
        type: 'number',
        group: 'risk',
      },

      // Personal Information
      personalInfo: {
        type: 'object',
        title: 'Personal Information',
        collapsible: true,
        properties: {
          firstName: {
            type: 'string',
            group: 'name',
          },
          middleName: {
            type: 'string',
            group: 'name',
          },
          lastName: {
            type: 'string',
            group: 'name',
          },
          dateOfBirth: {
            type: 'string',
            format: 'date',
            'x-control': ControlType.date,
            group: 'dob',
          },
          placeOfBirth: {
            type: 'string',
            group: 'dob',
          },
          nationality: {
            type: 'string',
            group: 'nationality',
          },
          secondNationality: {
            type: 'string',
            group: 'nationality',
          },
          gender: {
            type: 'string',
            enum: ['male', 'female', 'other'],
            group: 'gender',
          },
          taxId: {
            type: 'string',
            description: 'Tax ID / SSN / TIN',
            group: 'tax',
          },
          taxCountry: {
            type: 'string',
            group: 'tax',
          },
        },
      },

      // Identity Documents
      identityDocuments: {
        type: 'array',
        title: 'Identity Documents',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            documentType: {
              type: 'string',
              enum: [
                'passport',
                'national_id',
                'drivers_license',
                'residence_permit',
                'visa',
                'voter_id',
                'military_id',
                'other',
              ],
              group: 'doc-type',
            },
            documentNumber: {
              type: 'string',
              group: 'doc-type',
            },
            issuingCountry: {
              type: 'string',
              group: 'doc-issue',
            },
            issuingAuthority: {
              type: 'string',
              group: 'doc-issue',
            },
            issueDate: {
              type: 'string',
              format: 'date',
              'x-control': ControlType.date,
              group: 'doc-dates',
            },
            expiryDate: {
              type: 'string',
              format: 'date',
              'x-control': ControlType.date,
              group: 'doc-dates',
            },
            frontImage: FileInfoSchema(),
            backImage: FileInfoSchema(),
            verified: {
              type: 'boolean',
              default: false,
              group: 'doc-verified',
            },
            verificationMethod: {
              type: 'string',
              enum: ['manual', 'automated', 'third_party'],
              group: 'doc-verified',
            },
            verificationDate: {
              type: 'string',
              format: 'date-time',
            },
            verificationNotes: {
              type: 'string',
            },
          },
        },
      },

      // Biometric Verification
      biometrics: {
        type: 'object',
        title: 'Biometric Verification',
        collapsible: true,
        properties: {
          selfieImage: FileInfoSchema(),
          selfieVerified: {
            type: 'boolean',
            default: false,
            group: 'selfie',
          },
          selfieMatchScore: {
            type: 'number',
            description: 'Face match confidence score (0-100)',
            group: 'selfie',
          },
          livenessCheck: {
            type: 'boolean',
            default: false,
            group: 'liveness',
          },
          livenessScore: {
            type: 'number',
            group: 'liveness',
          },
          livenessMethod: {
            type: 'string',
            enum: ['video', 'challenge_response', 'passive'],
          },
          verificationDate: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // Address
      address: {
        type: 'object',
        title: 'Residential Address',
        collapsible: true,
        properties: {
          addressLine1: {
            type: 'string',
            group: 'address',
          },
          addressLine2: {
            type: 'string',
            group: 'address',
          },
          city: {
            type: 'string',
            group: 'city',
          },
          state: {
            type: 'string',
            group: 'city',
          },
          postalCode: {
            type: 'string',
            group: 'country',
          },
          country: {
            type: 'string',
            group: 'country',
          },
          residencySince: {
            type: 'string',
            format: 'date',
            'x-control': ControlType.date,
          },
          proofOfAddress: FileInfoSchema(),
          proofType: {
            type: 'string',
            enum: ['utility_bill', 'bank_statement', 'tax_document', 'government_letter', 'lease_agreement', 'other'],
            group: 'proof',
          },
          proofDate: {
            type: 'string',
            format: 'date',
            'x-control': ControlType.date,
            description: 'Date on proof document',
            group: 'proof',
          },
          addressVerified: {
            type: 'boolean',
            default: false,
          },
        },
      },

      // Employment / Source of Funds
      employment: {
        type: 'object',
        title: 'Employment & Source of Funds',
        collapsible: true,
        properties: {
          employmentStatus: {
            type: 'string',
            enum: ['employed', 'self_employed', 'unemployed', 'retired', 'student', 'other'],
            group: 'employment',
          },
          occupation: {
            type: 'string',
            group: 'employment',
          },
          employer: {
            type: 'string',
            group: 'employer',
          },
          employerAddress: {
            type: 'string',
            group: 'employer',
          },
          industry: {
            type: 'string',
            group: 'industry',
          },
          annualIncome: {
            type: 'number',
            group: 'industry',
          },
          sourceOfFunds: {
            type: 'string',
            enum: ['salary', 'business', 'investments', 'inheritance', 'savings', 'pension', 'other'],
            group: 'source',
          },
          sourceOfFundsDetails: {
            type: 'string',
            'x-control-variant': 'textarea',
          },
          sourceOfWealth: {
            type: 'string',
            'x-control-variant': 'textarea',
            description: 'For enhanced due diligence',
          },
        },
      },

      // PEP & Sanctions Screening
      screening: {
        type: 'object',
        title: 'PEP & Sanctions Screening',
        collapsible: true,
        properties: {
          isPEP: {
            type: 'boolean',
            default: false,
            description: 'Politically Exposed Person',
            group: 'pep',
          },
          pepType: {
            type: 'string',
            enum: ['domestic', 'foreign', 'international_org', 'family_member', 'close_associate'],
            group: 'pep',
          },
          pepPosition: {
            type: 'string',
          },
          pepCountry: {
            type: 'string',
          },
          sanctionsHit: {
            type: 'boolean',
            default: false,
            group: 'sanctions',
          },
          sanctionsList: {
            type: 'string',
            description: 'Which sanctions list',
            group: 'sanctions',
          },
          adverseMedia: {
            type: 'boolean',
            default: false,
            group: 'adverse',
          },
          adverseMediaDetails: {
            type: 'string',
            'x-control-variant': 'textarea',
            group: 'adverse',
          },
          lastScreeningDate: {
            type: 'string',
            format: 'date-time',
            group: 'screening-date',
          },
          screeningProvider: {
            type: 'string',
            group: 'screening-date',
          },
          screeningReference: {
            type: 'string',
          },
        },
      },

      // Third Party Verification
      thirdPartyVerification: {
        type: 'object',
        title: 'Third Party Verification',
        collapsible: true,
        properties: {
          provider: {
            type: 'string',
            enum: ['onfido', 'jumio', 'trulioo', 'veriff', 'sumsub', 'other'],
            group: 'provider',
          },
          referenceId: {
            type: 'string',
            group: 'provider',
          },
          checkId: {
            type: 'string',
          },
          status: {
            type: 'string',
            enum: ['pending', 'complete', 'failed'],
            group: 'status',
          },
          result: {
            type: 'string',
            enum: ['clear', 'consider', 'rejected'],
            group: 'status',
          },
          reportUrl: {
            type: 'string',
          },
          rawResponse: {
            type: 'object',
            description: 'Full API response',
            hidden: true,
          },
          completedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // Verification Status
      verification: {
        type: 'object',
        title: 'Verification Status',
        collapsible: true,
        properties: {
          identityVerified: {
            type: 'boolean',
            default: false,
            group: 'verified',
          },
          addressVerified: {
            type: 'boolean',
            default: false,
            group: 'verified',
          },
          documentsVerified: {
            type: 'boolean',
            default: false,
            group: 'verified',
          },
          biometricsVerified: {
            type: 'boolean',
            default: false,
            group: 'verified',
          },
          screeningPassed: {
            type: 'boolean',
            default: false,
            group: 'verified',
          },
          verifiedDate: {
            type: 'string',
            format: 'date-time',
            group: 'verify-date',
          },
          verifiedBy: {
            type: 'string',
            group: 'verify-date',
          },
          expiresAt: {
            type: 'string',
            format: 'date-time',
            description: 'KYC expiry date',
          },
          nextReviewDate: {
            type: 'string',
            format: 'date-time',
            description: 'Periodic review date',
          },
        },
      },

      // Rejection / Issues
      issues: {
        type: 'array',
        title: 'Issues & Rejections',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              format: 'date-time',
              group: 'issue',
            },
            type: {
              type: 'string',
              enum: ['document_rejected', 'info_mismatch', 'fraud_suspected', 'sanctions_hit', 'pep_match', 'expired', 'other'],
              group: 'issue',
            },
            field: {
              type: 'string',
              description: 'Which field/document has the issue',
            },
            reason: {
              type: 'string',
              'x-control-variant': 'textarea',
            },
            resolved: {
              type: 'boolean',
              default: false,
              group: 'resolved',
            },
            resolvedDate: {
              type: 'string',
              format: 'date-time',
              group: 'resolved',
            },
            resolvedBy: {
              type: 'string',
            },
          },
        },
      },

      // Audit Trail
      auditLog: {
        type: 'array',
        title: 'Audit Log',
        collapsible: true,
        readOnly: true,
        items: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time',
              group: 'audit',
            },
            action: {
              type: 'string',
              group: 'audit',
            },
            performedBy: {
              type: 'string',
              group: 'audit-by',
            },
            ipAddress: {
              type: 'string',
              group: 'audit-by',
            },
            details: {
              type: 'string',
            },
            previousValue: {
              type: 'string',
            },
            newValue: {
              type: 'string',
            },
          },
        },
      },

      // Consent
      consent: {
        type: 'object',
        title: 'Consent & Declarations',
        collapsible: true,
        properties: {
          dataProcessingConsent: {
            type: 'boolean',
            default: false,
            group: 'consent',
          },
          termsAccepted: {
            type: 'boolean',
            default: false,
            group: 'consent',
          },
          consentDate: {
            type: 'string',
            format: 'date-time',
            group: 'consent-date',
          },
          consentIp: {
            type: 'string',
            group: 'consent-date',
          },
          declaration: {
            type: 'boolean',
            default: false,
            description: 'Customer declares information is accurate',
          },
        },
      },

      // Notes
      internalNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: ['customer'],
  } as const;
};

const sc = CustomerKYCSchema();
export type CustomerKYCModel = FromSchema<typeof sc>;

registerCollection('Customer KYC', DataType.customer_kyc, CustomerKYCSchema());
