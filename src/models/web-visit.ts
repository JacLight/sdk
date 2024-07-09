import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { registerCollection } from '../defaultschema';

export const WebVisitSchema = () => {
  return {
    type: 'object',
    timeseries: true,
    properties: {
      continent: {
        type: 'string',
      },
      country: {
        type: 'string',
      },
      city: {
        type: 'string',
      },
      realIp: {
        type: 'string',
      },
      subdivisionIso: {
        type: 'string',
      },
      subdivisions: {
        type: 'string',
      },
      latitude: {
        type: 'number',
      },
      forwardIp: {
        type: 'string',
      },
      longitude: {
        type: 'number',
      },
      timezone: {
        type: 'string',
      },
      traits: {
        type: 'string',
      },
      clientIp: {
        type: 'string',
      },
      referrer: {
        type: 'string',
      },
      browserInfo: {
        type: 'string',
      },
      deviceType: {
        type: 'string',
      },
      host: {
        type: 'string',
      },
      protocol: {
        type: 'string',
      },
      url: {
        type: 'string',
      },
      domain: {
        type: 'string',
      },
      timestamp: {
        type: 'string',
      },
    },
  } as const;
};

const rt = WebVisitSchema();
export type WebVisitModel = FromSchema<typeof rt>;

registerCollection(
  'Web visit',
  DataType.web_visit,
  WebVisitSchema(),
  [],
  [],
  false,
  false
);
