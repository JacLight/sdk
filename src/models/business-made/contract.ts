import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';
import { BusinessLocationField } from '../_location-fields';
import { FileInfoSchema } from '../file-info';

/**
 * An agreement or official document, both ways: issued by us (service agreement,
 * warranty) or received by us (supplier agreement, lease, loan, insurance, licence,
 * permit). Physical ones are scanned in; digital ones are signed through e-sign
 * (signed_document.context points here). A loan, prepaid or accrual contract carries
 * a schedule the server posts to Books each period. "Expiring" is computed on read.
 */
export const ContractSchema = () => ({
  type: 'object',
  properties: {
    name: { type: 'string', group: 'name' },
    type: {
      type: 'string',
      group: 'name',
      'x-control': ControlType.selectSingle,
      dataSource: {
        source: 'json',
        json: ['service_agreement', 'supplier_agreement', 'lease', 'loan', 'prepaid', 'accrual', 'insurance', 'licence_permit', 'warranty', 'nda', 'other'],
      },
    },
    direction: { type: 'string', enum: ['issued', 'received'], default: 'received', group: 'name' },
    counterparty: {
      type: 'object',
      properties: {
        datatype: { type: 'string', enum: ['customer', 'bm_vendor', 'bm_employee', 'other'] },
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
    ...BusinessLocationField(),
    reference: { type: 'string', description: "The other party's number: policy, licence, loan or account number" },
    format: { type: 'string', enum: ['digital', 'physical'], default: 'digital' },
    originalKeptAt: { type: 'string', description: 'format = physical: where the paper original is kept' },
    files: { type: 'array', 'x-control': ControlType.file, items: FileInfoSchema() },
    signedDocumentId: { type: 'string', readOnly: true, description: 'The e-sign request it went out on' },
    status: { type: 'string', enum: ['draft', 'out_for_signature', 'active', 'expired', 'terminated'], default: 'draft' },
    activatedOn: { type: 'string', format: 'date', readOnly: true, description: 'When it went active; Books postings start from this month' },
    termination: {
      type: 'object',
      readOnly: true,
      properties: {
        date: { type: 'string', format: 'date' },
        reason: { type: 'string' },
        by: { type: 'string' },
      },
    },
    startDate: { type: 'string', format: 'date', group: 'term' },
    endDate: { type: 'string', format: 'date', group: 'term' },
    autoRenew: { type: 'boolean', default: false, group: 'term' },
    renewalTermMonths: { type: 'number', group: 'term' },
    noticeDays: { type: 'number', default: 30, group: 'term' },
    renewals: {
      type: 'array',
      readOnly: true,
      items: {
        type: 'object',
        properties: {
          at: { type: 'string', format: 'date-time' },
          by: { type: 'string' },
          fromEndDate: { type: 'string', format: 'date' },
          toEndDate: { type: 'string', format: 'date' },
        },
      },
    },
    value: { type: 'number', group: 'money' },
    currency: { type: 'string', group: 'money' },
    schedule: {
      type: 'object',
      description: 'type = loan / prepaid / accrual: what the server posts to Books each month',
      properties: {
        principal: { type: 'number', description: 'loan: amount borrowed' },
        annualRate: { type: 'number', description: 'loan: interest rate, % a year' },
        termMonths: { type: 'number', description: 'loan / prepaid: number of months' },
        paymentAmount: { type: 'number', description: 'loan: monthly payment (computed when empty)' },
        amount: { type: 'number', description: 'prepaid: total paid up front' },
        monthlyAmount: { type: 'number', description: 'accrual: cost booked each month' },
        firstDate: { type: 'string', format: 'date', description: 'first payment / first month' },
        expenseAccountCode: { type: 'string', description: 'prepaid / accrual: the expense account' },
        bankAccountCode: { type: 'string', description: 'loan: the account payments come from' },
      },
    },
    terms: {
      type: 'object',
      description: 'Supplier / service terms agreed in the contract',
      properties: {
        paymentTerms: { type: 'string', enum: ['due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_45', 'net_60', 'net_90', 'prepay', 'custom'] },
        leadTimeDays: { type: 'number', description: 'Days from order to delivery' },
        returnWindowDays: { type: 'number', description: 'Days after delivery goods can be returned' },
        minOrderAmount: { type: 'number' },
      },
    },
    pricing: {
      type: 'array',
      description: 'Agreed prices: a purchase order under this contract starts from these',
      items: {
        type: 'object',
        properties: {
          sku: { type: 'string' },
          description: { type: 'string' },
          unitCost: { type: 'number' },
          minQuantity: { type: 'number' },
        },
      },
    },
    sla: {
      type: 'array',
      description: 'Service levels promised. Procurement measures (lead time, on-time, fill rate, return rate) are computed from the purchase orders under this contract',
      items: {
        type: 'object',
        properties: {
          metric: { type: 'string', enum: ['lead_time_days', 'on_time_rate', 'fill_rate', 'return_rate', 'response_hours', 'resolution_hours', 'uptime_rate', 'other'] },
          label: { type: 'string' },
          target: { type: 'number' },
          unit: { type: 'string', description: 'days, hours, %' },
          remedy: { type: 'string', description: 'What applies when it is missed (credit, penalty)' },
        },
      },
    },
    linked: {
      type: 'array',
      description: 'Records this contract covers: a PO, an asset (warranty), a location (lease)',
      items: {
        type: 'object',
        properties: {
          datatype: { type: 'string' },
          id: { type: 'string' },
          label: { type: 'string' },
        },
      },
    },
    assignedTo: { type: 'array', items: { type: 'string' }, description: 'Emails told about renewals and notice dates' },
    notes: { type: 'string', 'x-control-variant': 'textarea' },
  },
  required: ['name', 'type', 'direction'],
} as const);

const c = ContractSchema();
export type ContractModel = FromSchema<typeof c>;
registerCollection('Contract', DataType.bm_contract, ContractSchema());
