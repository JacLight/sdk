import { FromSchema } from 'json-schema-to-ts';
import { DataType, FieldType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { registerCollection } from '../defaultschema';
import { toTitleCase } from '../utils/index';

export const ActivitySchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      resourceType: {
        type: 'string',
      },
      resourceId: {
        type: 'string',
      },
      description: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      type: {
        type: 'string',
        inputStyle: 'chip',
        fieldType: FieldType.selectionmultiple,
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


export enum ActivityTypes {
  comment = 'comment',
  like = 'like',
  dislike = 'dislike',
  rating = 'rating',
  share = 'share',
  follow = 'follow',
  view = 'view',
  order = 'order',
  addToCart = 'addToCart',
  download = 'download',
  upload = 'upload',
  create = 'create',
  update = 'update',
  delete = 'delete',
  login = 'login',
  logout = 'logout',
  signup = 'signup',
  resetPassword = 'resetPassword',
  changePassword = 'changePassword',
  changeEmail = 'changeEmail',
  changeUsername = 'changeUsername',
  upgrade = 'upgrade',
  downgrade = 'downgrade',
  payment = 'payment',
  refund = 'refund',
  subscribe = 'subscribe',
  unsubscribe = 'unsubscribe',
}
