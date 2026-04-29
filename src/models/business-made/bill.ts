import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';

/**
 * Vendor bill (Accounts Payable counterpart to sf_invoice).
 * Captures bills received from vendors that we owe — recorded against
 * a venue, posted to GL via a journal entry on approval.
 */
export const BillLineSchema = () => ({
  type: 'object',
  properties: {
    id: { type: 'string' },
    description: { type: 'string' },
    quantity: { type: 'number', default: 1 },
    unitPrice: { type: 'number' },
    amount: { type: 'number' },
    glAccountCode: {
      type: 'string',
      description: 'Expense GL account this line posts to',
    },
    taxRate: { type: 'number' },
    taxAmount: { type: 'number' },
    notes: { type: 'string' },
  },
  required: ['amount'],
} as const);

export const BillSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: ['prefix::bil-', 'random-string::6', 'uppercase'],
      group: 'name',
    },
    number: {
      type: 'string',
      unique: true,
      readOnly: true,
      group: 'name',
    },
    vendorId: {
      type: 'string',
      'x-control': ControlType.selectMany,
      maxItems: 1,
      dataSource: { source: 'collection', collection: DataType.bm_vendor, value: 'name', label: 'name' },
      group: 'vendor',
    },
    vendorName: { type: 'string', group: 'vendor' },
    vendorRef: {
      type: 'string',
      description: 'Vendor\'s own bill / invoice reference number',
      group: 'vendor',
    },
    ...BusinessLocationField(),
    billDate: { type: 'string', format: 'date', group: 'dates' },
    receivedDate: { type: 'string', format: 'date', group: 'dates' },
    dueDate: { type: 'string', format: 'date', group: 'dates' },
    paymentTerms: {
      type: 'string',
      enum: ['due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_45', 'net_60', 'net_90', 'cod', 'prepay', 'custom'],
      group: 'dates',
    },
    currency: { type: 'string', default: 'USD' },
    status: {
      type: 'string',
      enum: ['draft', 'awaiting_approval', 'approved', 'partially_paid', 'paid', 'overdue', 'voided', 'disputed'],
      default: 'draft',
      group: 'status',
    },
    category: {
      type: 'string',
      description: 'High-level expense category (food, beverage, utilities, rent, supplies, etc.)',
      group: 'status',
    },
    lines: {
      type: 'array',
      items: BillLineSchema(),
    },
    subtotal: { type: 'number', default: 0 },
    taxTotal: { type: 'number', default: 0 },
    total: { type: 'number', default: 0 },
    paidAmount: { type: 'number', default: 0 },
    balance: { type: 'number', default: 0 },
    journalEntryId: {
      type: 'string',
      description: 'Linked journal entry created on approval',
    },
    attachments: {
      type: 'array',
      items: { type: 'string' },
      description: 'File IDs of bill PDFs / receipts',
    },
    approvedBy: { type: 'string' },
    approvedAt: { type: 'string', format: 'date-time' },
    notes: { type: 'string', 'x-control-variant': 'textarea' },
  },
  required: ['vendorId', 'businessLocationId', 'billDate', 'dueDate', 'total'],
} as const);

const b = BillSchema();
export type BillModel = FromSchema<typeof b>;
registerCollection('Vendor Bill (AP)', DataType.bm_bill, BillSchema());

export const BillPaymentSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: ['prefix::bp-', 'random-string::6', 'uppercase'],
    },
    billId: { type: 'string' },
    billNumber: { type: 'string' },
    vendorId: { type: 'string' },
    ...BusinessLocationField(),
    paymentDate: { type: 'string', format: 'date' },
    amount: { type: 'number' },
    method: {
      type: 'string',
      enum: ['ach', 'check', 'wire', 'card', 'cash', 'other'],
    },
    reference: { type: 'string', description: 'Check #, ACH ID, wire ref' },
    bankAccountId: { type: 'string', description: 'GL bank account funded from' },
    journalEntryId: { type: 'string' },
    notes: { type: 'string' },
  },
  required: ['billId', 'paymentDate', 'amount', 'method'],
} as const);

const bp = BillPaymentSchema();
export type BillPaymentModel = FromSchema<typeof bp>;
registerCollection('Bill Payment', DataType.bm_bill_payment, BillPaymentSchema());

export const VendorSchema = () => ({
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '^[a-zA-Z_\\-0-9]*$',
      transform: 'uri',
      unique: true,
      group: 'name',
    },
    displayName: { type: 'string', group: 'name' },
    legalName: { type: 'string' },
    ein: { type: 'string', description: 'Employer ID Number / TIN' },
    type: {
      type: 'string',
      enum: ['supplier', 'service', 'utility', 'landlord', 'contractor', 'other'],
      default: 'supplier',
    },
    contactName: { type: 'string', group: 'contact' },
    email: { type: 'string', format: 'email', group: 'contact' },
    phone: { type: 'string', group: 'contact' },
    website: { type: 'string', group: 'contact' },
    address: {
      type: 'object',
      properties: {
        street: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        zipCode: { type: 'string' },
        country: { type: 'string' },
      },
    },
    is1099: {
      type: 'boolean',
      default: false,
      description: 'Track YTD payments and issue 1099-NEC at year-end',
    },
    w9OnFile: { type: 'boolean', default: false },
    defaultPaymentTerms: {
      type: 'string',
      enum: ['due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_45', 'net_60', 'net_90'],
      default: 'net_30',
    },
    defaultExpenseAccount: { type: 'string' },
    active: { type: 'boolean', default: true },
    notes: { type: 'string' },
  },
  required: ['name'],
} as const);

const v = VendorSchema();
export type VendorModel = FromSchema<typeof v>;
registerCollection('Vendor', DataType.bm_vendor, VendorSchema());
