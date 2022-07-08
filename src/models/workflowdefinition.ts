import { FromSchema } from 'json-schema-to-ts';

export const WorkflowDefinationSchema = () => {
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
                        actortype: {
                            type: 'string', //user group role
                        },
                        actorid: {
                            type: 'string',
                        },
                        state: {
                            type: 'string', //start, ongoing end
                        },
                        tickets: {
                            type: 'array',
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
                    },
                },
            },
        },
    } as const;
};

const wfd = WorkflowDefinationSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;