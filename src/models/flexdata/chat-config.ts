import { FileInfoSchema } from '../file-info';
import { ControlType , DataType} from '../../types';
import { FromSchema } from 'json-schema-to-ts';

export const chatConfigSchema = {
    type: 'object',
    hideLabel: true,
    properties: {
        description: {
            type: 'string',
        },
        defaultPath: {
            type: 'string',
            dataSource: {
                source: 'json',
                json: [{ label: 'Welcome', value: '/' }, { label: 'Form', value: '/register' }, { label: 'Chat', value: '/chat' }, { label: 'Chat with AI', value: '/chat-ai' }, { label: 'Chat with Agent', value: '/chat-agent' }]
            },
        },
        logo: {
            ...FileInfoSchema(),
            collapsible: true,
        },
        headerContent: {
            type: 'string',
            collapsible: true,
            'x-control': ControlType.richtext,
        },
        aiFlow: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
                source: 'collection',
                collection: DataType.mintflow,
                label: 'name',
                value: 'name',
            },
            displayStyle: 'outlined',
        },
        chatBubblePosition: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
                source: 'json',
                json: ['left', 'right'],
            },
            group: 'bubble',
        },
        status: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
                source: 'json',
                json: ['online', 'offline'],
            },
            group: 'bubble',
        },
        chatOpeners: {
            type: 'array',
            collapsible: true,
            items: {
                type: 'string',
                'x-control-variant': 'textarea',
                displayStyle: 'outlined',
                rows: 3,
            },
        },
        offline: {
            type: 'object',
            collapsible: true,
            properties: {
                showForm: {
                    type: 'boolean',
                    default: true,
                },
                message: {
                    type: 'string',
                    'x-control-variant': 'textarea',
                    row: 3,
                },
            },
        },
        allowAttachments: {
            type: 'boolean',
            default: true,
            group: 'allow',
        },
        allowEmojis: {
            type: 'boolean',
            default: true,
            group: 'allow',
        },
        showAgents: {
            type: 'boolean',
            group: 'randomize',
        },
        registrationRequired: {
            type: 'boolean',
            default: false,
            group: 'randomize',
        },
        registrationFields: {
            type: 'object',
            collapsible: true,
            layout: 'horizontal',
            properties: {
                name: {
                    type: 'boolean',
                    default: false,
                },
                email: {
                    type: 'boolean',
                    default: false,
                },
                phone: {
                    type: 'boolean',
                    default: false,
                },
                comments: {
                    type: 'boolean',
                    default: false,
                },
            },
            rules: [{ operation: 'isFalsy', valueA: '{{registrationRequired}}', action: 'hide' }],
        },
        availability: {
            type: 'object',
            collapsible: true,
            properties: {
                allTimes: {
                    type: 'boolean',
                    title: 'Chat available 24/7',
                    default: true,
                },
                workDays: {
                    type: 'array',
                    'x-control': ControlType.selectMany,
                    'x-control-variant': 'chip',
                    items: {
                        type: 'string',
                    },
                    dataSource: {
                        source: 'json',
                        json: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                    },
                },
                officeHours: {
                    type: 'object',
                    collapsible: true,
                    'x-control-variant': 'time',
                    'x-control': ControlType.dateRange,
                    properties: {
                        startTime: {
                            type: 'string',
                            'x-control-variant': 'time',
                            'x-control': ControlType.date,
                            group: 'time',
                        },
                        endTime: {
                            type: 'string',
                            'x-control-variant': 'time',
                            'x-control': ControlType.date,
                            group: 'time',
                        },
                    },
                },
                blockedTime: {
                    type: 'array',
                    collapsible: true,
                    items: {
                        type: 'object',
                        'x-control-variant': 'time',
                        'x-control': ControlType.dateRange,
                        properties: {
                            startTime: {
                                type: 'string',
                                'x-control-variant': 'time',
                                'x-control': ControlType.date,
                                group: 'btime',
                            },
                            endTime: {
                                type: 'string',
                                'x-control-variant': 'time',
                                'x-control': ControlType.date,
                                group: 'btime',
                            },
                        },
                    },
                },
            },
        },
        agents: {
            type: 'array',
            items: {
                type: 'object',
                collapsible: true,
                properties: {
                    user: {
                        type: 'string',
                        'x-control': ControlType.selectMany,
                        dataSource: {
                            source: 'collection',
                            collection: DataType.user,
                            label: ['email', 'firstName', 'lastName'],
                            value: 'email',
                        },
                    },
                    avatar: FileInfoSchema(),
                    screenName: {
                        type: 'string',
                    },
                    tagLine: {
                        type: 'string',
                    },
                },
            },
        },
    },
} as const;

export type ChatConfigModel = FromSchema<typeof chatConfigSchema>;