import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../defaultschema';
import { CollectionUI, CollectionRule } from '../collection';
import { DataType } from '../../types';

export const EventSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            host: {
                type: 'string',
            },
            duration: {
                type: 'string',
            },
            startTime: {
                type: 'string',
                format: 'date-time'
            },
            endTime: {
                type: 'string',
                format: 'date-time'
            },
            venue: {
                type: 'string',
            },
            participants: {
                type: 'string',
            },
            type: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            template: {
                type: 'boolean',
            },
        },
    } as const;
};


const cs = EventSchema();
export type EventModel = FromSchema<typeof cs>;

export const EventUI = (): CollectionUI[] => { return null };
export const EventRules = (): CollectionRule[] => { return null };
registerCollection('Event', DataType.event, EventSchema(), EventUI(), EventRules(), true)
