import { JsonSchemaCustom } from '../types/jsonschema/jsonSchemaCustom';
import { CollectionType, FormViewSectionType } from '../types';


export interface CollectionUIGroup {
  title: string, description?: string, items?: { [key: string]: string }[], type?: string
}
export interface CollectionUI {
  type: FormViewSectionType;
  items?: { [key: string]: string }
  accordion?: CollectionUIGroup[],
  stepper?: CollectionUIGroup[],
  buttons?: {
    back?: { title: string, handler: () => {} },
    next?: { title: string, handler: () => {} },
    skip?: { title: string, handler: () => {} },
    finish?: { title: string, handler: () => {} },
  },
  rules?: {}
}

export interface CollectionRule {
  name: string,
  condition?: {
    type?: string,
    param?: { field?: string, targetField?: string, targetType?: string, targetValue?: string | number, operation?: string }[]
  }
  action?: { operation: string, targetField: string, script: string }[]
}

export interface CollectionModel {
  name: string
  title?: string;
  description?: string;
  type?: CollectionType;
  enableAssetFramework?: boolean;
  enableWorkflow?: boolean;
  enableVersioning?: boolean;
  enableIndexing?: boolean;
  permission?: {};
  rules?: CollectionRule[];
  validations?: {};
  uischema?: CollectionUI[];
  schema?: JsonSchemaCustom;
}

export const CollectionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 20,
        unique: true
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      enableAssetFramework: {
        type: 'boolean',
      },
      enableWorkflow: {
        type: 'boolean',
      },
      enableVersioning: {
        type: 'boolean',
      },
      permission: {
        type: 'object',
        properties: {},
      },
      elements: {
        type: 'array',
      },
      rules: {
        type: 'object',
        properties: {},
      },
      validations: {
        type: 'object',
        properties: {},
      },
      required: {
        type: 'array',
      },
    },
    required: ['name'],
  };
};

export const CollectionUI = (): CollectionUI[] => {
  return null
};

export const CollectionRules = (): CollectionRule[] => {
  return [{ 'name': 'norule' }]
}