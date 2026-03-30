import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

export const CommunityHashtagSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        title: 'Hashtag',
        description: 'Lowercase tag without #',
      },

      // Stats
      usageCount: { type: 'number', default: 0, readOnly: true },
      trendingScore: { type: 'number', default: 0, readOnly: true },
      lastUsedAt: { type: 'string', format: 'date-time', readOnly: true },

      // Related
      relatedTags: {
        type: 'array',
        items: { type: 'string' },
        readOnly: true,
      },

      // Pages where this tag is most used
      topPages: {
        type: 'array',
        items: { type: 'string' },
        readOnly: true,
      },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'banned'],
        default: 'active',
      },
    },
    required: ['name'],
  } as const;
};

const chs = CommunityHashtagSchema();
export type CommunityHashtagModel = FromSchema<typeof chs>;

registerCollection('CommunityHashtag', DataType.community_hashtag, CommunityHashtagSchema());
