import { FromSchema } from 'json-schema-to-ts';
import { DataType } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';
import { registerCollection } from '../defaultschema';

export const DataFeedSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      resourceType: {
        type: 'string',
      },
      resourceId: {
        type: 'string',
      },
      summary: {
        type: 'string',
      },
      status: {
        type: 'string',
      },
      eventType: {
        type: 'string',
      },
      eventDate: {
        type: 'string',
      },
    },
  } as const;
};

const ts = DataFeedSchema();
export type DataFeedModel = FromSchema<typeof ts>;
export const DataFeedUI = (): CollectionUI[] => { return null };
export const DataFeedRules = (): CollectionRule[] => { return [] };
registerCollection('DataFeed', DataType.datafeed, DataFeedSchema(), DataFeedUI(), DataFeedRules())
