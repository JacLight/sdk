import { FromSchema } from 'json-schema-to-ts';
import { DataType, FieldType } from '../types';
import { CommentModel } from './comment';
import { WorkflowEntryModel } from './workflowdefinition';
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
  workflow?: WorkflowEntryModel,
  post?: PostSubModel;
  style?: StyleSubModel;
  version: number;
  createdate?: Date;
  modifydate?: Date;
  author?: string;
  subschema?: string,
  requiredRole?: RequiredRoleModel
  comments?: CommentModel[]
}
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
        inputStyle: 'textarea',
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
      publishStart: {
        type: 'string',
        format: 'date-time',
      },
      publishEnd: {
        type: 'string',
        format: 'date-time',
      },
      categories: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          field: 'name',
        },
      },
      tags: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          field: 'name',
        },
      },
      images: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      pages: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  } as const;
};
const pes = PostSubSchema();
export type PostSubModel = FromSchema<typeof pes>;

export const StyleSubSchema = () => {
  return {
    type: 'object',
    properties: {
      classes: {
        type: 'string',
        enum: [''],
      },
      template: {
        type: 'string',
      },
      theme: {
        type: 'string',
      },
      css: {
        type: 'string',
        fieldType: 'Code',
        inputStyle: 'css',
        collapsible: true,
      },
      javascript: {
        type: 'string',
        fieldType: 'Code',
        collapsible: true,
        inputStyle: 'javascript',
      },
      color: {
        type: 'string',
      },
      styleLinks: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      scriptLinks: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
  } as const;
};
const wce = StyleSubSchema();
export type StyleSubModel = FromSchema<typeof wce>;

export const RequiredRoleSubSchema = () => {
  return {
    type: 'object',
    properties: {
      read: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
          id: 'name'
        },
        items: {
          type: 'string',
        }
      },
      create: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
          id: 'name'
        },
        items: {
          type: 'string',
        }
      },
      update: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
          id: 'name'
        },
        items: {
          type: 'string',
        }
      },
      delete: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
          id: 'name'
        },
        items: {
          type: 'string',
        }
      },
      review: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
          id: 'name'
        },
        items: {
          type: 'string',
        }
      },
      approve: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          field: 'name',
          id: 'name'
        },
        items: {
          type: 'string',
        }
      },
    },
  } as const;
};
const rrsc = RequiredRoleSubSchema();
export type RequiredRoleModel = FromSchema<typeof rrsc>;