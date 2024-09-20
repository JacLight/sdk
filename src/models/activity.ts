import { FromSchema } from 'json-schema-to-ts';
import { DataType, ControlType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { registerCollection } from '../default-schema';
import { toTitleCase } from '../utils/index';
import { FileInfoSchema } from './file-info';

export const ActivityTypes: { [key: string]: string } = {
  comment: 'comment',
  like: 'like',
  dislike: 'dislike',
  rate: 'rate',
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
    },
  } as const;
};

const ts = ActivitySchema();
export type ActivityModel = FromSchema<typeof ts>;
export const ActivityUI = (): CollectionUI[] => {
  return null;
};
export const ActivityRules = (): CollectionRule[] => {
  return [];
};
registerCollection(
  'Activity',
  DataType.activity,
  ActivitySchema(),
  ActivityUI(),
  ActivityRules()
);


