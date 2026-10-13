import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// What devices do when they report something, done the moment the event arrives. A policy
// stands on its own; a device group points at one (device_group.policy) and so does a single
// device (device_config.policy). Each rule matches one event — its type, its level, one value
// it carries — and runs its actions in order. Anything that needs more than one event
// ("above 8°C for 5 minutes") is not a rule here.
export const DevicePolicyActionSchema = () => ({
  type: 'object',
  properties: {
    type: { type: 'string', enum: ['command', 'alert', 'task', 'move-task', 'automation'] },
    // command — drive devices: this one, every device in its zone, one group, or one named device.
    target: { type: 'string', enum: ['device', 'zone', 'group', 'named'], default: 'zone' },
    group: { type: 'string', 'x-control': ControlType.selectMany, maxItems: 1, dataSource: { source: 'collection', collection: DataType.device_group, value: 'name', label: ['title', 'name'] } },
    device: { type: 'string', 'x-control': ControlType.selectMany, maxItems: 1, dataSource: { source: 'collection', collection: DataType.device_config, value: 'name', label: ['displayName', 'name'] } },
    kinds: { type: 'array', items: { type: 'string' }, notes: 'Only devices of these kinds among the target (e.g. siren). Empty = every device in the target.' },
    capability: { type: 'string', notes: 'The command sent (siren-on, unlock, hold-open, …).' },
    // alert — an in-app notice (and its email/SMS per the person's settings).
    to: { type: 'array', items: { type: 'string' }, notes: 'Email addresses of the people told.', 'x-control': ControlType.selectMany, dataSource: { source: 'collection', collection: DataType.user, value: 'email', label: ['email', 'firstName', 'lastName'] } },
    message: { type: 'string', notes: '{{device}}, {{zone}}, {{event}}, {{value}} are filled in.' },
    // task / move-task — a workflow task owned by the device; the event is its triggerId.
    workflowId: { type: 'string', 'x-control': ControlType.selectMany, maxItems: 1, dataSource: { source: 'collection', collection: DataType.workflow_definition, value: 'sk', label: ['title', 'name'] } },
    stage: { type: 'string', notes: 'task: the stage to start in (empty = the first). move-task: the stage the device’s open task moves to.' },
    title: { type: 'string', notes: 'task: what the task says. Same fill-ins as message.' },
    // automation — hand the event to an automation for anything more.
    automationId: { type: 'string', 'x-control': ControlType.selectMany, maxItems: 1, dataSource: { source: 'collection', collection: DataType.automation, value: 'sk', label: ['name'] } },
  },
  required: ['type'],
} as const);

export const DevicePolicySchema = () => {
  return {
    type: 'object',
    properties: {
      name: { type: 'string', unique: true, transform: 'uri', pattern: '^[a-zA-Z_\\-0-9]*$', group: 'name' },
      title: { type: 'string', group: 'name' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      rules: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            on: { type: 'array', items: { type: 'string' }, notes: 'Event types this rule answers (gas-alarm, open, …). Empty = every event.' },
            level: { type: 'string', enum: ['info', 'warning', 'alarm'], notes: 'Only events of this level. Empty = any level.' },
            field: { type: 'string', notes: 'A value the event carries (value, state, battery, …) to compare. Empty = no comparison.' },
            op: { type: 'string', enum: ['=', '!=', '>', '>=', '<', '<='], default: '=' },
            value: { type: 'string', notes: 'Compared as a number when both sides are numbers.' },
            do: { type: 'array', items: DevicePolicyActionSchema() },
            enabled: { type: 'boolean', default: true },
          },
        },
      },
    },
    required: ['name'],
  } as const;
};

const dps = DevicePolicySchema();
export type DevicePolicyModel = FromSchema<typeof dps>;

registerCollection('Device Policy', DataType.device_policy, DevicePolicySchema());
