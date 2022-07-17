import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const CallLogSchema = () => {
    return {
        type: 'object',
        properties: {
            parent: {
                type: 'string',
            },
            transcript: {
                type: 'string',
            },
            note: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            from: {
                type: 'string',
            },
            to: {
                type: 'string',
            },
            conversation: {
                type: 'string',
            },
        },
    } as const;
};

const cs = CallLogSchema();
export type CallModel = FromSchema<typeof cs>;

export const CallLogUI = (): CollectionUI[] => { return null };
export const CallLogRules = (): CollectionRule[] => { return null };
registerCollection('Call Log', DataType.calllog, CallLogSchema(), CallLogUI(), CallLogRules(), true)
