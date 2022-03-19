import { FromSchema } from 'json-schema-to-ts';
import { PermissionModel } from './permission';
import { DataType, FieldType } from '../types';

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
  audit?: AuditSubModel;
  workflow?: WorkflowDefinitionSubModel;
  workflowhistory?: WorkflowSubModel[];
  post?: PostSubModel;
  style?: StyleSubModel;
  permissions?: PermissionModel[];
  version?: string;
}

export const AuditSubSchema = () => {
  return {
    type: 'object',
    properties: {
      author: {
        type: 'string',
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
      createdate: {
        type: 'string',
        format: 'date-time',
        disabled: 'true',
      },
      modifydate: {
        type: 'string',
        format: 'date-time',
        disabled: 'true',
      },
    },
  } as const;
};
const ash = AuditSubSchema();
export type AuditSubModel = FromSchema<typeof ash>;

export const PostSubSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
      },
      slug: {
        type: 'string',
        pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
      },
      preview: {
        type: 'string',
        inputStyle: 'textarea'
      },
      allowShare: {
        type: 'boolean',
        default: true,
      },
      allowComment: {
        type: 'boolean',
        default: true,
      },
      allowRating: {
        type: 'boolean',
        default: true,
      },
      showRelated: {
        type: 'boolean',
        default: true,
      },
      categories: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          field: 'name',
        }
      },
      tags: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          field: 'name',
        }
      },
      images: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      pages: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
    },
  } as const;
};
const pes = PostSubSchema();
export type PostSubModel = FromSchema<typeof pes>;

export const WorkflowSubSchema = () => {
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
const wsh = WorkflowSubSchema();
export type WorkflowSubModel = FromSchema<typeof wsh>;

export const WorkflowDefinationSubSchema = () => {
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

const wfd = WorkflowDefinationSubSchema();
export type WorkflowDefinitionSubModel = FromSchema<typeof wfd>;


export const StyleSubSchema = () => {
  return {
    type: 'object',
    properties: {
      classes: {
        type: 'string',
        enum: ['']
      },
      css: {
        type: 'string',
        fieldType: 'Code',
        inputStyle: 'css',
      },
      javascript: {
        type: 'string',
        fieldType: 'Code',
        inputStyle: 'javascript',
      },
      styleLinks: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
      scriptLinks: {
        type: 'array',
        items: {
          type: 'string'
        }
      },
    },
  } as const;
};
const wce = StyleSubSchema();
export type StyleSubModel = FromSchema<typeof wce>;
