import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const CommunityBadgeSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        title: 'Badge ID',
      },
      title: { type: 'string', title: 'Badge Name' },
      description: { type: 'string' },
      icon: FileInfoSchema(),

      // Classification
      category: {
        type: 'string',
        enum: ['engagement', 'networking', 'events', 'content', 'special', 'milestone'],
        default: 'engagement',
      },
      rarity: {
        type: 'string',
        enum: ['common', 'uncommon', 'rare', 'legendary'],
        default: 'common',
      },

      // Criteria
      criteria: {
        type: 'string',
        title: 'Human-readable criteria',
        description: 'e.g. "Connect with 50 people"',
      },
      criteriaType: {
        type: 'string',
        title: 'Machine-readable criteria type',
        description: 'e.g. connections_count, posts_count, events_attended',
      },
      criteriaValue: {
        type: 'number',
        title: 'Threshold value',
      },

      // Auto-award
      autoAward: {
        type: 'boolean',
        default: true,
        title: 'Automatically award when criteria met',
      },

      // Stats
      earnedBy: { type: 'number', default: 0, readOnly: true },

      // Status
      status: {
        type: 'string',
        enum: ['active', 'retired'],
        default: 'active',
      },
    },
    required: ['name', 'title'],
  } as const;
};

const cbds = CommunityBadgeSchema();
export type CommunityBadgeModel = FromSchema<typeof cbds>;

registerCollection('CommunityBadge', DataType.community_badge, CommunityBadgeSchema());
