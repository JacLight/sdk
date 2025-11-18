import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';

import { ControlType, DataType } from '../../types';

export const AgentSchema = () => {
  return {
    type: 'object',
    properties: {
      user: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.user,
          value: 'name',
          label: 'name',
        },
      },
      phone: {
        type: 'string',
      },
      email: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      emailConfig:{
        type: 'object',
        collapsible:true,
        properties:{
          host:{
            type:'string',
          },
          port:{
            type:'number',
          },
          secure:{
            type:'boolean',
          },
          authUser:{
            type:'string',
          },
          authPass:{
            type:'string',
          },
        },
      }
    },
  } as const;
};

const cs = AgentSchema();
export type CrmAgentModel = FromSchema<typeof cs>;

registerCollection('CRM Agent', DataType.agent, AgentSchema);
