import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { CommentModel } from './comment';
import { FileInfoSchema } from './file-info';
import { ActivityModel } from './activity';
import { MessageModel } from './crm';
import { TaskModel } from './task';
import { ScheduleModel } from './schedule';

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
  random?: boolean;
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
  subschema?: string;
  workflow?: TaskModel;
  post?: PostSubModel;
  style?: StyleSubModel;
  version: number;
  createdate?: Date;
  modifydate?: Date;
  author?: string;
  requiredRole?: RequiredRoleModel;
  comments?: CommentModel[];
  activities?: ActivityModel[];
  messages?: MessageModel[];
  schedules?: ScheduleModel[];
  rules?: any[];
  schedule?: ScheduleModel;
  shares?: number;
  likes?: number;
  dislikes?: number;
  averageRating?: number;
  ratingCount?: number;
  owner?: {
    datatype?: DataType;
    id?: string;
    name?: string;
    email?: string;
  },
  state?: ModelState;
  search?: string;
  create_hash?: string;
  reactions?: any[];
  modified_by?: string;
  created_by?: string;
  views?: number;
  last_viewed?: Date;
  client?: string;
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
        labelPostion: 'top',
        group: 'share',
      },
      allowComment: {
        type: 'boolean',
        default: true,
        labelPostion: 'top',
        group: 'share',
      },
      allowRating: {
        type: 'boolean',
        labelPostion: 'top',
        default: true,
        group: 'share',
      },
      showRelated: {
        type: 'boolean',
        labelPostion: 'top',
        default: true,
        group: 'share',
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
    },
  } as const;
};
const pes = PostSubSchema();
export type PostSubModel = FromSchema<typeof pes>;

export const StyleSubSchema = () => {
  return {
    type: 'object',
    properties: {
      theme: {
        type: 'object',
        collapsible: 'close',
        properties: {
          name: {
            type: 'string',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            maxItems: 1,
            dataSource: {
              source: 'function',
              value: 'getThemeSettingsList',
            },
          },
          darkMode: {
            type: 'string',
            enum: ['auto', 'dark', 'light'],
          },
          energy: {
            type: 'string',
          },
          settings: {
            type: 'array',
            items: {
              type: 'object',
              layout: 'horizontal',
              showIndex: true,
              properties: {
                property: {
                  type: 'string',
                },
                value: {
                  type: 'string',
                },
              },
            }
          }
        }
      },
      classes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      css: {
        type: 'string',
        'x-control':  ControlType.code,
        'x-control-variant': 'css',
        collapsible: true,
      },
      javascript: {
        type: 'string',
        'x-control':  ControlType.code,
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
        styling:{
          container: 'px-0',
        }
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
        styling:{
          container: 'px-0',
          layout: 'px-0',
        }
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
