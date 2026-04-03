import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityFollowSchema = () => {
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

      // Who is following
      follower: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'data.email',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      followerEmail: { type: 'string', format: 'email' },

      // What is being followed
      following: {
        type: 'string',
        title: 'Following ID',
        description: 'SK of the person (customer) or page being followed',
      },
      followingType: {
        type: 'string',
        enum: ['person', 'page', 'hashtag'],
        default: 'person',
      },

      // Preferences
      muted: { type: 'boolean', default: false, title: 'Mute notifications' },
      notifyOnPost: { type: 'boolean', default: true },
    },
    required: ['follower', 'following', 'followingType'],
  } as const;
};

const cfs = CommunityFollowSchema();
export type CommunityFollowModel = FromSchema<typeof cfs>;

registerCollection('CommunityFollow', DataType.community_follow, CommunityFollowSchema());
