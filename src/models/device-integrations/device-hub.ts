import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

// A DeviceHub is an on-site controller that manages local hardware (USB
// printer, scanner, drawer, etc.) on behalf of cloud-connected UIs (tablets,
// kiosks, web). Typically a Raspberry Pi running the hub agent.
//
// Each hub authenticates with the cloud via `apiKey` (hashed at rest), holds
// a long-lived WebSocket back to appengine, and exposes the devices plugged
// into it as `device_config` records (separate model) with
// `connection: 'remote'` pointing at this hub by name.
//
// The actual transport (WS / agent code / heartbeat semantics) is not yet
// shipped — this is the data model only so device_config records can name a
// hub at config time.
export const DeviceHubSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        transform: 'uri',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        group: 'identity',
      },
      displayName: { type: 'string', group: 'identity' },
      description: { type: 'string', 'x-control-variant': 'textarea' },
      ...BusinessLocationField(),
      apiKey: {
        type: 'string',
        description: 'Hashed API key the hub agent uses to authenticate. Generated server-side; never echoed back in clear.',
        group: 'auth',
      },
      // Operational state — written by the server when the hub connects /
      // heartbeats / disconnects. UI should render these as read-only.
      status: {
        type: 'string',
        enum: ['provisioned', 'online', 'offline', 'error'],
        default: 'provisioned',
        group: 'state',
      },
      version: { type: 'string', group: 'state' },
      lastSeen: { type: 'string', format: 'date-time', group: 'state' },
      lastError: { type: 'string', group: 'state' },
      ipAddress: { type: 'string', group: 'state' },
      isActive: { type: 'boolean', default: true, group: 'flags' },
    },
    required: ['name'],
  } as const;
};

const hs = DeviceHubSchema();
export type DeviceHubModel = FromSchema<typeof hs>;
export type DeviceHubStatus = 'provisioned' | 'online' | 'offline' | 'error';

registerCollection('DeviceHub', DataType.device_hub, DeviceHubSchema());
