import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityReactionSchema = () => {
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

      // What is being reacted to
      target: {
        type: 'string',
        title: 'Target ID',
        description: 'SK of the post, comment, story, or message being reacted to',
      },
      targetType: {
        type: 'string',
        enum: ['post', 'comment', 'story', 'message'],
        default: 'post',
      },

      // Who is reacting
      reactor: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'data.email',
          label: ['email', 'firstName', 'lastName'],
        },
      },

      // Reaction type
      type: {
        type: 'string',
        enum: ['like', 'love', 'fire', 'clap', 'insightful', 'funny', 'sad', 'angry'],
        default: 'like',
      },
    },
    required: ['target', 'targetType', 'reactor', 'type'],
  } as const;
};

const crs = CommunityReactionSchema();
export type CommunityReactionModel = FromSchema<typeof crs>;

registerCollection('CommunityReaction', DataType.community_reaction, CommunityReactionSchema());
