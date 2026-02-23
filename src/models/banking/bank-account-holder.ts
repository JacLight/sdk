import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const BankAccountHolderSchema = () => {
  return {
    type: 'object',
    properties: {
      // Identification
      holderType: {
        type: 'string',
        enum: ['individual', 'business'],
        default: 'individual',
        group: 'type',
      },

      // Individual Information
      firstName: {
        type: 'string',
        group: 'individual',
      },
      lastName: {
        type: 'string',
        group: 'individual',
      },
      dateOfBirth: {
        type: 'string',
        format: 'date',
        group: 'individual',
      },
      ssn: {
        type: 'string',
        description: 'Social Security Number (encrypted)',
        group: 'individual',
      },
      ssnLast4: {
        type: 'string',
        maxLength: 4,
        description: 'Last 4 of SSN for display',
        group: 'individual',
      },

      // Business Information
      businessName: {
        type: 'string',
        group: 'business',
      },
      businessType: {
        type: 'string',
        enum: ['sole_proprietorship', 'llc', 'corporation', 's_corp', 'partnership', 'nonprofit'],
        group: 'business',
      },
      ein: {
        type: 'string',
        description: 'Employer Identification Number',
        group: 'business',
      },
      einLast4: {
        type: 'string',
        maxLength: 4,
        description: 'Last 4 of EIN for display',
        group: 'business',
      },
      incorporationDate: {
        type: 'string',
        format: 'date',
        group: 'business',
      },
      incorporationState: {
        type: 'string',
        group: 'business',
      },
      website: {
        type: 'string',
        format: 'uri',
        group: 'business',
      },

      // Contact Information
      email: {
        type: 'string',
        format: 'email',
        group: 'contact',
      },
      phone: {
        type: 'string',
        group: 'contact',
      },

      // Address
      address: {
        type: 'object',
        title: 'Address',
        properties: {
          line1: { type: 'string', group: 'address' },
          line2: { type: 'string', group: 'address' },
          city: { type: 'string', group: 'location' },
          state: { type: 'string', group: 'location' },
          postalCode: { type: 'string', group: 'location' },
          country: { type: 'string', default: 'US', group: 'location' },
        },
      },

      // Linked Customer (from CRM)
      linkedCustomerId: {
        type: 'string',
        description: 'Links to customer or merchant_customer',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['name', 'email'],
        },
        group: 'link',
      },
      linkedCustomerType: {
        type: 'string',
        enum: ['customer', 'merchant_customer'],
        group: 'link',
      },

      // KYC Status
      kycStatus: {
        type: 'string',
        enum: ['pending', 'in_progress', 'approved', 'rejected', 'review_required'],
        default: 'pending',
        group: 'kyc',
      },
      kycProvider: {
        type: 'string',
        enum: ['persona', 'plaid', 'alloy', 'internal'],
        group: 'kyc',
      },
      kycVerificationId: {
        type: 'string',
        description: 'External KYC verification ID',
        group: 'kyc',
      },
      kycVerifiedAt: {
        type: 'string',
        format: 'date-time',
        group: 'kyc',
      },
      kycDocuments: {
        type: 'array',
        title: 'KYC Documents',
        collapsible: true,
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string',
              enum: ['drivers_license', 'passport', 'state_id', 'utility_bill', 'bank_statement', 'articles_of_incorporation', 'ein_letter'],
              group: 'doc',
            },
            status: {
              type: 'string',
              enum: ['pending', 'verified', 'rejected'],
              group: 'doc',
            },
            fileId: { type: 'string' },
            uploadedAt: { type: 'string', format: 'date-time' },
            verifiedAt: { type: 'string', format: 'date-time' },
            expiresAt: { type: 'string', format: 'date-time' },
            rejectionReason: { type: 'string' },
          },
        },
      },

      // KYB (Business verification)
      kybStatus: {
        type: 'string',
        enum: ['pending', 'in_progress', 'approved', 'rejected', 'review_required'],
        default: 'pending',
        group: 'kyb',
      },
      kybVerifiedAt: {
        type: 'string',
        format: 'date-time',
        group: 'kyb',
      },

      // Beneficial Owners (for business accounts)
      beneficialOwners: {
        type: 'array',
        title: 'Beneficial Owners',
        collapsible: true,
        description: 'Individuals with 25%+ ownership',
        items: {
          type: 'object',
          properties: {
            firstName: { type: 'string', group: 'owner' },
            lastName: { type: 'string', group: 'owner' },
            ownershipPercentage: { type: 'number', minimum: 0, maximum: 100, group: 'owner' },
            dateOfBirth: { type: 'string', format: 'date' },
            ssn: { type: 'string' },
            ssnLast4: { type: 'string', maxLength: 4 },
            address: {
              type: 'object',
              properties: {
                line1: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                postalCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            kycStatus: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
            },
          },
        },
      },

      // AML/Sanctions
      amlStatus: {
        type: 'string',
        enum: ['clear', 'flagged', 'blocked'],
        default: 'clear',
        group: 'aml',
      },
      amlLastScreenedAt: {
        type: 'string',
        format: 'date-time',
        group: 'aml',
      },
      sanctionsStatus: {
        type: 'string',
        enum: ['clear', 'match', 'potential_match'],
        default: 'clear',
        group: 'aml',
      },

      // Risk Assessment
      riskLevel: {
        type: 'string',
        enum: ['low', 'medium', 'high'],
        default: 'low',
        group: 'risk',
      },
      riskFactors: {
        type: 'array',
        items: { type: 'string' },
        group: 'risk',
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'active', 'suspended', 'closed'],
        default: 'pending',
        group: 'status',
      },

      // Metadata
      createdAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },
      updatedAt: {
        type: 'string',
        format: 'date-time',
        group: 'dates',
      },

      // Internal Notes
      internalNotes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Internal Notes',
      },
    },
    required: ['holderType', 'email'],
  } as const;
};

const sc = BankAccountHolderSchema();
export type BankAccountHolderModel = FromSchema<typeof sc>;

registerCollection('Bank Account Holder', DataType.bank_account_holder, BankAccountHolderSchema());
