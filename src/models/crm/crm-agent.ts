import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { ControlType, DataType } from '../../types';
import { FileInfoSchema } from '../file-info';

export const AgentSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['random-string::10'],
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
      },
      image:FileInfoSchema(),
      profileURL: {
        type: 'string',
      },
      bookingURL: {
        type: 'string',
      },
      users: {
        type: 'array',
        collapsible: true,
        'x-control': ControlType.selectMany,
        'x-control-variant': 'combo',
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'username',
          label: 'username',
        },
        items: {
          type: 'string',
        },
      },
      phone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      meetingLinks: {
        type: 'array',
        collapsible: true,
        items: {
          type: 'string',
        },
      },
      emailConfig: {
        type: 'object',
        collapsible: true,
        properties: {
          host: {
            type: 'string',
          },
          port: {
            type: 'number',
          },
          secure: {
            type: 'boolean',
          },
          authUser: {
            type: 'string',
          },
          authPass: {
            type: 'string',
          },
        },
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
        },
      },
    },
  } as const;
};

const cs = AgentSchema();
export type CrmAgentModel = FromSchema<typeof cs>;

registerCollection('CRM Agent', DataType.agent, AgentSchema);
