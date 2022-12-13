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
  default?: boolean;
  title?: string;
  collapsible?: boolean;
  items?: { [key: string]: string }[];
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
    type?: string;  //and or
    param?: {
      field1?: string; //property you want to read or compare
      field2?: string; //property you want to read or compare
      compareField?: boolean; // field or value
      value?: string | number | boolean; // incase you're comparing to a fixed value  set it here
      operation?: string;
    }[];
  };
  action?: {
    operation: string;
    targetField?: string | string[]; //property you want to apply actions to
    sourceField?: string, //property where the value you want to apply will come from
    valueFromField?: boolean;
    value?: string, // incase you're set to fixed value put it here
  }[];
}

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


export const CollectionUI = (): CollectionUI[] => { return null };
export const CollectionRules = (): CollectionRule[] => { return null };

export const CollectionFormSchema = CollectionSchema;
export const CollectionViewSchema = CollectionSchema;

registerCollection('CollectionForm', DataType.collectionform, CollectionSchema(), CollectionUI(), CollectionRules())
registerCollection('CollectionView', DataType.collectionview, CollectionSchema(), CollectionUI(), CollectionRules())
registerCollection('Collection', DataType.collection, CollectionSchema(), CollectionUI(), CollectionRules())
registerCollection('SubSchema', DataType.subschema, CollectionSchema(), CollectionUI(), CollectionRules())


