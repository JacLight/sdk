import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

// One DeviceConfig record per physical or virtual device. The `connection`
// field is the key axis:
//
//   direct  — server reaches the device directly (cloud-to-cloud SDK like
//             Twilio SMS, Stripe Terminal cloud, network-attached printer).
//             Used when the customer's UI runs on the same machine the
//             device is plugged into (PC POS), OR when no on-prem hardware
//             is required.
//
//   remote  — device is plugged into a `device_hub` (Raspberry Pi / box).
//             Server enqueues the command; hub picks it up over WebSocket.
//             Used when the customer's UI is a tablet / mobile that can't
//             talk to USB hardware directly.
//
// `adapterName` picks the server-side adapter that knows the protocol:
//   'sms-pager'      — SMS via Twilio (direct)
//   'stripe-terminal' — Stripe in-person reader (direct, future)
//   'esc-pos-network' — network ESC/POS printer (direct, future)
//   'remote-hub'     — proxy through a hub agent (remote)
//
// `config` is adapter-specific opaque settings (Twilio fromNumber, network
// IP for a printer, hub+endpoint refs for remote, etc.).
export const DeviceConfigSchema = () => {
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

      kind: {
        type: 'string',
        enum: [
          'printer',       // ESC/POS receipt / kitchen / label printer
          'scanner',       // barcode / QR / RFID reader
          'drawer',        // cash drawer (often piggybacks on a printer)
          'pager-base',    // RF pager transmitter (LRS, JTECH)
          'pager-sms',     // SMS-as-pager (no hardware)
          'kds',           // kitchen display system
          'pole-display',  // customer-facing pole / line display
          'card-terminal', // payment terminal (Stripe Terminal, Verifone)
          'scale',         // weight scale
          'nfc-reader',    // NFC/RFID card reader for quick staff login + card write/erase
        ],
        group: 'identity',
      },
      capabilities: {
        type: 'array',
        items: {
          type: 'string',
          enum: ['page', 'print', 'drawer', 'charge', 'weigh', 'display', 'kds', 'card-read', 'card-write', 'card-erase'],
        },
        group: 'identity',
      },

      connection: {
        type: 'string',
        enum: ['direct', 'remote'],
        default: 'direct',
        description: 'direct = server reaches the device. remote = hub agent on a Pi proxies the call.',
        group: 'connection',
      },
      adapterName: {
        type: 'string',
        description: 'Identifier of the server-side adapter (sms-pager, stripe-terminal, remote-hub, ...). For connection=remote this is always remote-hub.',
        group: 'connection',
      },
      // For connection=remote: the hub that owns this device. References
      // device_hub.name. Server validates the hub exists at write time.
      hubName: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.device_hub,
          value: 'name',
          label: 'displayName',
          filter: { 'data.businessLocationId': '{{businessLocationId}}' },
        },
        group: 'connection',
      },
      // For connection=remote: the endpoint name on the hub (e.g. the USB
      // path or the hub-agent's local label for this device).
      endpointName: { type: 'string', group: 'connection' },

      // Adapter-specific opaque blob. UI editor renders generic key/value.
      config: {
        type: 'object',
        additionalProperties: true,
        group: 'connection',
      },

      // State written by server when the device is invoked.
      status: {
        type: 'string',
        enum: ['active', 'inactive', 'error'],
        default: 'active',
        group: 'state',
      },
      lastError: { type: 'string', group: 'state' },
      lastUsedAt: { type: 'string', format: 'date-time', group: 'state' },
      isActive: { type: 'boolean', default: true, group: 'flags' },

      // Optional: scope which station/service-point this device serves.
      // Used by the dispatcher to pick "the printer for Bar 1" vs "the
      // printer for Kitchen". Leave blank for org-wide devices (single
      // receipt printer in a small shop).
      servicePointName: { type: 'string', group: 'scope' },

      // Auto-discovery flags. Set when the hub agent reported this device
      // on its `hello` message — server upserts a device_config record so
      // operators don't have to type endpoint names by hand. Manual creates
      // leave both fields blank/false.
      discovered: { type: 'boolean', default: false, group: 'discovery' },
      discoveredAt: { type: 'string', format: 'date-time', group: 'discovery' },
    },
    required: ['name', 'kind', 'connection', 'adapterName'],
  } as const;
};

const cs = DeviceConfigSchema();
export type DeviceConfigModel = FromSchema<typeof cs>;
export type DeviceConnection = 'direct' | 'remote';

registerCollection('DeviceConfig', DataType.device_config, DeviceConfigSchema());
