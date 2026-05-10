import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { FileInfoSchema } from '../file-info';
import { BusinessLocationField } from '../_location-fields';

// A ServicePoint is a node in the spatial hierarchy of a BusinessLocation.
// Recursive via parentName: a section is a ServicePoint with no parent (or a
// floor parent), a table is a ServicePoint whose parentName points at a
// section, a seat is a ServicePoint whose parentName points at a table, etc.
// kind is a free-form label (section, floor, room, table, seat, chair, ...).
export const ServicePointSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        unique: true,
        transform: 'uri',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        group: 'name',
      },
      displayName: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      kind: {
        type: 'string',
        group: 'name',
      },
      ...BusinessLocationField(),
      parentName: {
        type: 'string',
        'x-control': ControlType.selectMany,
        dataSource: {
          source: 'collection',
          collection: DataType.service_point,
          value: 'name',
          label: 'displayName',
          filter: { 'data.businessLocationId': '{{businessLocationId}}' },
        },
        group: 'hierarchy',
      },
      level: { type: 'number', group: 'hierarchy' },
      sortOrder: { type: 'number', group: 'hierarchy' },
      capacity: { type: 'number', group: 'capacity' },
      minCapacity: { type: 'number', group: 'capacity' },
      maxCapacity: { type: 'number', group: 'capacity' },
      shape: { type: 'string', default: 'square', group: 'geometry' },
      x: { type: 'number', group: 'geometry' },
      y: { type: 'number', group: 'geometry' },
      width: { type: 'number', group: 'geometry' },
      height: { type: 'number', group: 'geometry' },
      rotation: { type: 'number', default: 0, group: 'geometry' },
      color: { type: 'string', 'x-control': ControlType.color, group: 'geometry' },
      backgroundImage: { type: 'string', group: 'geometry' },
      bookable: { type: 'boolean', default: true, group: 'flags' },
      isActive: { type: 'boolean', default: true, group: 'flags' },
      status: {
        type: 'string',
        enum: ['available', 'occupied', 'reserved', 'dirty', 'blocked', 'closed'],
        default: 'available',
        group: 'state',
      },
      currentReservationId: { type: 'string', group: 'state' },
      // FK to the active sf_order tab when the SP is held by POS (tab open
      // at this seat). Set/cleared atomically by storefront's
      // assignServicePointToTab / releaseServicePointFromTab.
      currentTabId: { type: 'string', group: 'state' },
      currentServerId: { type: 'string', group: 'state' },
      currentPartySize: { type: 'number', group: 'state' },
      // Last status-change audit (manager flips, busser clears).
      lastStatusChangeAt: { type: 'string', format: 'date-time', group: 'state' },
      lastStatusReason: { type: 'string', group: 'state' },
      seatedAt: { type: 'string', format: 'date-time', group: 'state' },
      estimatedEndTime: { type: 'string', format: 'date-time', group: 'state' },
      features: {
        type: 'array',
        collapsible: true,
        items: { type: 'string' },
      },
      images: {
        type: 'array',
        'x-control': ControlType.file,
        items: FileInfoSchema(),
      },
    },
    required: ['name'],
  } as const;
};

const cs = ServicePointSchema();
export type ServicePointModel = FromSchema<typeof cs>;
export type ServicePointStatus = 'available' | 'occupied' | 'reserved' | 'dirty' | 'blocked' | 'closed';

registerCollection('ServicePoint', DataType.service_point, ServicePointSchema());
