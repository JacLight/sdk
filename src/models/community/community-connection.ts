import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const CommunityConnectionSchema = () => {
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

      // The person who sent the connection request
      requester: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      requesterInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          company: { type: 'string' },
          jobTitle: { type: 'string' },
          image: { type: 'string' },
        },
      },

      // The person receiving the request
      target: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.customer,
          value: 'sk',
          label: ['email', 'firstName', 'lastName'],
        },
      },
      targetInfo: {
        type: 'object',
        readOnly: true,
        properties: {
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          email: { type: 'string' },
          company: { type: 'string' },
          jobTitle: { type: 'string' },
          image: { type: 'string' },
        },
      },

      // Status
      status: {
        type: 'string',
        enum: ['pending', 'accepted', 'rejected', 'blocked', 'cancelled'],
        default: 'pending',
      },

      // Context (optional - where did they connect)
      context: {
        type: 'object',
        properties: {
          event: { type: 'string' },
          eventName: { type: 'string' },
          session: { type: 'string' },
          sessionName: { type: 'string' },
          source: {
            type: 'string',
            enum: ['event', 'qr_scan', 'search', 'recommendation', 'mutual', 'other']
          },
        },
      },

      // Message with request
      message: {
        type: 'string',
        maxLength: 500,
      },

      // Timestamps
      requestedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timestamps',
      },
      respondedAt: {
        type: 'string',
        format: 'date-time',
        group: 'timestamps',
      },

      // Metadata
      mutualConnections: {
        type: 'number',
        readOnly: true,
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
      },
      notes: {
        type: 'string',
        description: 'Private notes visible only to the connection owner',
      },
    },
    required: ['requester', 'target'],
  } as const;
};

const ccs = CommunityConnectionSchema();
export type CommunityConnectionModel = FromSchema<typeof ccs>;

registerCollection('CommunityConnection', DataType.community_connection, CommunityConnectionSchema());
