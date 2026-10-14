import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';

// A measurement a device took — temperature every 30 seconds, power draw, a level. Hubs send
// readings in batches (not one by one over the hub socket); they are kept for charts and
// totals. A reading does nothing by itself: anything urgent the hub turns into a device_event.
export const DeviceReadingSchema = () => {
  return {
    type: 'object',
    // Many, small, read by time: a MongoDB time-series collection. The time is when the reading
    // was taken (createdate is set to it), one series per device and metric (metadata).
    timeseries: true,
    properties: {
      device: { type: 'string', notes: 'device_config name.' },
      deviceKind: { type: 'string' },
      metric: { type: 'string', notes: 'What was measured (temperature, humidity, power, level, …).' },
      value: { type: 'number' },
      unit: { type: 'string' },
      hub: { type: 'string' },
      endpoint: { type: 'string' },
      zone: { type: 'string' },
      scopePath: { type: 'string' },
      takenAt: { type: 'string', format: 'date-time' },
    },
    required: ['device', 'metric', 'value'],
  } as const;
};

const drs = DeviceReadingSchema();
export type DeviceReadingModel = FromSchema<typeof drs>;

registerCollection('Device Reading', DataType.device_reading, DeviceReadingSchema());
