import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

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
                items: WorkflowTaskSchema()
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
                    property: 'collection',
                    targetField: '/properties/stages/items/properties/assignTo/dataSource',
                    sourceField: '/properties/stages/items/properties/assignType',
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
                        field: '/properties/stages/items/properties/assignType',
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
                    property: 'collection',
                    targetField: '/properties/tasks/items/properties/assignTo/dataSource',
                    sourceField: '/properties/tasks/items/properties/assignType',
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
                        field: '/properties/tasks/items/properties/assignType',
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
            workflow: {
                type: 'string',
            },
            status: {
                type: 'string',
            },
            tasks: {
                type: 'array',
                items: WorkflowTaskSchema()
            },
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
                inputStyle: 'textarea'
            },
            resourceType: {
                type: 'string',
                hidden: true
            },
            resourceId: {
                type: 'string',
                hidden: true
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
        }
    } as const;
};


export const WorkflowStageRules = (): CollectionRule[] => {
    return [
        {
            name: 'Actor Type',
            action: [
                {
                    operation: 'setProperty',
                    property: 'collection',
                    targetField: '/properties/assignTo/dataSource',
                    sourceField: '/properties/assignType',
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
                        field: '/properties/assignType',
                        operation: 'notEmpty',
                    },
                ],
            },
        },
    ]
};

const defaultData = {
    name: 'newworkflow',
    tasks: [
        { name: 'Review', description: 'Review new data' },
    ],
    stages: [
        { state: 'start', name: 'To Do' },
        { state: 'end', name: 'Done' }
    ]
};

export const WorkflowDefinitionUI = (): CollectionUI[] => { return null };

const wfd = WorkflowDefinitionSchema();
const wfe = WorkflowSubSchema();
export type WorkflowDefinitionModel = FromSchema<typeof wfd>;
export type WorkflowSubModel = FromSchema<typeof wfe>;
registerCollection('WorkflowDefinition', DataType.workflowdefinition, WorkflowDefinitionSchema(), WorkflowDefinitionUI(), WorkflowDefinitionRules())
registerDefaultData(DataType.workflowdefinition, defaultData)