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
        transform: 'uri'
      },
      parent: {
        type: 'string',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
      },
      icon: {
        type: 'string',
        fieldType: FieldType.icon,
      },
      title: {
        type: 'string',
      },
      hideHeading: {
        type: 'boolean',
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


export const CollectionViewSchema = CollectionSchema;

registerCollection(
  'CollectionView',
  DataType.collectionview,
  CollectionSchema(),
  null,
  null
);
registerCollection(
  'Collection',
  DataType.collection,
  CollectionSchema(),
  null,
  null
);
registerCollection(
  'SubSchema',
  DataType.subschema,
  CollectionSchema(),
  null,
  null
);



