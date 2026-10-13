import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// Something a device reported, kept as it happened: a door contact opened, a beam
// broke, a gas detector alarmed, a sensor went offline. Recorded for every device
// placed in a zone (device_config.zone); the event does nothing by itself.
export const DeviceEventSchema = () => {
  return {
    type: 'object',
    // Append-only and read by time: a MongoDB time-series collection (timeField createdate,
    // one series per device in metadata.device).
    timeseries: true,
    properties: {
      type: { type: 'string', notes: 'What happened, as the device reported it (open, closed, motion, beam-broken, gas-alarm, reading, offline, …).' },
      level: { type: 'string', enum: ['info', 'warning', 'alarm'], default: 'info' },
      device: { type: 'string', notes: 'device_config name.' },
      deviceKind: { type: 'string' },
      hub: { type: 'string', notes: 'device_hub name.' },
      endpoint: { type: 'string' },
      zone: { type: 'string', notes: 'access_zone name the device is in.' },
      scopePath: { type: 'string' },
      data: { type: 'object', additionalProperties: true, notes: 'What the device sent with it (state, value, unit, battery, …).' },
      occurredAt: { type: 'string', format: 'date-time' },
    },
    required: ['type', 'occurredAt'],
  } as const;
};

const des = DeviceEventSchema();
export type DeviceEventModel = FromSchema<typeof des>;

registerCollection('Device Event', DataType.device_event, DeviceEventSchema());
