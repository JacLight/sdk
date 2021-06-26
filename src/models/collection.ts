import { JsonSchema } from '../types/jsonschema/jsonSchema';
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
  rules?: {};
  validations?: {};
  uischema?: CollectionUI[];
  schema?: JsonSchema;
}

export const CollectionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 100,
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

export const CollectionUISchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      title: {
        type: 'string',
      },
      page_pk: {
        type: 'string',
      },
      pages: {
        type: 'array',
      },
      site_navigation: {
        type: 'array',
      },
      css: {
        type: 'string',
      },
      javascript: {
        type: 'string',
      },
    },
    required: ['name'],
  };
};
