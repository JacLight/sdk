import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { ControlType, DataType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

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
        transform: 'uri'
      },
      database: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 20,
        unique: true,
      },
      maxUsers: {
        type: 'number',
      },
      active: {
        type: 'boolean',
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
          ]
        }
      },
      status: {
        type: 'string',
        enum: ['trial', 'active', 'grace', 'inactive', 'suspended', 'expired', 'deleted'],
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
          ]
        }
      }
    },
  } as const;
};

const dd = CompanySchema();
export type CompanyModel = FromSchema<typeof dd>;

export const CompanyUI = (): CollectionUI[] => {
  return null;
};
export const CompanyRules = (): CollectionRule[] => {
  return [];
};
registerCollection(
  'Company',
  DataType.company,
  CompanySchema(),
  CompanyUI(),
  CompanyRules()
);
``