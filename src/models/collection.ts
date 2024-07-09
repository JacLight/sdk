import { registerCollection } from '../defaultschema';
import { CollectionType, DataType, ControlType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export interface CollectionModel {
  name: string;
  title?: string;
  description?: string;
  type?: CollectionType;
  enablePost: boolean;
  parent: string;
  enableVersioning?: boolean;
  enableSubSchema?: boolean;
  enableIndexing?: boolean;
  enableWorkflow?: boolean;
  mainType?: string;
  subType?: string;
  workflow?: string;
  permission?: {};
  theme: {};
  style: {};
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
        pattern: '^[a-zA-Z_0-9]*$',
        minLength: 3,
        maxLength: 20,
        unique: true,
        transform: 'uri',
        group: 'title',
        groupLayout: 'flat',
      },
      parent: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.collection,
          value: 'name',
          label: 'name',
        },
      },
      icon: {
        type: 'string',
        'x-control': ControlType.icon,
        group: 'title',
        groupLayout: 'flat',
      },
      title: {
        type: 'string',
        group: 'title',
        groupLayout: 'flat',
      },
      type: {
        type: 'string',
      },
      mainType: {
        type: 'string',
        hidden: true,
      },
      subType: {
        type: 'string',
        hidden: true,
      },
      hideHeading: {
        type: 'boolean',
        hidden: true,
      },
      description: {
        type: 'string',
        group: 'workflow',
        groupLayout: 'flat',
      },
      workflow: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.workflowdefinition,
          value: 'sk',
          label: 'name',
        },
        group: 'workflow',
        groupLayout: 'flat',
      },
      enableVersioning: {
        type: 'boolean',
        group: 'group1',
      },
      enableIndexing: {
        type: 'boolean',
        group: 'group1',
      },
      enableWorkflow: {
        type: 'boolean',
        group: 'group1',
      },
      enableSubSchema: {
        type: 'boolean',
        group: 'group1',
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
      style: {
        hidden: true,
        type: 'object',
        properties: {},
      },
      theme: {
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
        items: {
          type: 'string',
        },
        hidden: true,
      },
    },
    required: ['name'],
  };
};


export const CollectionViewSchema = CollectionSchema;

registerCollection(
  'AuraFlow',
  DataType.auraflow,
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



