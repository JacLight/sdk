import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

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
      sites: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
  } as const;
};

const dd = CompanySchema();
export type CompanyModel = FromSchema<typeof dd>;

export const CompanyUI = (): CollectionUI[] => { return null };
export const CompanyRules = (): CollectionRule[] => { return [] };
registerCollection('Company', DataType.company, CompanySchema(), CompanyUI(), CompanyRules())
