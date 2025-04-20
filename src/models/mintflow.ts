import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
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
        transform: 'uri',
        group: 'name',
        displayStyle: 'outlined',
      },
      appType: {
        type: 'string',
        enum: ['web', 'mobile', 'presentation'],
        default: 'web',
        group: 'name'
      },
      title: {
        type: 'string',
        displayStyle: 'outlined',
        group: 'name'
      },
      layoutFlow: {
        type: 'string',
        enum: ['vertical', 'horizontal'],
        displayStyle: 'outlined',
        default: 'vertical',
        group: 'flow'
      },
      executionFlow: {
        type: 'string',
        enum: ['auto', 'flow', 'step'],
        displayStyle: 'outlined',
        default: 'auto',
        group: 'flow'
      },
      description: {
        displayStyle: 'outlined',
        type: 'string',
        'x-control-variant': 'textarea',
      },
      instances: {
        type: 'number',
        maximum: 10,
        minimum: 0,
        hidden: true,
      },
      flow: {
        type: 'object'
      },
      status: {
        type: 'string',
        enum: ['draft', 'published', 'archived'],
        default: 'Draft',
        readOnly: true,
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
      directCall: {
        type: 'boolean',
        hidden: true,
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
        enum: ['Top', 'Right', 'Bottom', 'Left', 'hidden'],
      },
      outNodePos: {
        type: 'string',
        default: 'Bottom',
        enum: ['Top', 'Right', 'Bottom', 'Left', 'hidden'],
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
