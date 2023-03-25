import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../defaultschema';
import { DataType, FieldType, TaskStatus } from '../types';
import { CollectionRule } from './collection-rule';
import { CollectionUI } from './collection-ui';

export const TaskSchema = () => {
    return {
        type: 'object',
        properties: {
            workflowId: {
                type: 'string',
                readOnly: true,
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
                enum: Object.values(TaskStatus)
            },
            name: {
                type: 'string',
            },
            description: {
                type: 'string',
                inputStyle: 'textarea'
            },
            stageId: {
                title: 'Stage',
                type: 'number',
                disabled: true,
            },
            note: {
                type: 'string',
                inputStyle: 'textarea'
            },
            resourceType: {
                type: 'string',
                disabled: true
            },
            resourceId: {
                type: 'string',
                disabled: true
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
                    label: 'username',
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
                {
                    operation: 'setProperty',
                    targetField: '/properties/assignTo/dataSource/label',
                    value: 'name',
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
        {
            name: 'Actor Type',
            action: [
                {
                    operation: 'setProperty',
                    targetField: '/properties/assignTo/dataSource/label',
                    value: 'username',
                },
            ],
            condition: {
                type: 'and',
                param: [
                    {
                        value: 'user',
                        field1: '/properties/assignType',
                        operation: 'equal',
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