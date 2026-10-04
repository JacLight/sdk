import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

// An input device: anything that calls the server directly to ask for access
// — card reader, fingerprint reader, QR scanner, keypad, Android terminal,
// computer, plate camera, staff handheld. It authenticates with its own key
// and sends what it read; the server opens the granting device(s) in
// `triggers` if the person is allowed. With more than one trigger the request
// names which (handheld, elevator panel), and only one from this list is accepted.
export const AccessDeviceSchema = () => {
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
      title: { type: 'string', group: 'identity' },
      kind: {
        type: 'string',
        enum: ['card-reader', 'fingerprint', 'qr-scanner', 'keypad', 'terminal', 'computer', 'plate-camera', 'handheld'],
        group: 'identity',
      },
      methods: {
        type: 'array',
        items: { type: 'string', enum: ['card', 'pin', 'qr', 'door_qr', 'mobile', 'plate', 'fingerprint', 'face'] },
        description: 'What this device can read.',
        group: 'identity',
      },
      triggers: {
        type: 'array',
        items: { type: 'string' },
        description: 'Granting hub devices this input can open.',
        'x-control': ControlType.selectMany,
        dataSource: { source: 'collection', collection: DataType.device_config, value: 'name', label: ['displayName', 'name'] },
        group: 'triggers',
      },
      apiKey: {
        type: 'string',
        readOnly: true,
        hidden: true,
        description: 'sha256 of the device key. The clear key is shown once when generated.',
        group: 'auth',
      },
      status: { type: 'string', enum: ['active', 'disabled'], default: 'active', group: 'state' },
      lastSeenAt: { type: 'string', format: 'date-time', disabled: true, group: 'state' },
    },
    required: ['name', 'kind'],
  } as const;
};

const ads = AccessDeviceSchema();
export type AccessDeviceModel = FromSchema<typeof ads>;

registerCollection('Access Device', DataType.access_device, AccessDeviceSchema());
