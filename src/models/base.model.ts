import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types/datatype';
import { PermissionModel } from './permission';

export interface BaseModelDTO<T> {
  page: number;
  pagesize: number;
  total: number;
  data: BaseModel<T>[];
}

export interface BaseModel<T> {
  pk: string;
  sk: string;
  name: string;
  data?: T;
  isnew?: boolean;
  datatype?: DataType | string;
  audit?: AuditModel;
  workflow?: WorkflowDefinitionModel;
  workflowhistory?: WorkflowModel[];
  postExtra?: PostExtraModel;
  permissions?: PermissionModel[];
  version?: string;
}

export const AuditSchema = () => {
  return {
    type: 'object',
    properties: {
      user: {
        type: 'string',
        disabled: 'true',
      },
      createdate: {
        type: 'string',
        format: 'date-time',
        fn: ' return new Date().toGMTString()',
        disabled: 'true',
      },
      modifydate: {
        type: 'string',
        format: 'date-time',
        fn: ' return new Date().toGMTString()',
        disabled: 'true',
      },
      publishstart: {
        type: 'string',
        format: 'date-time',
      },
      publishend: {
        type: 'string',
        format: 'date-time',
      },
    },
  } as const;
};

const ash = AuditSchema();
export type AuditModel = FromSchema<typeof ash>;

export const PostExtraSchema = () => {
  return {
    type: 'object',
    properties: {
      share: {
        type: 'boolean',
        default: true,
      },
      indexing: {
        type: 'boolean',
        default: true,
      },
      comment: {
        type: 'boolean',
        default: true,
      },
      rating: {
        type: 'boolean',
        default: true,
      },
      categories: {
        type: 'array',
        items: { type: 'string' },
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  } as const;
};

const pes = PostExtraSchema();
export type PostExtraModel = FromSchema<typeof pes>;

export const WorkflowSchema = () => {
  return {
    type: 'object',
    properties: {
      user: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      date: {
        type: 'string',
        format: 'date-time',
      },
      state: {
        type: 'string',
      },
      prevstate: {
        type: 'string',
      },
      nextstate: {
        type: 'string',
      },
    },
  } as const;
};

const wsh = WorkflowSchema();
export type WorkflowModel = FromSchema<typeof wsh>;

export const WorkflowDefinationSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      states: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            actortype: {
              type: 'string', //user group role
            },
            actorid: {
              type: 'string',
            },
            state: {
              type: 'string',
            },
            action: {
              type: 'string',
            },
            notification: {
              type: 'string', //message template id
            },
          },
        },
      },
    },
  } as const;
};

const wfd = WorkflowDefinationSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
