import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';
import { FileInfoSchema } from '../file-info';

/**
 * Something the business owns and keeps using: a machine, an oven, a vehicle, a laptop.
 * Maintenance and repairs are workflow items owned by the asset; while a repair is open
 * the server shows it down. Book value and depreciation to date are computed on read.
 */
export const AssetSchema = () => ({
  type: 'object',
  properties: {
    name: { type: 'string', group: 'name' },
    assetTag: { type: 'string', group: 'name' },
    kind: {
      type: 'string',
      group: 'name',
      'x-control': ControlType.selectSingle,
      dataSource: { source: 'json', json: [] },
      description: 'Options the owner sets up: machine, vehicle, computer, furniture…',
    },
    make: { type: 'string', group: 'identity' },
    model: { type: 'string', group: 'identity' },
    serialNumber: { type: 'string', group: 'identity' },
    ...BusinessLocationField(),
    servicePointName: { type: 'string', description: 'The space it sits in (service_point name)' },
    assignedTo: {
      type: 'object',
      description: 'The person holding it, when issued',
      properties: {
        datatype: { type: 'string', enum: ['bm_employee', 'user'] },
        id: { type: 'string' },
        name: { type: 'string' },
      },
    },
    status: { type: 'string', enum: ['in_service', 'down', 'in_repair', 'out_of_service', 'returned', 'disposed'], default: 'in_service' },
    purchase: {
      type: 'object',
      properties: {
        vendorId: { type: 'string' },
        vendorName: { type: 'string' },
        purchaseOrderId: { type: 'string' },
        billId: { type: 'string' },
        date: { type: 'string', format: 'date' },
        cost: { type: 'number', default: 0 },
      },
    },
    depreciation: {
      type: 'object',
      properties: {
        method: { type: 'string', enum: ['straight_line', 'none'], default: 'straight_line' },
        usefulLifeMonths: { type: 'number', default: 60 },
        salvageValue: { type: 'number', default: 0 },
        startDate: { type: 'string', format: 'date' },
      },
    },
    servicedBy: {
      type: 'object',
      description: 'Who repairs and services it',
      properties: {
        kind: { type: 'string', enum: ['in_house', 'vendor'], default: 'in_house' },
        vendorId: { type: 'string' },
        name: { type: 'string' },
      },
    },
    warrantyContractId: { type: 'string', description: 'The warranty (bm_contract)' },
    disposal: {
      type: 'object',
      readOnly: true,
      properties: {
        date: { type: 'string', format: 'date' },
        amount: { type: 'number' },
        reason: { type: 'string' },
      },
    },
    images: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
    files: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
    notes: { type: 'string', 'x-control-variant': 'textarea' },
  },
  required: ['name'],
} as const);

const a = AssetSchema();
export type AssetModel = FromSchema<typeof a>;
registerCollection('Asset', DataType.bm_asset, AssetSchema());
