import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const WorkflowDefinitionSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
            },
            title: {
                type: 'string',
            },
            description: {
                type: 'string',
            },
            sla: {
                type: 'string',
            },
            startFlow: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.mintflow,
                    field: 'name',
                },
            },
            endFlow: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.mintflow,
                    field: 'name',
                },
            },
            notificationTemplate: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.messagetemplate,
                    field: 'name',
                },
            },
            stages: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        actorType: {
                            type: 'string',
                            fieldType: FieldType.selectionmultiple,
                            dataSource: {
                                source: 'json',
                                json: [{ label: 'Group', value: 'usergroup' }, { label: 'Role', value: 'userrole' }, { label: 'User', value: 'user' }]
                            },
                        },
                        actor: {
                            type: 'string',
                            fieldType: FieldType.selectionmultiple,
                            dataSource: {
                                source: 'collection',
                                collection: DataType.usergroup,
                                field: 'name',
                            },
                        },
                        state: {
                            type: 'string',
                            enum: ['start', 'processing', 'end']
                        },
                        name: {
                            type: 'string',
                        },
                        event: {
                            type: 'string',
                        },
                        sla: {
                            type: 'string',
                        },
                        items: {
                            type: 'array',
                            hidden: true,
                        },
                        flow: {
                            type: 'string',
                            fieldType: FieldType.selectionmultiple,
                            dataSource: {
                                source: 'collection',
                                collection: DataType.mintflow,
                                field: 'name',
                            },
                        },
                    },
                },
            },
        },
    } as const;
};


export const WorkflowDefinitionRules = (): CollectionRule[] => {
    return [
        {
            name: 'Actor Type',
            action: [
                {
                    operation: 'setProperty',
                    property: 'collection',
                    targetField: '/properties/stages/items/properties/actor/dataSource',
                    sourceField: '/properties/stages/items/properties/actorType',
                    sourceType: 'field',
                },
            ],
            condition: {
                type: 'and',
                param: [
                    {
                        targetValue: true,
                        targetType: 'value',
                        targetField: 'Field2',
                        field: '/properties/stages/items/properties/actorType',
                        operation: 'notEmpty',
                    },
                ],
            },
        },
    ]
};

export const WorkflowEntrySchema = () => {
    return {
        type: 'object',
        properties: {
            workflow: {
                type: 'string',
            },
            stage: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            history: {
                type: 'array',
                readonly: true,
                items: WorkflowTaskSchema()
            },
            newTask: {
                ...WorkflowTaskSchema(),
                displayStyle: 'card',
                title: 'New Task'
            }
        },
    } as const;
};

export const WorkflowTaskSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
                inputStyle: 'textarea'
            },
            state: {
                type: 'string',
                enum: ['new', 'pending', 'inprogress', 'blocked', 'done', 'canceled']
            },
            eventDate: {
                type: 'string',
            },
            note: {
                type: 'string',
            },
        }
    } as const;
};

export const WorkflowDefinitionUI = (): CollectionUI[] => { return null };

const wfd = WorkflowDefinitionSchema();
const wfe = WorkflowEntrySchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
export type WorkflowEntryModel = FromSchema<typeof wfe>;
registerCollection('WorkflowDefinition', DataType.workflowdefinition, WorkflowDefinitionSchema(), WorkflowDefinitionUI(), WorkflowDefinitionRules())
