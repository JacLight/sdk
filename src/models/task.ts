import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType } from '../types';
import { CollectionRule, CollectionUI } from './collection';

export const TaskSchema = () => {
    return {
        type: 'object',
        properties: {
            workflowId: {
                type: 'string',
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
                enum: ['new', 'pending', 'inprogress', 'blocked', 'done', 'canceled']
            },
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
                inputStyle: 'textarea'
            },
            stageId: {
                type: 'number',
                disabled: true,
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


export const TaskRules = (): CollectionRule[] => {
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

export const TaskUI = (): CollectionUI[] => { return null };

const ts = TaskSchema();
export type TaskModel = FromSchema<typeof ts>;
registerCollection('Task', DataType.task, TaskSchema(), TaskUI(), TaskRules())