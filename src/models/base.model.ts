import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { CommentModel } from './comment';
import { FileInfoSchema } from './fileinfo';
import { WorkflowSubModel } from './workflowdefinition';
import { ActivityModel } from './activity';
import { MessageModel } from './crm';

export enum SortType {
  desc = -1,
  asc = 1,
}

export enum ModelState {
  draft = 'draft',
  new = 'new',
  pending = 'pending',
  inprogress = 'inprogress',
  reviewed = 'reviewed',
  approved = 'approved',
  published = 'published',
  completed = 'completed',
  hold = 'hold',
  rejected = 'rejected',
  cancelled = 'cancelled',
  archived = 'archived',
  deleted = 'deleted',
}

export interface DataOptions {
  sort?: any;
  sortType?: SortType;
  modelState?: ModelState | ModelState[];
  lastItem?: string;
  page?: number;
  pageSize?: number;
  lastPage?: number;
  refresh?: boolean;
  enrich?: boolean;
  hasNext?: boolean;
  excludeFields?: string[];
  includeFields?: string[];
  maskFields?: string[];
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
  isNew?: boolean;
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
  views?: number;
  owner?: {
    datatype: DataType;
    id: string;
  },
  state?: ModelState;
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
        'x-control-variant': 'textarea',
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
        'x-control-variant': 'tree',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'tree',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.category,
          value: 'name',
          label: 'name',
          children: 'children',
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
                  'x-control': ControlType.selectMany,
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
        'x-control': 'Code',
        'x-control-variant': 'css',
        collapsible: true,
      },
      javascript: {
        type: 'string',
        'x-control': 'Code',
        collapsible: true,
        'x-control-variant': 'javascript',
      },
      styleLinks: {
        type: 'array',
        collapsible: true,
        items: {
          layout: 'horizontal',
          pattern: '^https?:\\/\\/',
          styleClass: 'w-full',
          hideLabel: true,
          format: 'uri',
          type: 'string',
        },
      },
      scriptLinks: {
        collapsible: true,
        type: 'array',
        items: {
          styleClass: 'w-full',
          pattern: '^https?:\\/\\/',
          layout: 'horizontal',
          hideLabel: true,
          type: 'string',
          format: 'uri',
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
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
        'x-control-variant': 'chip',
        'x-control': ControlType.selectMany,
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
