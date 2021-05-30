import { JsonSchema } from '../types/jsonschema/jsonSchema';
import { CollectionType } from '../types/collectiontype';

// Added model to the name to as to diffrentiate it from the collection builder compoment
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
  uischema?: JsonSchema;
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
