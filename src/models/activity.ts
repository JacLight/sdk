import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { registerCollection } from '../default-schema';
import { toTitleCase } from '../utils/index';
import { FileInfoSchema } from './file-info';

export const ActivityTypes: { [key: string]: string } = {
  comment: 'comment',
  like: 'like',
  dislike: 'dislike',
  rating: 'rating',
  share: 'share',
  follow: 'follow',
  view: 'view',
  order: 'order',
  addToCart: 'addToCart',
  download: 'download',
  upload: 'upload',
  create: 'create',
  update: 'update',
  delete: 'delete',
  login: 'login',
  logout: 'logout',
  signup: 'signup',
  resetPassword: 'resetPassword',
  changePassword: 'changePassword',
  changeEmail: 'changeEmail',
  changeUsername: 'changeUsername',
  upgrade: 'upgrade',
  downgrade: 'downgrade',
  payment: 'payment',
  refund: 'refund',
  subscribe: 'subscribe',
  unsubscribe: 'unsubscribe',
  register: 'register',
  reaction: 'reaction',
}

export const ActivitySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      image: FileInfoSchema(),
      value: {
        type: 'string',
      },
      comment: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      type: {
        type: 'string',
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
        dataSource: {
          source: 'json',
          value: Object.keys(ActivityTypes).map((key: any) => ({ label: toTitleCase(key), value: key }))
        }
      },
      meta:{
        type: 'object',
        hidden: true,
      }
    },
  } as const;
};

const ts = ActivitySchema();
export type ActivityModel = FromSchema<typeof ts>;
registerCollection(
  'Activity',
  DataType.activity,
  ActivitySchema()
);

