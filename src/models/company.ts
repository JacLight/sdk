import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType } from '../types';
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
      maxusers: {
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
