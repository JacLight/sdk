import { FromSchema } from 'json-schema-to-ts';
import { DataType, FieldType } from '../types';
import { CommentModel } from './comment';
import { FileInfoSchema } from './fileinfo';
import { WorkflowSubModel } from './workflowdefinition';
import { ActivityModel } from './activity';
import { MessageModel } from './crm';

export enum SortType {
  desc = -1,
  asc = 1,
}

export interface DataOptions {
  sort?: any;
  sortType?: SortType;
  lastItem?: string;
  page?: number;
  pageSize?: number;
  lastPage?: number;
  refresh?: boolean;
  enrich?: boolean;
  hasNext?: boolean;
}

export interface BaseModelDTO<T> extends DataOptions {
  total?: number;
  datatype?: DataType | string;
  error?: { message: string; code: number; stalk: any };
  data?: BaseModel<T>[];
  fromCache?: boolean;
}

export interface BaseModel<T> {
  pk: string;
  sk: string;
  name: string;
  data?: T;
  isnew?: boolean;
  datatype?: DataType | string;
  workflow?: WorkflowSubModel;
  post?: PostSubModel;
  style?: StyleSubModel;
  version: number;
  createdate?: Date;
  modifydate?: Date;
  author?: string;
  subschema?: string;
  requiredRole?: RequiredRoleModel;
  comments?: CommentModel[];
  activities?: ActivityModel[];
  messages?: MessageModel[];
  shares?: number;
  likes?: number;
  dislikes?: number;
  rating?: number;
  ratingCount?: number;
  owner?: {
    datatype: DataType;
    id: string;
  }
}

export const PostSubSchema = () => {
  return {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        hidden: true,
      },
      summary: {
        type: 'string',
        hidden: true,
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
        type: 'array',
        items: {
          type: 'string',
        },
        inputStyle: 'tree',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
          children: 'children',
        },
      },
      tags: {
        type: 'array',
        items: {
          type: 'string',
        },
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          value: 'name',
          label: 'name',
        },
      },
      images: FileInfoSchema(),
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
        'description': 'Classes to be applied to the element separated by space',
      },
      theme: {
        type: 'object',
        collapsible: true,
        properties: {
          name: {
            type: 'string',
            'description': 'Name of the theme',
          },
          customize: {
            type: 'array',
            items: {
              type: 'object',
              layout: 'horizontal',
              properties: {
                property: {
                  type: 'string',
                  fieldType: FieldType.selectionmultiple,
                  dataSource: {
                    'source': 'json',
                    'json': ['primary', 'primary-content', 'secondary', 'secondary-content', 'accent', 'neutral', 'neutral-content', 'base100', 'base-content', 'info', 'info-content', 'success', 'success-content', 'warning', 'warning-content', 'error', 'error-content'],
                  }
                },
                value: {
                  type: 'string',
                },
              },
            }
          }
        }
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
      styleLinks: {
        type: 'array',
        collapsible: true,
        items: {
          layout: 'horizontal',
          styleClass: 'w-full',
          hideLabel: true,
          type: 'string',
        },
      },
      scriptLinks: {
        collapsible: true,
        type: 'array',
        items: {
          styleClass: 'w-full',
          layout: 'horizontal',
          hideLabel: true,
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
          value: 'data.name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      create: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'data.name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      update: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'data.name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      delete: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'data.name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      review: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'data.name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
      approve: {
        type: 'array',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
        dataSource: {
          source: 'collection',
          collection: DataType.userrole,
          value: 'data.name',
          label: 'name',
        },
        items: {
          type: 'string',
        },
      },
    },
  } as const;
};
const rrsc = RequiredRoleSubSchema();
export type RequiredRoleModel = FromSchema<typeof rrsc>;
