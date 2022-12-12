import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';
import { TaskSchema } from './task';

export const WorkflowDefinitionSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                pattern: '^[a-zA-Z_$][a-zA-Z_$0-9]*$',
                unique: true,
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
                    value: 'sk',
                    label: 'name',
                },
            },
            endFlow: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.mintflow,
                    value: 'sk',
                    label: 'name',
                },
            },
            notificationTemplate: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.messagetemplate,
                    value: 'sk',
                    label: 'name',
                },
            },
            tasks: {
                type: 'array',
                collapsible: true,
                minItems: 1,
                items: TaskSchema()
            },
            stages: {
                type: 'array',
                collapsible: true,
                minItems: 2,
                items: WorkflowStageSchema(),
            },
        },
        required: ['name', 'stages']
    } as const;
};

export const WorkflowDefinitionRules = (): CollectionRule[] => {
    return [
        {
            name: 'Actor Type',
            action: [
                {
                    operation: 'setProperty',
                    targetField: '/properties/stages/items/properties/assignTo/dataSource/collection',
                    sourceField: '/properties/stages/items/properties/assignType',
                },
            ],
            condition: {
                type: 'and',
                param: [
                    {
                        value: true,
                        field1: '/properties/stages/items/properties/assignType',
                        operation: 'notEmpty',
                    },
                ],
            },
        },
        {
            name: 'Task Action',
            action: [
                {
                    operation: 'setProperty',
                    targetField: '/properties/tasks/items/properties/assignTo/dataSource/collection',
                    sourceField: '/properties/tasks/items/properties/assignType',
                },
            ],
            condition: {
                type: 'and',
                param: [
                    {
                        value: true,
                        field1: '/properties/tasks/items/properties/assignType',
                        operation: 'notEmpty',
                    },
                ],
            },
        },
    ]
};


export const WorkflowStageSchema = () => {
    return {
        type: 'object',
        properties: {
            id: {
                type: ['string', 'number'],
                fieldType: FieldType.uuid,
                readOnly: true
            },
            state: {
                type: 'string',
                enum: ['start', 'intermediate', 'end']
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
            flow: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.mintflow,
                    value: 'sk',
                    label: 'name',
                },
            },
            assignType: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'json',
                    json: [{ label: 'Group', value: 'usergroup' }, { label: 'Role', value: 'userrole' }, { label: 'User', value: 'user' }]
                },
            },
            assignTo: {
                type: 'string',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.usergroup,
                    value: 'sk',
                    label: 'name',
                },
            },
            items: {
                type: 'array',
                collapsible: true,
                hidden: true,
            },
        },
    } as const;
};

export const WorkflowSubSchema = () => {
    return {
        type: 'object',
        properties: {
            workflowId: {
                type: 'string',
                title: 'Workflow',
                fieldType: FieldType.selectionmultiple,
                dataSource: {
                    source: 'collection',
                    collection: DataType.workflowdefinition,
                    value: 'sk',
                    label: 'name',
                },
            },
            status: {
                type: 'string',
                disabled: true,
                enum: ['new', 'pending', 'inprogress', 'blocked', 'done', 'canceled'],
                default: 'new'
            },
            note: {
                type: 'string'
            },
            tasks: {
                type: 'array',
                items: TaskSchema(),
                inputStyle: 'table',
                readOnly: true,
            },
        },
    } as const;
};

export const WorkflowStageRules = (): CollectionRule[] => {
    return [
        {
            name: 'Actor Type',
            action: [
                {
                    operation: 'setProperty',
                    targetField: '/properties/assignTo/dataSource/collection',
                    sourceField: '/properties/assignType',
                },
            ],
            condition: {
                type: 'and',
                param: [
                    {
                        value: true,
                        field1: '/properties/assignType',
                        operation: 'notEmpty',
                    },
                ],
            },
        },
    ]
};

const genDefaultData = () => {
    return {
        tasks: [
            { status: 'new', name: 'Check Stock', description: 'Check if item is in stock', stageId: 0 },
            { status: 'new', name: 'Prepare Shipping', description: 'Start shipping process', stageId: 0 },
            { status: 'new', name: 'Process Billing', description: 'Billing needs to take place also', stageId: 0 },
        ],
        stages: [
            { id: 0, state: 'start', name: 'To Do' },
            { id: 1, state: 'end', name: 'Done' }
        ]
    }
};

export const WorkflowDefinitionUI = (): CollectionUI[] => { return null };

const wfd = WorkflowDefinitionSchema();
const wfe = WorkflowSubSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
export type WorkflowSubModel = FromSchema<typeof wfe>;
registerCollection('WorkflowDefinition', DataType.workflowdefinition, WorkflowDefinitionSchema(), WorkflowDefinitionUI(), WorkflowDefinitionRules())
registerDefaultData(DataType.workflowdefinition, genDefaultData)