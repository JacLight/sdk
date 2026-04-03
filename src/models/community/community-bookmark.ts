import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityBookmarkSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        unique: true,
        readOnly: true,
        transform: ['random-string::12', 'uri'],
      },

      // Owner
      customer: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'data.email',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Target
      target: {
        type: 'string',
        title: 'Bookmarked Item ID',
      },
      targetType: {
        type: 'string',
        enum: ['post', 'event', 'session', 'page', 'person', 'comment', 'story'],
        default: 'post',
      },

      // Organization
      collection: {
        type: 'string',
        title: 'Collection/Folder',
        description: 'User-defined collection name for organizing bookmarks',
      },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
        title: 'Personal notes',
      },
    },
    required: ['customer', 'target', 'targetType'],
  } as const;
};

const cbs = CommunityBookmarkSchema();
export type CommunityBookmarkModel = FromSchema<typeof cbs>;

registerCollection('CommunityBookmark', DataType.community_bookmark, CommunityBookmarkSchema());
