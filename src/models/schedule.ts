import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../default-schema';
import { DataType, ControlType } from '../types';

const scheduleOptions = [{ label: 'Publish/Send', value: 'publish' }, { label: 'Unpublish', value: 'unpublish' }, { label: 'Delete', value: 'delete' }, { label: 'Run', value: 'run' }, { label: 'Stop', value: 'stop' }, { label: 'Start', value: 'start' }, { label: 'Update Status', value: 'update-status' }, { label: 'Update State', value: 'update-state' }];

export const ScheduleSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['uri', 'lowercase', 'random-string::8'],
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      type: {
        type: 'string',
        enum: ['simple', 'cron'],
        group: 'status',
        default: 'simple'
      },
      targets: {
        type: 'array',
        collapsible: 'close',
        title: 'Selections',
        'x-control': ControlType.collection,
        displayStyle: 'table',
        'x-control-variant': 'picker',
        dataSource: {
          source: 'collection',
          collection: DataType.post,
        },
        items: {
          type: 'object',
          properties: {
            datatype: {
              type: 'string',
            },
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
          },
        },
      },
      status: {
        type: 'string',
        enum: ['new', 'active', 'stop', 'error', 'done'],
        default: 'new',
        group: 'status',
      },
      start: {
        type: 'object',
        collapsible: 'open',
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
          },
          action: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'json',
              json: [...scheduleOptions],
            },
            group: 'action',
          },
          actionArgs: {
            type: 'string',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            group: 'action',
          },
        },
        watchedPaths: ['type'],
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'simple', action: 'hide' },
        ]
      },
      end: {
        type: 'object',
        collapsible: true,
        properties: {
          date: {
            type: 'string',
            format: 'date-time',
          },
          action: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'json',
              json: [...scheduleOptions],
            },
            group: 'action',
          },
          actionArgs: {
            type: 'string',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            group: 'action',
          },
        },
        watchedPaths: ['type'],
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'simple', action: 'hide' },
        ]
      },
      cron: {
        type: 'object',
        collapsible: true,
        properties: {
          value: {
            type: 'string',
            'x-control': ControlType.cron,
          },
          action: {
            type: 'string',
            'x-control': ControlType.selectMany,
            dataSource: {
              source: 'json',
              json: [...scheduleOptions],
            },
            group: 'action',
          },
          actionArgs: {
            type: 'string',
            'x-control': ControlType.selectMany,
            'x-control-variant': 'chip',
            group: 'action',
          },
        },
        watchedPaths: ['type'],
        rules: [
          { operation: 'notEqual', valueA: '{{type}}', valueB: 'cron', action: 'hide' },
        ]
      },
      lastRun: {
        type: 'string',
        format: 'date-time',
        readOnly: true,
        group: 'run',
      },
      nextRun: {
        type: 'string',
        format: 'date-time',
        group: 'run',
        readOnly: true,
      },
    },
  } as const;
};

const dd = ScheduleSchema();
export type ScheduleModel = FromSchema<typeof dd>;


registerCollection(
  'Schedule',
  DataType.schedule,
  ScheduleSchema(),
  null,
  null,
  false,
  false,
);
