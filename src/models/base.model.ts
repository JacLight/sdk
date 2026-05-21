import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { FileInfoSchema } from './file-info';
import { TaskModel } from './task';

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
  lastItem?: number;
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

// System-level record sharing. Lives on the record itself so any datatype can
// be shared without a separate store. The token is the public URL secret; the
// passcode, if set, is required and is hashed at rest (presence of
// passcodeHash signals "passcode required" — no separate mode field). Absent
// expiresAt = no expiry. Whatever the agent doesn't set is not filled in by
// the server.
export interface BaseModelShare {
  token: string;
  status: 'active' | 'revoked';
  passcodeHash?: string;
  expiresAt?: string;
  notify?: { channel: 'sms' | 'email' | 'whatsapp'; to: string; sentAt?: string }[];
  createdBy?: string;
  createdAt?: string;
  openedAt?: string;
}

export interface BaseModelStats {
  likes?: number;
  dislikes?: number;
  views?: number;
  shares?: number;
  bookmarks?: number;
  follows?: number;
  averageRating?: number;
  ratingCount?: number;
  reactions?: { author: string; reaction: string; reacted_at: Date }[];
  reactionSummary?: { [type: string]: number };
  last_viewed?: Date;
  last_activity?: Date;
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
  publishedDate?: Date;
  author?: string;
  requiredRole?: RequiredRoleModel;
  notes?: { author: string; comment: string; date: Date }[];
  rules?: any[];
  stats?: BaseModelStats;
  share?: BaseModelShare;
  owner?: {
    datatype?: DataType;
    id?: string;
    name?: string;
    email?: string;
  },
  crm_agent?: string;
  state?: ModelState;
  search?: string;
  create_hash?: string;
  modified_by?: string;
  created_by?: string;
  client?: string;
}

export const baseModelSystemFields = ['pk', 'sk', 'name', 'datatype', 'version', 'createdate', 'modifydate', 'publishedDate', 'author', 'notes', 'schedules', 'rules', 'schedule', 'stats', 'share', 'state', 'search', 'create_hash', 'modified_by', 'created_by', 'client'] as const;

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
        'x-control-variant': 'combo',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.tag,
          value: 'name',
          label: 'name',
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
