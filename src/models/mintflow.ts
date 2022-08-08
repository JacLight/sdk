import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { FieldType } from '../types';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const MintflowSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
      },
      title: {
        type: 'string',
      },
      instances: {
        type: 'number',
        maximum: 10,
        minimum: 0
      },
      description: {
        type: 'string',
      },
      viewport: {
        type: 'array',
        hidden: true,
      },
      nodes: {
        type: 'array',
        items: MintflowNodeSchema(),
        hidden: true,
      },
      edges: {
        type: 'array',
        items: MintflowNodeSchema(),
        hidden: true,
      },
    },
  } as const;
};

export const MintflowNodeSchema = () => {
  return {
    type: 'object',
    properties: {
      info: {
        type: 'string',
        fieldType: FieldType.paragraph,
      },
      id: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 100,
        disabled: true,
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
        minLength: 3,
        maxLength: 100,
      },
      title: {
        type: 'string',
        hidden: true,
      },
      description: {
        hidden: true,
        type: 'string',
      },
      targetNodePos: {
        type: 'string',
        default: 'Top',
        enum: ['', 'Top', 'Right', 'Bottom', 'Left'],
      },
      sourceNodePos: {
        type: 'string',
        default: 'Bottom',
        enum: ['', 'Top', 'Right', 'Bottom', 'Left'],
      },
    },
    required: ['name'],
  } as const;
}

const ps = MintflowSchema();
export type MintflowModel = FromSchema<typeof ps>;

const ps1 = MintflowNodeSchema();
export type MintflowNodeModel = FromSchema<typeof ps1>;

export const MintflowUI = (): CollectionUI[] => { return null };
export const MintflowRules = (): CollectionRule[] => { return [] };

registerCollection('WorkflowDefination', DataType.mintflow, MintflowSchema(), MintflowUI(), MintflowRules())
