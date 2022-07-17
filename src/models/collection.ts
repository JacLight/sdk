import { registerCollection } from '../defaultschema';
import { CollectionType, DataType, FieldType, FormViewSectionType } from '../types';

export interface CollectionUIGroup {
  title: string;
  description?: string;
  items?: { [key: string]: string }[];
  type?: string;
}
export interface CollectionUI {
  type: FormViewSectionType;
  items?: { [key: string]: string };
  accordion?: CollectionUIGroup[];
  tab?: CollectionUIGroup[];
  buttons?: {
    back?: { title: string; handler: () => {} };
    next?: { title: string; handler: () => {} };
    skip?: { title: string; handler: () => {} };
    finish?: { title: string; handler: () => {} };
  };
  rules?: {};
}

export interface CollectionRule {
  name: string;
  condition?: {
    type?: string;
    param?: {
      field?: string;
      targetField?: string;
      targetType?: string;
      targetValue?: string | number | boolean;
      operation?: string;
    }[];
  };
  action?: {
    operation: string;
    targetField: string | string[];
    sourceField?: string,
    sourceType?: string,
    value?: string,
    property?: string
  }[];
}

export interface CollectionModel {
  name: string;
  title?: string;
  description?: string;
  type?: CollectionType;
  enablePost: boolean;
  enableVersioning?: boolean;
  enableIndexing?: boolean;
  enableWorkflow?: boolean;
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
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
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
          field: 'name',
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


export const CollectionUI = (): CollectionUI[] => { return null };
export const CollectionRules = (): CollectionRule[] => { return null };

export const CollectionFormSchema = CollectionSchema;
export const CollectionViewSchema = CollectionSchema;
export const DataViewSchema = CollectionSchema;

registerCollection('CollectionForm', DataType.collectionform, CollectionSchema(), CollectionUI(), CollectionRules())
registerCollection('CollectionView', DataType.collectionview, CollectionSchema(), CollectionUI(), CollectionRules())
registerCollection('DataView', DataType.dataview, CollectionSchema(), CollectionUI(), CollectionRules())
registerCollection('Collection', DataType.collection, CollectionSchema(), CollectionUI(), CollectionRules())


