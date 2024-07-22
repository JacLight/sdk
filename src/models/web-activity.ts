import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../defaultschema';

export const WebActivitySchema = () => {
  return {
    type: 'object',
    timeseries: true,
    properties: {
      url: {
        type: 'string',
      },
      mouseX: {
        type: 'number',
      },
      mouseY: {
        type: 'number',
      },
      mouseAction: {
        type: 'number',
      },
      timestamp: {
        type: 'string',
      },
    },
  } as const;
};

const rt = WebActivitySchema();
export type WebActivityModel = FromSchema<typeof rt>;

registerCollection(
  'Web Activity',
  DataType.web_activity,
  WebActivitySchema(),
  [],
  [],
  false,
  false
);
