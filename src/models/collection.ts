import { registerCollection } from '../defaultschema';
import { CollectionType, DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export interface CollectionModel {
  name: string;
  title?: string;
  description?: string;
  type?: CollectionType;
  enablePost: boolean;
  enableVersioning?: boolean;
  enableSubSchema?: boolean;
  enableIndexing?: boolean;
  enableWorkflow?: boolean;
  workflow?: string;
  permission?: {};
  rules?: CollectionRule[];
  validations?: {};
  uischema?: CollectionUI[];
  schema?: any;
}

export const CollectionSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 20,
        unique: true,
      },
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'sk',
          label: 'name',
        },
      },
      title: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      workflow: {
        type: 'string',
      },
      enableVersioning: {
        type: 'boolean',
      },
      enableIndexing: {
        type: 'boolean',
      },
      enableWorkflow: {
        type: 'boolean',
      },
      enableSubSchema: {
        type: 'boolean',
      },
      permission: {
        type: 'object',
        hidden: true,
        properties: {},
      },
      elements: {
        hidden: true,
        type: 'array',
      },
      rules: {
        hidden: true,
        type: 'object',
        properties: {},
      },
      validations: {
        hidden: true,
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


export const CollectionUIDef = (): CollectionUI[] => { return null };
export const CollectionRules = (): CollectionRule[] => { return null };

export const CollectionFormSchema = CollectionSchema;
export const CollectionViewSchema = CollectionSchema;

registerCollection('CollectionForm', DataType.collectionform, CollectionSchema(), CollectionUIDef(), CollectionRules())
registerCollection('CollectionView', DataType.collectionview, CollectionSchema(), CollectionUIDef(), CollectionRules())
registerCollection('Collection', DataType.collection, CollectionSchema(), CollectionUIDef(), CollectionRules())
registerCollection('SubSchema', DataType.subschema, CollectionSchema(), CollectionUIDef(), CollectionRules())


