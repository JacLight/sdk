import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';
import { FileInfoSchema } from '../file-info';

/**
 * Purchase order: what the business orders from a vendor. Deliveries are stock
 * intakes (sf_inventory_intake.purchaseOrderId) that fill its lines; receiving
 * makes the PO's bill (bm_bill.purchaseOrderId). A line is stock (a product SKU),
 * an asset (each unit received becomes a bm_asset) or an expense (bill only).
 * `received`, `returned`, `billed` and the status after approval are kept by the server.
 */
export const PurchaseOrderLineSchema = () => ({
  type: 'object',
  properties: {
    id: { type: 'string' },
    kind: { type: 'string', enum: ['stock', 'asset', 'expense'], default: 'stock' },
    sku: { type: 'string', description: 'kind = stock: the product SKU received into stock' },
    description: { type: 'string' },
    quantity: { type: 'number', default: 1 },
    unitCost: { type: 'number', default: 0 },
    amount: { type: 'number', readOnly: true },
    glAccountCode: { type: 'string', description: 'kind = expense: the expense account the bill line posts to' },
    assetKind: { type: 'string', description: 'kind = asset: the asset kind given to each unit received' },
    received: { type: 'number', default: 0, readOnly: true },
    returned: { type: 'number', default: 0, readOnly: true },
    billed: { type: 'number', default: 0, readOnly: true },
  },
  required: ['quantity'],
} as const);

export const PurchaseOrderSchema = () => ({
  type: 'object',
  properties: {
    name: { type: 'string', title: 'ID', readOnly: true },
    number: { type: 'string', readOnly: true, group: 'name' },
    vendorId: {
      type: 'string',
      group: 'vendor',
      'x-control': ControlType.selectMany,
      dataSource: { source: 'collection', collection: DataType.bm_vendor, value: 'name', label: 'name' },
    },
    vendorName: { type: 'string', group: 'vendor' },
    ...BusinessLocationField(),
    orderDate: { type: 'string', format: 'date', group: 'dates' },
    expectedDate: { type: 'string', format: 'date', group: 'dates' },
    status: {
      type: 'string',
      enum: ['draft', 'awaiting_approval', 'approved', 'partially_received', 'received', 'closed', 'cancelled'],
      default: 'draft',
      readOnly: true,
    },
    lines: { type: 'array', items: PurchaseOrderLineSchema() },
    contractId: { type: 'string', description: 'The supplier agreement this order buys under (bm_contract)' },
    currency: { type: 'string', default: 'USD' },
    subtotal: { type: 'number', default: 0, readOnly: true },
    taxTotal: { type: 'number', default: 0 },
    total: { type: 'number', default: 0, readOnly: true },
    approvedBy: { type: 'string', readOnly: true },
    approvedAt: { type: 'string', format: 'date-time', readOnly: true },
    cancelReason: { type: 'string', readOnly: true },
    attachments: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
    notes: { type: 'string', 'x-control-variant': 'textarea' },
  },
  required: ['vendorId', 'businessLocationId'],
} as const);

const po = PurchaseOrderSchema();
export type PurchaseOrderModel = FromSchema<typeof po>;
registerCollection('Purchase Order', DataType.bm_purchase_order, PurchaseOrderSchema());

/**
 * Goods going back to a vendor. Sending it takes the stock out (or marks the asset
 * returned); the vendor then credits (a bm_bill with kind = credit), replaces
 * (the PO line reopens to be received again) or refunds.
 */
export const SupplierReturnSchema = () => ({
  type: 'object',
  properties: {
    name: { type: 'string', title: 'ID', readOnly: true },
    number: { type: 'string', readOnly: true, group: 'name' },
    vendorId: {
      type: 'string',
      group: 'vendor',
      'x-control': ControlType.selectMany,
      dataSource: { source: 'collection', collection: DataType.bm_vendor, value: 'name', label: 'name' },
    },
    vendorName: { type: 'string', group: 'vendor' },
    ...BusinessLocationField(),
    purchaseOrderId: { type: 'string' },
    intakeId: { type: 'string', description: 'The delivery the goods came in on' },
    rmaNumber: { type: 'string', description: "The vendor's return authorisation number" },
    lines: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          poLineId: { type: 'string' },
          sku: { type: 'string' },
          assetId: { type: 'string' },
          description: { type: 'string' },
          quantity: { type: 'number', default: 1 },
          unitCost: { type: 'number', default: 0 },
          reason: { type: 'string', enum: ['damaged', 'wrong_item', 'not_ordered', 'defective', 'excess', 'other'] },
        },
      },
    },
    total: { type: 'number', default: 0, readOnly: true },
    outcome: { type: 'string', enum: ['credit', 'replace', 'refund'], default: 'credit' },
    status: { type: 'string', enum: ['draft', 'sent', 'credited', 'replaced', 'refunded', 'cancelled'], default: 'draft', readOnly: true },
    sentAt: { type: 'string', format: 'date-time', readOnly: true },
    creditBillId: { type: 'string', readOnly: true },
    notes: { type: 'string', 'x-control-variant': 'textarea' },
  },
  required: ['vendorId', 'businessLocationId'],
} as const);

const sr = SupplierReturnSchema();
export type SupplierReturnModel = FromSchema<typeof sr>;
registerCollection('Supplier Return', DataType.bm_supplier_return, SupplierReturnSchema());
