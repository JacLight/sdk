import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ControlType, DataType } from '../types';
import { FileInfoSchema } from './file-info';
import { AddressSchema } from './crm/crm-address';
import { getCountryDropDownOptions } from '../data/countries/search';

/**
 * Canonical business identity used by Books, Payroll, CRM, etc. Lives on
 * `company.data.businessProfile`. Saved by the business-made setup wizard.
 */
export const BusinessProfileSchema = () => {
  return {
    type: 'object',
    properties: {
      businessName: { type: 'string', minLength: 1, maxLength: 200 },
      legalName: { type: 'string', maxLength: 200 },
      dba: { type: 'string', maxLength: 200 },
      entityType: {
        type: 'string',
        enum: ['llc', 'c-corp', 's-corp', 'sole-prop', 'partnership', 'nonprofit', 'other'],
      },
      taxId: { type: 'string', maxLength: 64 },
      industry: { type: 'string', maxLength: 100 },
      fiscalYearStart: { type: 'string', pattern: '^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$' },
      currency: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'json',
          value: getCountryDropDownOptions(),
        },
        default: 'USD',
      },
      timezone: { type: 'string', maxLength: 64 },
      logoUrl: { type: 'string' },
      address: AddressSchema(),
      contactEmail: { type: 'string', format: 'email' },
      contactPhone: { type: 'string' },
    },
    required: ['businessName'],
  } as const;
};

const _businessProfile = BusinessProfileSchema();
export type BusinessProfileModel = FromSchema<typeof _businessProfile>;

/**
 * Completion ledger written by the business-made setup engine. Lives on
 * `company.data.setupProgress`. Tracks whether the profile is saved, which
 * scenarios have been applied, and which modules have been configured.
 */
export const SetupProgressSchema = () => {
  return {
    type: 'object',
    properties: {
      profile: {
        type: 'object',
        properties: {
          completedAt: { type: 'string', format: 'date-time' },
          completedBy: { type: 'string' },
        },
      },
      scenarios: {
        type: 'object',
        description: 'Map keyed by scenario id (restaurant, retail, salon, etc.).',
        additionalProperties: {
          type: 'object',
          properties: {
            completedAt: { type: 'string', format: 'date-time' },
            completedBy: { type: 'string' },
            summary: {},
          },
        },
      },
      modules: {
        type: 'object',
        description: 'Map keyed by module id (books, hr, payroll, etc.). `byScenario` set when the module was applied via a scenario bundle.',
        additionalProperties: {
          type: 'object',
          properties: {
            completedAt: { type: 'string', format: 'date-time' },
            completedBy: { type: 'string' },
            byScenario: { type: 'string' },
          },
        },
      },
    },
  } as const;
};

const _businessSetup = SetupProgressSchema();
export type SetupProgressModel = FromSchema<typeof _businessSetup>;

export const CompanySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        unique: true,
        transform: 'uri',
      },
      database: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 20,
        unique: true,
      },
      logo: FileInfoSchema(),
      displayName: {
        type: 'string',
        minLength: 3,
        maxLength: 100,
      },
      maxUsers: {
        type: 'number',
      },
      balance: {
        type: 'number',
      },
      spendLimit: {
        type: 'number',
      },
      limits: {
        type: 'number',
      },
      active: {
        type: 'boolean',
      },
      spendRate: {
        type: 'number',
      },
      email: {
        type: 'string',
        format: 'email',
      },
      verifiedEmail: {
        type: 'string',
        hidden: true,
      },
      sites: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      plan: {
        type: 'string',
        dataSource: {
          source: 'json',
          json: [
            { value: 'free', label: 'Free' },
            { value: 'basic', label: 'Basic' },
            { value: 'pro', label: 'Pro' },
            { value: 'team', label: 'Team' },
            { value: 'enterprise', label: 'Enterprise' },
          ],
        },
      },
      nextRenewalDate: {
        type: 'string',
        format: 'date-time',
      },
      planHistory: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            plan: {
              type: 'string',
              group: 'plan',
            },
            startDate: {
              type: 'string',
              format: 'date-time',
              group: 'plan',
            },
            endDate: {
              type: 'string',
              format: 'date-time',
              group: 'plan',
            },
            status: {
              type: 'string',
              enum: [
                'active',
                'expired',
                'cancelled',
                'pending',
                'inactive',
                'future',
              ],
              group: 'plan',
            },
          },
        },
      },
      status: {
        type: 'string',
        enum: [
          'trial',
          'active',
          'grace',
          'inactive',
          'suspended',
          'expired',
          'deleted',
        ],
      },
      interest: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          json: [
            { value: 'website', label: 'Website, blog, etc' },
            { value: 'mobile-app', label: 'Mobile App' },
            { value: 'e-commerce', label: 'E-Commerce/POS' },
            { value: 'learning-management', label: 'Learning Management' },
            { value: 'live-chat', label: 'Live Chat & AI Chatbot' },
            { value: 'social-media', label: 'Social Media Management' },
            { value: 'forms', label: 'Forms & Survey' },
            { value: 'crm', label: 'CRM, Sales, Leads & Ticket Support' },
            { value: 'email-marketing', label: 'Email Marketing' },
            { value: 'event-management', label: 'Booking, Event, Reservation' },
            { value: 'project-management', label: 'Project Management' },
            { value: 'analytics', label: 'Analytics & Dashboard' },
            { value: 'creative-studio', label: 'Creative Studio' },
            { value: 'automation', label: 'Process Automation & Workflow' },
          ],
        },
      },
      emailHistory: {
        type: 'array',
        hidden: true,
        items: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            changedAt: { type: 'string', format: 'date-time' },
            changedBy: { type: 'string' },
            reason: { type: 'string' },
          },
        },
      },
      // Service agreements for using shared integrations
      serviceAgreements: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            service: { type: 'string' },
            status: {
              type: 'string',
              enum: ['pending', 'active', 'revoked', 'expired'],
            },
            accepted: { type: 'boolean', default: false },
            acceptedAt: { type: 'string', format: 'date-time' },
            acceptedBy: { type: 'string' },
            revokedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
      businessProfile: BusinessProfileSchema(),
      setupProgress: SetupProgressSchema(),
    },
  } as const;
};

const dd = CompanySchema();
export type CompanyModel = FromSchema<typeof dd>;

registerCollection('Company', DataType.company, CompanySchema());
