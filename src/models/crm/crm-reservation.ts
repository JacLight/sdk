import { FromSchema } from 'json-schema-to-ts';
import { registerCollection, registerDefaultData } from '../../defaultschema';
import { CollectionRule } from '../collection-rule';
import { CollectionUI } from '../collection-ui'; import { DataType, FieldType } from '../../types';
import { FileInfoSchema } from '../fileinfo';

export const ReservationSchema = () => {
    return {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                pattern: '^[a-zA-Z_\\-0-9]*$',
                unique: true,
            },
            description: {
                type: 'string',
            },
            scheduleType: {
                type: 'string',
                enum: ['auto', 'manual']
            },
            autoSchedule: {
                type: 'object',
                properties: {
                    interval: {
                        type: 'number'
                    },
                    minDuration: {
                        type: 'number',
                    },
                    maxDuration: {
                        type: 'number',
                    },
                    break: {
                        type: 'number'
                    },
                    startTime: {
                        type: 'string',
                        format: 'date-time'
                    },
                    endTime: {
                        type: 'string',
                        format: 'date-time'
                    },
                    days: {
                        type: 'array',
                        items: {
                            type: 'string',
                        }
                    }
                }
            },
            checkInBy: {
                type: 'object',
                properties: {
                    value: {
                        type: 'string',
                    },
                    unit: {
                        type: 'string',
                        enum: ['days', 'hours', 'minutes', 'months']
                    }
                }
            },
            reservationOpen: {
                type: 'object',
                properties: {
                    value: {
                        type: 'string',
                    },
                    unit: {
                        type: 'string',
                        enum: ['days', 'hours', 'minutes', 'months']
                    }
                }
            },
            reservationClose: {
                type: 'object',
                properties: {
                    value: {
                        type: 'string',
                    },
                    unit: {
                        type: 'string',
                        enum: ['days', 'hours', 'minutes', 'months']
                    }
                }
            },
            manualSchedules: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        startTime: {
                            type: 'string',
                            format: 'date-time'
                        },
                        endTime: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            },
            blockedTime: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        startTime: {
                            type: 'string',
                            format: 'date-time'
                        },
                        endTime: {
                            type: 'string',
                            format: 'date-time'
                        }
                    }
                }
            },
            hosts: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        picture: FileInfoSchema()
                    }
                }
            },
            venues: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        description: {
                            type: 'string',
                        },
                        picture: FileInfoSchema()
                    }
                }
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
        },
        required: ['name']
    } as const;
};

const cs = ReservationSchema();
export type ReservationSModel = FromSchema<typeof cs>;

export const ReservationUI = (): CollectionUI[] => { return null };
export const ReservationRules = (): CollectionRule[] => { return null };
registerCollection('Reservation ', DataType.reservation, ReservationSchema(), ReservationUI(), ReservationRules(), true)


//create a reservation workflow definition with 8 stages - intake, confirmed, check-in, waiting, completed, canceled, reschedule, error

const genDefaultData = () => {
    return {
        tasks: [
            { status: 'new', name: 'Reservation', description: 'Workflow for reservation', stageId: 0 },
        ],
        stages: [
            { id: 0, type: 'start', name: 'intake', assignTo: 'reservation-host' },
            { id: 1, type: 'intermediate', name: 'confirmed' },
            { id: 2, type: 'intermediate', name: 'checkedIn' },
            { id: 3, type: 'intermediate', name: 'waiting' },
            { id: 4, type: 'intermediate', name: 'completed' },
            { id: 5, type: 'end', name: 'canceled' },
            { id: 6, type: 'end', name: 'reschedule' },
            { id: 7, type: 'end', name: 'error' }
        ]
    }
};


registerDefaultData(DataType.reservation, genDefaultData)
