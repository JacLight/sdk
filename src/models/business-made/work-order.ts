import { FromSchema } from 'json-schema-to-ts';
import { registerCollection } from '../../default-schema';
import { DataType, ControlType } from '../../types';

export const WorkOrderItemSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      productId: { type: 'string' },
      productName: { type: 'string' },
      description: { type: 'string' },
      quantity: { type: 'number', default: 1 },
      unitPrice: { type: 'number' },
      totalPrice: { type: 'number' },
      specifications: { type: 'object' },
      status: {
        type: 'string',
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
      },
      notes: { type: 'string' },
    },
    required: ['id', 'productName', 'quantity'],
  } as const;
};

export const WorkOrderTimeEntrySchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      employeeId: { type: 'string' },
      employeeName: { type: 'string' },
      startTime: { type: 'string', format: 'date-time' },
      endTime: { type: 'string', format: 'date-time' },
      duration: {
        type: 'number',
        description: 'Duration in hours',
      },
      taskDescription: { type: 'string' },
      billable: { type: 'boolean', default: true },
    },
    required: ['id', 'employeeId', 'startTime'],
  } as const;
};

export const WorkOrderMaterialSchema = () => {
  return {
    type: 'object',
    properties: {
      id: { type: 'string' },
      materialId: { type: 'string' },
      materialName: { type: 'string' },
      quantity: { type: 'number' },
      unit: { type: 'string' },
      unitCost: { type: 'number' },
      totalCost: { type: 'number' },
    },
    required: ['id', 'materialName', 'quantity'],
  } as const;
};

export const WorkOrderSchema = () => {
  return {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        pattern: '^[a-zA-Z_\\-0-9]*$',
        transform: ['prefix::wo-', 'random-string::6', 'uppercase'],
        group: 'name',
      },
      orderNumber: {
        type: 'string',
        unique: true,
        group: 'name',
      },
      title: {
        type: 'string',
        group: 'name',
      },
      description: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      customerId: {
        type: 'string',
        group: 'customer',
      },
      customerName: {
        type: 'string',
        group: 'customer',
      },
      customerEmail: {
        type: 'string',
        format: 'email',
        group: 'customer',
      },
      customerPhone: {
        type: 'string',
        group: 'customer',
      },
      type: {
        type: 'string',
        enum: ['standard', 'rush', 'repeat'],
        default: 'standard',
        group: 'status',
      },
      priority: {
        type: 'string',
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal',
        group: 'status',
      },
      status: {
        type: 'string',
        enum: ['draft', 'pending', 'approved', 'in_progress', 'quality_check', 'completed', 'shipped', 'cancelled'],
        default: 'draft',
        group: 'status',
      },
      items: {
        type: 'array',
        collapsible: true,
        items: WorkOrderItemSchema(),
      },
      assignedTo: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
      },
      dueDate: {
        type: 'string',
        format: 'date',
        group: 'dates',
      },
      estimatedHours: { type: 'number', group: 'hours' },
      actualHours: { type: 'number', group: 'hours' },
      timeEntries: {
        type: 'array',
        collapsible: true,
        items: WorkOrderTimeEntrySchema(),
      },
      materials: {
        type: 'array',
        collapsible: true,
        items: WorkOrderMaterialSchema(),
      },
      materialCost: { type: 'number', group: 'costs' },
      laborCost: { type: 'number', group: 'costs' },
      totalCost: { type: 'number', group: 'costs' },
      quotedPrice: { type: 'number', group: 'costs' },
      invoiceId: { type: 'string' },
      notes: {
        type: 'string',
        'x-control-variant': 'textarea',
      },
      attachments: {
        type: 'array',
        items: { type: 'string' },
      },
      tags: {
        type: 'array',
        items: { type: 'string' },
        'x-control': ControlType.selectMany,
        'x-control-variant': 'chip',
      },
      completedAt: { type: 'string', format: 'date-time' },
    },
    required: ['orderNumber', 'title'],
  } as const;
};

const wo = WorkOrderSchema();
export type WorkOrderModel = FromSchema<typeof wo>;

registerCollection('Work Order', DataType.bm_work_order, WorkOrderSchema());
