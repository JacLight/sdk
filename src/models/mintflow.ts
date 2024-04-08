import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { ControlType } from '../types';
import { DataType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const MintflowSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 50,
        unique: true,
        transform: 'uri'
      },
      title: {
        type: 'string',
      },
      instances: {
        type: 'number',
        maximum: 10,
        minimum: 0,
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
      status: {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        default: 'Draft',
      }
    },
  } as const;
};

export const MintflowNodeSchema = () => {
  return {
    type: 'object',
    properties: {
      info: {
        type: 'string',
        'x-control': ControlType.paragraph,
      },
      id: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        disabled: true,
      },
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        minLength: 3,
        maxLength: 100,
        transform: 'uri'
      },
      title: {
        type: 'string',
        hidden: true,
      },
      description: {
        hidden: true,
        type: 'string',
      },
      inNodePos: {
        type: 'string',
        default: 'Top',
        enum: ['', 'Top', 'Right', 'Bottom', 'Left'],
      },
      outNodePos: {
        type: 'string',
        default: 'Bottom',
        enum: ['', 'Top', 'Right', 'Bottom', 'Left'],
      },
    },
    required: ['name'],
  } as const;
};

const ps = MintflowSchema();
export type MintflowModel = FromSchema<typeof ps>;

const ps1 = MintflowNodeSchema();
export type MintflowNodeModel = FromSchema<typeof ps1>;

export const MintflowUI = (): CollectionUI[] => {
  return null;
};
export const MintflowRules = (): CollectionRule[] => {
  return [];
};

registerCollection(
  'Mintflow',
  DataType.mintflow,
  MintflowSchema(),
  MintflowUI(),
  MintflowRules()
);
