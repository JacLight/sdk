import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const WorkflowDefinitionSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
            },
            description: {
                type: 'string',
            },
            sla: {
                type: 'string',
            },
            stages: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        actorType: {
                            type: 'string', //user group role
                        },
                        actorId: {
                            type: 'string',
                        },
                        state: {
                            type: 'string', //start, ongoing end
                        },
                        tickets: {
                            type: 'array',
                            hidden: true,
                            items: {
                                type: 'string'
                            }
                        },
                        name: {
                            type: 'string',
                        },
                        event: {
                            type: 'string',
                        },
                        notificationTemplate: {
                            type: 'string', //message template id
                        },
                        sla: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    } as const;
};

export const WorkflowDefinitionUI = (): CollectionUI[] => { return null };
export const WorkflowDefinitionRules = (): CollectionRule[] => { return null };

const wfd = WorkflowDefinitionSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
registerCollection('WorkflowDefinition', DataType.workflowdefinition, WorkflowDefinitionSchema(), WorkflowDefinitionUI(), WorkflowDefinitionRules())
